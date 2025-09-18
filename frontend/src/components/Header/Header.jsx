import React from 'react'
import './Header.css'

const Header = ({ setShowLogin }) => {
  const handleViewNow = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setShowLogin(true)
      return
    }
    document.getElementById('explore-categories').scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='header'>
        <div className="header-contents">
        <h2>Green Living, Rooted in Style</h2>
        <p> Discover our exclusive collection of premium garden essentials. From vibrant plants and eco-friendly tools to outdoor décor and organic soil blends, find everything you need to create a space that blooms with beauty and purpose. Curated by experts, our selection is designed to suit every garden type and lifestyle. Explore the latest trends and timeless classics that help your green space flourish in style.</p>
            <button onClick={handleViewNow}>View Now</button>
        </div>
    </div>
  )
}

export default Header