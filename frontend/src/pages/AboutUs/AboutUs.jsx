import React from 'react'
import './AboutUs.css'

const AboutUs = () => {
  return (
    <div className="page-container">
      <div className="about-us-content">
        <h1 className="page-title">About Garden Key</h1>

        <section className="main-description">
          <p>Garden Key is your trusted partner for all things gardening. We are passionate about helping you create beautiful, thriving green spaces—whether you’re a beginner or a seasoned gardener. Our mission is to provide high-quality plants, gardening tools, and expert advice to make your gardening journey enjoyable and successful.</p>
          <ul className="feature-points">
            <li>Wide selection of healthy plants and seeds</li>
            <li>Premium gardening tools and accessories</li>
            <li>Expert gardening tips and personalized support</li>
            <li>Eco-friendly and sustainable gardening solutions</li>
            <li>Community events and workshops for plant lovers</li>
          </ul>
          <p>At Garden Key, we believe everyone can cultivate their own green paradise. Join us and unlock the joy of gardening!</p>
        </section>

        <section className="features">
          <h2>What We Offer</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <h3>Plant Selection</h3>
              <p>Choose from a wide variety of indoor and outdoor plants, seeds, and saplings for every space and skill level.</p>
              <ul className="feature-points">
                <li>Flowering plants, succulents, herbs, and more</li>
                <li>Expertly curated for your climate and needs</li>
              </ul>
            </div>
            <div className="feature-item">
              <h3>Gardening Tools & Supplies</h3>
              <p>Premium tools, planters, soil, fertilizers, and everything you need for a thriving garden.</p>
              <ul className="feature-points">
                <li>Eco-friendly and sustainable options</li>
                <li>Quality brands and durable materials</li>
              </ul>
            </div>
            <div className="feature-item">
              <h3>Expert Advice</h3>
              <p>Get personalized gardening tips, plant care guides, and troubleshooting support from our experts.</p>
              <ul className="feature-points">
                <li>Online resources and live Q&A</li>
                <li>Workshops and community events</li>
              </ul>
            </div>
            <div className="feature-item">
              <h3>Garden Design & Services</h3>
              <p>Transform your space with our garden design consultations and maintenance services.</p>
              <ul className="feature-points">
                <li>Custom garden planning</li>
                <li>On-site and virtual support</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="tech-stack">
          <h2>Our Approach</h2>
          <p>We combine a love for nature with modern gardening techniques to help you grow healthy, beautiful plants. Our focus is on sustainability, education, and community.</p>
          <ul className="feature-points">
            <li>Organic and eco-friendly practices</li>
            <li>Innovative gardening solutions</li>
            <li>Continuous learning and improvement</li>
          </ul>
        </section>

        <section className="mission">
          <h2>Our Mission</h2>
          <p>We're committed to making gardening accessible, enjoyable, and rewarding for everyone. Whether you have a balcony or a backyard, Garden Key is here to help you grow.</p>
          <ul className="feature-points">
            <li>Promote green living and sustainability</li>
            <li>Support gardeners at every stage</li>
            <li>Foster a vibrant gardening community</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default AboutUs
