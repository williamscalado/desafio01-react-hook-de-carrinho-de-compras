import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types'


type ProductView = Omit<Product, 'amout'>

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  // const { addProduct, cart } = useCart();

  // const cartItemsAmount = cart.reduce((sumAmount, product) => {
  //   // TODO
  // }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      api.get('products').then((response: any) => {

        const ProductsData = response.data
        ProductsData && setProducts([])
        setProducts(ProductsData)

      })
    }

   loadProducts();
  }, []);




  function handleAddProduct(id: number) {
    //console.log(id)
  }

  return (
    <ProductList>
      {products.map((item: ProductView) => {
        return (
          <li key={item.id}>
            <img src={item.image} alt="Tênis de Caminhada Leve Confortável" />
            <strong>{item.title}</strong>
            <span>{formatPrice(item.price)}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(item.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {/* {cartItemsAmount[product.id] || 0} */} 1
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
