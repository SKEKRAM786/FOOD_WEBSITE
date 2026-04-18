import React, { useContext } from 'react'
import './Profile.css'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Profile = () => {
  const { deliveryLocation } = useContext(StoreContext)

  return (
    <div className="account-page profile-page">
      <h2>Profile</h2>
      <p className="account-page-lead">
        View and manage your Bite Hub account details here. More options will appear as we grow the app.
      </p>
      <div className="account-page-card">
        {deliveryLocation ? (
          <p className="profile-location-line">
            <span className="profile-location-label">Delivery location</span>
            <strong className="profile-location-city">{deliveryLocation}</strong>
          </p>
        ) : (
          <p className="profile-location-line profile-location-line--empty">
            <span className="profile-location-label">Delivery location</span>
            <span className="profile-location-missing">Not set — choose the location pin in the header</span>
          </p>
        )}
        <p>You’re signed in. Order history is available under My Orders.</p>
        <Link to="/" className="account-page-link">← Back to home</Link>
      </div>
    </div>
  )
}

export default Profile
