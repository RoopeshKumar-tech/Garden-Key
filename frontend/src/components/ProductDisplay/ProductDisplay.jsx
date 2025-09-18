import React, { useContext } from 'react'
import './ProductDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import ProductItem from '../ProductItem/ProductItem'

const ProductDisplay = ({ category, setShowLogin }) => {
  const { productList } = useContext(StoreContext)

  return (
    <div className='product-display' id='product-display'>
      <h2>Featured Products</h2>
      <div className="product-display-list">
        {!productList ? (
          <div>Loading...</div>
        ) : (
          productList.map((item) => {
            if (category === 'All' || category === item.category) {
              return (
                <ProductItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  category={item.category}
                  inStock={item.inStock}
                  setShowLogin={setShowLogin}
                />
              )
            }
            return null
          })
        )}
      </div>
    </div>
  )
}

export default ProductDisplay