import React from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { ProductList } from './styles';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types'

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  
  const { addProduct, cart , getAllProduct } = useCart();
  
   const cartItemsAmount = cart.reduce((acc, item)=>{
     
     acc[item.id] = item.amount
     
     return acc

   }, {} as CartItemsAmount )

  
  const newGetAllProduct = getAllProduct.map((item) => {    
   return  {
      ...item,
      priceFormatted : formatPrice(item.price)
    }

  })
 
  function handleAddProduct(id: number) {
    //console.log(id)
    addProduct(id)
  }

  return (
    <ProductList>
      {newGetAllProduct.map((item: ProductFormatted) => {
        return (
          <li key={item.id}>
            <img src={item.image} alt={item.title} />
            <strong>{item.title}</strong>
            <span>{item.priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(item.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[item.id] || 0} 
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        )

      })}

    </ProductList>
  );
};

export default Home;
