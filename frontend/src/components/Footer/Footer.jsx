import React from 'react'
import './Footer.css'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Footer = () => {
  const { pathname } = useLocation()
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <p className="footer-brand">Bite Hub</p>
            <p id="about" className="footer-anchor">
              Bite Hub is your neighbourhood kitchen, online: chef-inspired dishes, strict hygiene, and reliable delivery so every meal arrives hot, fresh, and ready to eat. From comfort classics to weekend treats, we are here when you are hungry.
            </p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>COMPANY</h2>
            <ul>
                <li>
                  <Link
                    to="/"
                    className="footer-link"
                    onClick={() => {
                      if (pathname === '/') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        window.setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }
                    }}
                  >
                    Home
                  </Link>
                </li>
                <li><Link to="/#about" className="footer-link">About us</Link></li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li><a href="tel:+919861794245" className="footer-link">9861794245</a></li>
                <li><a href="mailto:contact@bitehub.com" className="footer-link">contact@bitehub.com</a></li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2026 © Bite Hub - All Rights Reserved.</p>
    </div>
  )
}

export default Footer
