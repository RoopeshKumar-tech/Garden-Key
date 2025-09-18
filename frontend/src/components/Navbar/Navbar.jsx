import React, { useState, useEffect, useRef, useContext } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { StoreContext } from '../../context/StoreContext';
import Login from '../Login/Login';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ menu, setMenu = () => { } }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { cart } = useCart();
  const { productList, loading: contextLoading } = useContext(StoreContext);
  const { logout } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData && userData.name) {
        setUserName(userData.name);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, [token]);

  const handleNavigation = (menuItem, id) => {
    if (typeof setMenu === 'function') {
      setMenu(menuItem);
    }

    if (menuItem === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSearch = async (searchTerm) => {
    setSearchQuery(searchTerm);
    setIsLoading(true);

    try {
      if (searchTerm.length > 0) {
        const filtered = productList.filter(item =>
          item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item?.brand?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      toast.error('Error while searching products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchIconClick = () => {
    if (!token) {
      setShowLogin(true);
      return;
    }
    setShowSearch(!showSearch);
  };

  const handleProductClick = (product) => {
    navigate('/product-details', { state: product });
    setShowSearch(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    setUserName('');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <>
      <div className="navbar">
        <Link to='/' onClick={() => handleNavigation("home")} className="navbar-logo">
          <img src={assets.logo} alt="logo" />
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link
              to='/'
              onClick={() => handleNavigation("home")}
              className={menu === "home" ? "active" : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to='/'
              onClick={() => handleNavigation("Categories", "explore-categories")}
              className={menu === "Categories" ? "active" : ""}
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              to='/hire-gardener'
              className={menu === "hire-gardener" ? "active" : ""}
            >
              Hire Gardener
            </Link>
          </li>
          <li>
            <Link to='/#app-download' onClick={() => handleNavigation("mobile-app", "app-download")} className={menu === "mobile-app" ? "active" : ""}>
              Mobile App
            </Link>
          </li>
          <li>
            <Link to='/#footer' onClick={() => handleNavigation("contact", "footer")} className={menu === "contact" ? "active" : ""}>
              Contact
            </Link>
          </li>
        </ul>
        <div className="navbar-right">
          <div className="search-container" ref={searchRef}>
            <div className="search-input-wrapper">
              <img
                src={assets.search_icon}
                alt="search"
                onClick={handleSearchIconClick}
                title={!token ? "Login to search products" : "Search products"}
              />
              {showSearch && token && (
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                  autoFocus
                />
              )}
            </div>
            {showSearch && token && (
              <div className="search-results">
                {isLoading || contextLoading ? (
                  <div className="loading">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="search-result-item"
                      onClick={() => handleProductClick(product)}
                    >
                      <img src={product.image} alt={product.name} />
                      <div className="search-result-details">
                        <span className="product-name">{product.name}</span>
                        <span className="product-price">₹{product.price}</span>
                      </div>
                    </div>
                  ))
                ) : searchQuery && (
                  <div className="no-results">
                    <p>No products found!</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <Link to="/cart" className="navbar-cart">
            <img src={assets.basket_icon} alt="cart" />
            {cart?.items?.length > 0 && (
              <div className="cart-count">{cart.items.length}</div>
            )}
          </Link>
          <Link to="/orders">
            <img src={assets.order_icon} alt="orders" />
          </Link>
          <img src={assets.bell_icon} alt="notifications" />
          <div className="user-section">
            {token && userName && (
              <span className="welcome-text">Hi, {userName}!</span>
            )}
            <button
              className={`login-btn ${token ? 'logged-in' : ''}`}
              onClick={() => token ? handleLogout() : setShowLogin(true)}
            >
              {token ? (
                <>
                  <span>Logout</span>
                </>
              ) : (
                'Login / Signup'
              )}
            </button>
          </div>
        </div>
      </div>
      {showLogin && <Login setShowLogin={setShowLogin} />}
    </>
  );
};

export default Navbar;
