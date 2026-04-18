import React, { useContext, useEffect, useState } from 'react'
import '../Profile/Profile.css'
import './Addresses.css'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import { toast } from 'react-toastify'
const emptyForm = () => ({
  firstName: "",
  lastName: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
  phone: ""
})

const Addresses = () => {
  const { token, savedAddresses, addSavedAddress, removeSavedAddress } = useContext(StoreContext)
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!token) {
      toast.error("Sign in to manage addresses")
      navigate("/")
    }
  }, [token, navigate])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const id = addSavedAddress(form)
    if (id) {
      toast.success("Address saved")
      setForm(emptyForm())
      setShowForm(false)
    } else {
      toast.error("Fill in at least one field")
    }
  }

  const handleRemove = (id) => {
    removeSavedAddress(id)
    toast.success("Address removed")
  }

  if (!token) return null

  return (
    <div className="account-page addresses-page">
      <h2>Addresses</h2>

      {savedAddresses.length > 0 ? (
        <ul className="addresses-list">
          {savedAddresses.map((addr) => (
            <li key={addr.id} className="addresses-card">
              <div className="addresses-card-body">
                <p className="addresses-card-name">{addr.firstName} {addr.lastName}</p>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} {addr.zipcode}, {addr.country}</p>
                <p className="addresses-card-meta">{addr.phone} · {addr.email}</p>
              </div>
              <button type="button" className="addresses-remove" onClick={() => handleRemove(addr.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {!showForm ? (
        <button type="button" className="addresses-add-toggle" onClick={() => setShowForm(true)}>
          + Add new address
        </button>
      ) : (
        <form className="addresses-form account-page-card" onSubmit={handleAdd}>
          <p className="addresses-form-title">New address</p>
          <div className="addresses-form-row">
            <input name="firstName" value={form.firstName} onChange={onChange} placeholder="First name" required />
            <input name="lastName" value={form.lastName} onChange={onChange} placeholder="Last name" required />
          </div>
          <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Email" required />
          <input name="street" value={form.street} onChange={onChange} placeholder="Street" required />
          <div className="addresses-form-row">
            <input name="city" value={form.city} onChange={onChange} placeholder="City" required />
            <input name="state" value={form.state} onChange={onChange} placeholder="State" required />
          </div>
          <div className="addresses-form-row">
            <input name="zipcode" value={form.zipcode} onChange={onChange} placeholder="Zip code" required />
            <input name="country" value={form.country} onChange={onChange} placeholder="Country" required />
          </div>
          <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" required />
          <div className="addresses-form-actions">
            <button type="submit" className="addresses-submit">Save address</button>
            <button type="button" className="addresses-cancel" onClick={() => { setShowForm(false); setForm(emptyForm()); }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <Link to="/" className="account-page-link addresses-back">← Back to home</Link>
    </div>
  )
}

export default Addresses
