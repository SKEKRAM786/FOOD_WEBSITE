import React, { useContext, useEffect, useRef, useState } from 'react'
import './Header.css'
import { StoreContext } from '../../Context/StoreContext'
import banner1 from '../../assets/banner1.jpg'
import banner2 from '../../assets/banner2.jpg'
import banner3 from '../../assets/banner3.jpg'
import banner4 from '../../assets/banner4.jpg'
import banner5 from '../../assets/banner5.jpg'
import banner6 from '../../assets/banner6.jpg'
import banner7 from '../../assets/banner7.jpg'

const SLIDE_INTERVAL_MS = 5000

const slides = [
  {
    image: banner1,
    title: 'Order your favourite food here',
    description:
      'Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.',
    shortLine: 'Fine ingredients, unforgettable flavour — delivered to you.',
  },
  {
    image: banner2,
    title: 'Fresh from the kitchen to your door',
    description:
      'Hot, hygienic, and beautifully plated — every order is prepared with care so it arrives tasting as good as it looks. Bite Hub brings restaurant-quality meals home without the wait.',
    shortLine: 'Restaurant-quality meals, zero compromise.',
  },
  {
    image: banner3,
    title: 'Cravings satisfied, one bite at a time',
    description:
      'Whether you are in the mood for comfort classics or something new to try, our chefs and partner kitchens are ready. Browse, tap, and track your order from prep to doorstep.',
    shortLine: 'From comfort food to new flavours — all in one app.',
  },
  {
    image: banner4,
    title: 'Share the table, share the joy',
    description:
      'Planning dinner for family or friends? Mix and match dishes everyone will love with transparent pricing and reliable delivery windows — so you can focus on the moment, not the logistics.',
    shortLine: 'Family-sized feasts, simple ordering.',
  },
  {
    image: banner5,
    title: 'Fuel your day the delicious way',
    description:
      'Balanced bowls, hearty mains, and lighter options — pick what fits your routine. We partner with trusted kitchens so you always know what is on your plate.',
    shortLine: 'Balanced choices for busy days.',
  },
  {
    image: banner6,
    title: 'Late-night bites, early-morning fuel',
    description:
      'Hungry after hours or need breakfast in a hurry? Bite Hub keeps popular slots open longer with real-time availability — because great food should not follow a strict schedule.',
    shortLine: 'Early or late — we have you covered.',
  },
  {
    image: banner7,
    title: 'Your next favourite dish is one tap away',
    description:
      'Save your go-to orders, explore curated picks, and pay securely in seconds. Download-worthy meals start here — welcome to Bite Hub.',
    shortLine: 'Save favourites. Reorder in seconds.',
  },
]

const Header = () => {
  const { deliveryLocation, openDeliveryLocationPicker } = useContext(StoreContext)
  const [active, setActive] = useState(0)
  const timerRef = useRef(null)

  const startAutoplay = () => {
    if (timerRef.current != null) {
      window.clearInterval(timerRef.current)
    }
    timerRef.current = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)
  }

  useEffect(() => {
    startAutoplay()
    return () => {
      if (timerRef.current != null) {
        window.clearInterval(timerRef.current)
      }
    }
  }, [])

  const goToMenu = () => {
    document.getElementById('explore-menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  const current = slides[active]

  return (
    <div className="header">
      <div className="header-slides" aria-hidden="true">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`header-slide${index === active ? ' header-slide--active' : ''}`}
          >
            <img src={slide.image} alt="" />
          </div>
        ))}
      </div>
      <div className="header-contents">
        <button
          type="button"
          className="header-home-location"
          onClick={openDeliveryLocationPicker}
          aria-label={deliveryLocation ? `Delivery location ${deliveryLocation}. Click to change` : "Choose delivery location"}
        >
          <span className="header-home-location-pin" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.5C12 21.5 19 16.52 19 11a7 7 0 1 0-14 0c0 5.52 7 10.5 7 10.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <circle cx="12" cy="10.5" r="2.2" fill="currentColor" />
            </svg>
          </span>
          {deliveryLocation ? (
            <span className="header-home-location-text">
              Ordering in <strong>{deliveryLocation}</strong>
            </span>
          ) : (
            <span className="header-home-location-text header-home-location-placeholder">
              Tap to set your delivery area
            </span>
          )}
        </button>
        <div
          className="header-copy"
          key={active}
          aria-live="polite"
        >
          <h2>{current.title}</h2>
          <p className="header-desc header-desc--full">{current.description}</p>
          <p className="header-desc header-desc--short">{current.shortLine}</p>
        </div>
        <button type="button" className="header-cta" onClick={goToMenu}>
          View Menu
        </button>
      </div>
      <div className="header-dots" role="tablist" aria-label="Banner slides">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={`header-dot${index === active ? ' header-dot--active' : ''}`}
            onClick={() => {
              setActive(index)
              startAutoplay()
            }}
            aria-label={`Show banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Header
