import React from 'react'
import './Legal.css'

const Legal = () => {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <div className="terms-conditions">
          <h1>Terms and Conditions</h1>
          <p className="last-updated">Effective Date: Friday, 21 March 2025</p>
          <p className="location">Location: Bengaluru, Karnataka, India</p>

          <div className="intro">
            <p>Welcome to Garden Key! By accessing or using our services, you agree to be bound by these Terms and Conditions ("Terms"). Please read them carefully before using the Garden Key platform.</p>
          </div>

          <div className="terms-sections">
            {termsData.map((term, index) => (
              <section key={index} className="term-section">
                <h2>{term.title}</h2>
                {Array.isArray(term.content) ? (
                  <ul>
                    {term.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{term.content}</p>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const termsData = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing Garden Key's website or services, you confirm your acceptance of these Terms. If you do not agree, you may not use our services."
  },
  {
    title: "2. Order Processing",
    content: [
      "Orders are typically processed within 2-5 business days.",
      "Processing times may vary during peak seasons or for custom orders."
    ]
  },
  {
    title: "3. Product Information",
    content: [
      "We strive for accuracy in product descriptions and images, but actual products may vary slightly.",
      "Plant sizes, colors, and growth rates may differ due to natural variations.",
      "Please review our care guides and product details before purchasing."
    ]
  },
  {
    title: "4. Returns and Warranties",
    content: [
      "Live plants are non-returnable unless they arrive damaged or unhealthy.",
      "Non-plant items may be returned within 7 days if unused and in original packaging.",
      "Contact us within 24 hours of delivery for any issues with your order."
    ]
  },
  {
    title: "5. User Accounts",
    content: [
      "Users must provide accurate information when creating an account or placing an order.",
      "Account holders are responsible for maintaining the confidentiality of their login credentials.",
      "Users must be at least 18 years old to make purchases."
    ]
  },
  {
    title: "6. Gardening Advice Disclaimer",
    content: "Advice and tips provided by Garden Key are for informational purposes only. Results may vary based on local conditions and individual care."
  },
  {
    title: "7. Privacy",
    content: "Our Privacy Policy explains how we handle your personal information. By using Garden Key, you agree to our Privacy Policy."
  },
  {
    title: "8. Governing Law",
    content: "These Terms will be governed by and construed in accordance with the laws of India."
  },
  {
    title: "9. Contact Us",
    content: "For questions regarding these Terms, contact us at support@gardenkey.com"
  }
]

export default Legal