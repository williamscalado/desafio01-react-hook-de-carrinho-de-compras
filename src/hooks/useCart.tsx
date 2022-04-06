import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';


const globalLocalStorageName = '@RocketShoes:cart'
interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
  getAllProduct: Product[]

}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {

  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem(globalLocalStorageName)

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const [getAllProduct, setgetAllProduct] = useState<Product[]>([])
  useEffect(() => {
    async function loadProducts() {
      api.get('products').then((response: any) => {

        const ProductsData = response.data
        ProductsData && setgetAllProduct([])
        setgetAllProduct(ProductsData)
      })
    }
    loadProducts();
   }, []);


  const localStorageRef = useRef<Product[]>()

  useEffect(() => {
    localStorageRef.current = cart
  })
  const localStorageRefValeu = localStorageRef.current ?? cart

  useEffect(() => {
    if (localStorageRefValeu !== cart) {
      localStorage.setItem(globalLocalStorageName, JSON.stringify(cart))
    }
  }, [cart, localStorageRefValeu])


  const addProduct = async (productId: number) => {
    try {
      const productAmountStock = await api.get('stock/' + productId).then((response) => { return response.data })
      const updateDataCart = [...cart]
      const productExist = updateDataCart.find((product: Product) => product.id === productId)
      const currentAmount = productExist ? productExist.amount : 0
      const amountProduct = currentAmount + 1


      if (amountProduct > productAmountStock.amount) {
        toast.error('Quantidade solicitada fora de estoque')
        return
      }


      if (productExist) {
        productExist.amount++;
      } else {

        const productData = await api.get('products/' + productId);
        updateDataCart.push({
          ...productData.data,
          amount: 1
        })
      }

      setCart(updateDataCart)

    } catch (error) {
      console.log(error)
      toast.error('Erro na adição do produto')
    }
  };


  const removeProduct = (productId: number) => {
    try {

      const localDataCardJson = [...cart]
      const searchIdCart = localDataCardJson.findIndex(product => product.id === productId)

      if (searchIdCart >= 0) {

        localDataCardJson.splice(searchIdCart, 1)
        setCart(localDataCardJson)


      } else {
        throw Error();
      }

      // TODO
    } catch {
      toast.error('Erro na remoção do produto')
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const localDataCard = localStorage.getItem(globalLocalStorageName)
      if (localDataCard) {
        // tem itens no carrinho
        let localDataCardJson = JSON.parse(localDataCard)
        const existIdCard = localDataCardJson.map((item: Product) => { return item.id })
        const searchIdCart = existIdCard.indexOf(productId)
        const productAmountStock = await api.get('stock/' + productId).then((response) => { return response.data })
        if (searchIdCart >= 0) {
          // TODO
          const quantAmountProduct = localDataCardJson[searchIdCart].amount = amount
          quantAmountProduct > productAmountStock.amount ?
            toast.error('Quantidade solicitada fora de estoqueo')
            :
            localDataCardJson[searchIdCart].amount = amount

            ;



          setCart(localDataCardJson)


        }



      }
    } catch {
      // TODO
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount, getAllProduct }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
