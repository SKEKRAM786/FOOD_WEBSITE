import React, { useContext, useEffect, useRef, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const QUICK_CITIES = [
  "Bangalore", "Delhi", "Mumbai", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Gurgaon", "Noida", "Kochi", "Goa", "Indore",
];

const LocationPinIcon = () => (
  <svg className="navbar-location-pin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 21.5C12 21.5 19 16.52 19 11a7 7 0 1 0-14 0c0 5.52 7 10.5 7 10.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="12" cy="10.5" r="2.2" fill="currentColor" />
  </svg>
);

const Navbar = ({ setShowLogin, searchQuery, setSearchQuery }) => {

  const [menu, setMenu] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [locDraft, setLocDraft] = useState("");
  const searchWrapRef = useRef(null);
  const searchInputRef = useRef(null);
  const profileWrapRef = useRef(null);
  const locationWrapRef = useRef(null);
  const { getTotalCartAmount, token, setToken, deliveryLocation, setDeliveryLocation, subscribeLocationPicker } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const deliveryLocationRef = useRef(deliveryLocation);
  deliveryLocationRef.current = deliveryLocation ?? "";

  useEffect(() => {
    if (!searchOpen) return;
    const onDoc = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      const t = window.setTimeout(() => searchInputRef.current?.focus(), 10);
      return () => window.clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    setProfileOpen(false);
    setLocOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!locOpen) return;
    const onDoc = (e) => {
      if (locationWrapRef.current && !locationWrapRef.current.contains(e.target)) {
        setLocOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setLocOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [locOpen]);

  useEffect(() => {
    return subscribeLocationPicker(() => {
      setLocDraft(deliveryLocationRef.current || "");
      setLocOpen(true);
    });
  }, [subscribeLocationPicker]);

  useEffect(() => {
    if (!profileOpen) return;
    const onDoc = (e) => {
      if (profileWrapRef.current && !profileWrapRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const scrollToDishes = () => {
    const el = document.getElementById("food-display");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const prevTrim = (searchQuery || "").trim();
    const nextTrim = value.trim();

    setSearchQuery(value);

    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(scrollToDishes, 120);
      return;
    }

    if (nextTrim.length > 0 && prevTrim.length === 0) {
      requestAnimationFrame(scrollToDishes);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(scrollToDishes, 120);
    } else {
      scrollToDishes();
    }
  };

  const logout = () => {
    setProfileOpen(false);
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

  const goProfileItem = (path) => {
    setProfileOpen(false);
    navigate(path);
  }

  const openLocationPicker = () => {
    setLocDraft(deliveryLocation || "");
    setLocOpen((o) => !o);
  };

  const applyLocation = () => {
    setDeliveryLocation(locDraft);
    setLocOpen(false);
  };

  const pickQuickCity = (city) => {
    setDeliveryLocation(city);
    setLocDraft(city);
    setLocOpen(false);
  };

  const scrollToExploreMenu = (e) => {
    e.preventDefault()
    setMenu("menu")
    const run = () =>
      document.getElementById("explore-menu")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    if (window.location.pathname !== "/") {
      navigate("/")
      window.setTimeout(run, 80)
    } else {
      run()
    }
  }

  return (
    <div className='navbar'>
      <div className="navbar-start">
        <Link to='/' className='navbar-brand'>Bite Hub</Link>
      </div>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>Home</Link>
        <a href='#explore-menu' onClick={scrollToExploreMenu} className={`${menu === "menu" ? "active" : ""}`}>Menu</a>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>Contact us</a>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-wrap" ref={searchWrapRef}>
          {!searchOpen ? (
            <button
              type="button"
              className="navbar-search-toggle"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              aria-expanded="false"
            >
              <img src={assets.search_icon} alt="" />
            </button>
          ) : (
            <form
              className="navbar-search navbar-search--expanded"
              onSubmit={handleSearchSubmit}
              aria-expanded="true"
            >
              <input
                ref={searchInputRef}
                type="search"
                className="navbar-search-input"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search dishes"
                autoComplete="off"
                name="q"
              />
              <button type="submit" className="navbar-search-btn" aria-label="Run search">
                Search
              </button>
            </form>
          )}
        </div>
        <Link to='/cart' className='navbar-cart-link'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile' ref={profileWrapRef}>
            <button
              type="button"
              className="navbar-profile-trigger"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-label="Account menu"
            >
              <img src={assets.profile_icon} alt="" />
            </button>
            <ul
              className={`navbar-profile-dropdown${profileOpen ? " navbar-profile-dropdown--open" : ""}`}
              role="menu"
              aria-hidden={!profileOpen}
            >
              <li className="navbar-profile-location" aria-live="polite">
                <span className="navbar-profile-location-icon" aria-hidden>
                  <LocationPinIcon />
                </span>
                <div className="navbar-profile-location-body">
                  <span className="navbar-profile-location-label">Your location</span>
                  <span className="navbar-profile-location-city">
                    {deliveryLocation || "Not set — use the pin icon"}
                  </span>
                </div>
              </li>
              <li role="menuitem" onClick={() => goProfileItem("/profile")}>
                <img src={assets.profile_icon} alt="" /> <p>Profile</p>
              </li>
              <li role="menuitem" onClick={() => goProfileItem("/myorders")}>
                <img src={assets.bag_icon} alt="" /> <p>My Orders</p>
              </li>
              <li role="menuitem" onClick={() => goProfileItem("/addresses")}>
                <img src={assets.parcel_icon} alt="" /> <p>Addresses</p>
              </li>
              <hr />
              <li role="menuitem" onClick={logout}>
                <img src={assets.logout_icon} alt="" /> <p>Logout</p>
              </li>
            </ul>
          </div>
        }
        <div className="navbar-location-wrap" ref={locationWrapRef}>
          <div className="navbar-location-inner">
            <button
              type="button"
              className={`navbar-location-trigger${deliveryLocation ? " navbar-location-trigger--with-label" : ""}`}
              onClick={openLocationPicker}
              aria-expanded={locOpen}
              aria-haspopup="dialog"
              aria-label={deliveryLocation ? `Location: ${deliveryLocation}. Change` : "Choose delivery location"}
            >
              <LocationPinIcon />
              {deliveryLocation ? (
                <span className="navbar-location-label-text">{deliveryLocation}</span>
              ) : null}
            </button>
            {locOpen ? (
              <div className="navbar-location-popover" role="dialog" aria-label="Choose delivery location">
                <label className="navbar-location-label">
                  City or area
                  <input
                    type="text"
                    className="navbar-location-input"
                    value={locDraft}
                    onChange={(e) => setLocDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyLocation())}
                    placeholder="e.g. Bangalore, Delhi"
                    autoComplete="off"
                  />
                </label>
                <button type="button" className="navbar-location-apply" onClick={applyLocation}>
                  Apply
                </button>
                <p className="navbar-location-quick-title">Popular</p>
                <div className="navbar-location-chips">
                  {QUICK_CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      className="navbar-location-chip"
                      onClick={() => pickQuickCity(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar
