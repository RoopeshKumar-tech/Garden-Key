import React from 'react'
import './ProductItem.css'
import { useNavigate } from 'react-router-dom'

const ProductItem = ({
  id,
  name,
  image,
  category,
  price,
  description,
  inStock,
  setShowLogin
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setShowLogin(true)
      return
    }
    navigate('/product-details', {
      state: {
        id,
        name,
        image,
        category,
        price,
        description,
        inStock
      }
    })
  }

  return (
    <div className='product-item' id={id} onClick={handleClick}>
      <img className='product-image' src={image} alt={name} />
      <div className='product-info'>
        <h3 className='product-name'>{name}</h3>
        <p className='product-price'>₹{price}</p>
        <span className={`stock-status ${!inStock ? 'out-of-stock' : ''}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  )
}

export default ProductItem