import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

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
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

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

  async function getProductById(productId: number) {

    api.get('products/' + productId).then((response) => { return response.data })


  }

  const addProduct = async (productId: number) => {
    try {
      const localDataCard = localStorage.getItem('@RocketShoes:cart')
      const productData = await api.get('products/' + productId).then((response) => { return response.data })
      const productAmountStock = await api.get('stock/' + productId).then((response) => { return response.data })
      let newData

      if (localDataCard) {
        // tem itens no carrinho
        let localDataCardJson = JSON.parse(localDataCard)
        const existIdCard = localDataCardJson.map((item: Product) => { return item.id })
        const searchIdCart = existIdCard.indexOf(productId)

        if (searchIdCart >= 0) {

          const quantAmountProduct = localDataCardJson[searchIdCart].amount + 1

          quantAmountProduct > productAmountStock.amount ?
            toast.error('Produto sem estoque no momento')
            :
            localDataCardJson[searchIdCart].amount++;
            newData = localDataCardJson
            ;

        } else {

          newData = [
            ...localDataCardJson,
            {
              ...productData,
              amount: 1
            }
          ]

        }

      } else {
        // new item card
        newData = [
          {
            ...productData,
            amount: 1
          }
        ]

      }

      setCart(newData)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newData))


    } catch (error) {
      toast.error('Não conseguimos adicionar no seu carrinho')
    }
  };



  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
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
