import { Link } from 'react-router-dom'
import './Footer.css'
import { assets } from '../../assets/assets'
import { useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  }

  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <div className="footer-logo" onClick={scrollToTop}>
            <img 
              src={assets.logo} 
              alt="Garden Key Logo" 
              className="footer-logo-img"
            />
            <div className="footer-logo-text" onClick={scrollToTop}>
              <span className="tagline">Unlock Your Green Paradise</span>
            </div>
          </div>
          <p>© {currentYear} All rights reserved</p>
          <div className="footer-trendy-lines">
            <p>🌱 Grow green, live clean</p>
            <p>🌿 Your garden, your key to happiness</p>
          </div>
        </div>

        <div className="footer-content-center">
          <div className="connect-section">
            <h3>Connect</h3>
            <div className="footer-social-icons">
              <a href="https://www.instagram.com/Karna.3137/" target="_blank" rel="noopener noreferrer">
                <img src={assets.instagram_icon} alt="Instagram" />
              </a>
              <a href="https://x.com/Durgesh_offl?t=YEq6Xv3wYQwIuQ4zoQnfcg&s=09" target="_blank" rel="noopener noreferrer">
                <img src={assets.twitter_icon} alt="Twitter" />
              </a>
              <a href="https://www.linkedin.com/in/Roopesh-Kumar-K/" target="_blank" rel="noopener noreferrer">
                <img src={assets.linkedin_icon} alt="LinkedIn" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-content-right">
          <h2>Get in touch</h2>
          <ul>
            <li>Bengaluru, Karnataka</li>
            <li>Phone: 6363848504</li>
            <li>Email: roopeshkumar063@gmail.com</li>
          </ul>

          <div className="footer-subscribe">
            <form onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
            {subscribed && (
              <p className="subscribe-message">🎉 Thanks for subscribing! Stay tuned for updates!</p>
            )}
          </div>
        </div>
      </div>
      <hr />
      <p className='footer-text'>Made with ❤ by <span className="footer-name">Roopesh Kumar K</span></p>
    </div>
  )
}

export default Footer