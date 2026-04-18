import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className="navbar-brand">
        <span className="navbar-brand-title">Bite Hub</span>
        <span className="navbar-brand-sub">Admin</span>
      </div>
      <img className='profile' src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar
