import React, { useContext, useEffect, useRef, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { addressToForm } from '../../utils/addresses';

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
});

const PlaceOrder = () => {

    const [payment, setPayment] = useState("cod")
    const [data, setData] = useState(emptyForm)
    const [useNewAddress, setUseNewAddress] = useState(true)
    const [selectedAddressId, setSelectedAddressId] = useState(null)
    const [saveAfterOrder, setSaveAfterOrder] = useState(true)
    const addressBootstrap = useRef(false)
    const lastSavedAddressId = useRef(null)

    const {
        getTotalCartAmount,
        token,
        food_list,
        cartItems,
        url,
        setCartItems,
        currency,
        deliveryCharge,
        savedAddresses,
        addSavedAddress
    } = useContext(StoreContext);

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    useEffect(() => {
        if (savedAddresses.length === 0) {
            addressBootstrap.current = false
            setUseNewAddress(true)
            setSelectedAddressId(null)
            return
        }
        if (!addressBootstrap.current) {
            addressBootstrap.current = true
            setUseNewAddress(false)
            const first = savedAddresses[0]
            setSelectedAddressId(first.id)
            setData(addressToForm(first))
        }
    }, [savedAddresses])

    const selectSavedAddress = (addr) => {
        setUseNewAddress(false)
        setSelectedAddressId(addr.id)
        setData(addressToForm(addr))
    }

    const chooseNewAddress = () => {
        lastSavedAddressId.current = selectedAddressId
        setUseNewAddress(true)
        setSelectedAddressId(null)
        setData(emptyForm())
    }

    const backToSavedAddresses = () => {
        if (savedAddresses.length === 0) return
        const fallback = lastSavedAddressId.current
        const pick =
            (fallback && savedAddresses.find((a) => a.id === fallback)) ||
            savedAddresses[0]
        setUseNewAddress(false)
        setSelectedAddressId(pick.id)
        setData(addressToForm(pick))
    }

    const maybeSaveNewAddress = () => {
        if (!saveAfterOrder || !useNewAddress) return
        addSavedAddress(data)
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];
        food_list.map(((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        }))
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
        }
        if (payment === "stripe") {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                maybeSaveNewAddress()
                const { session_url } = response.data;
                window.location.replace(session_url);
            }
            else {
                toast.error("Something Went Wrong")
            }
        }
        else {
            let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
            if (response.data.success) {
                maybeSaveNewAddress()
                navigate("/myorders")
                toast.success(response.data.message)
                setCartItems({});
            }
            else {
                toast.error("Something Went Wrong")
            }
        }

    }

    useEffect(() => {
        if (!token) {
            toast.error("to place an order sign in first")
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])

    const showAddressForm = useNewAddress || savedAddresses.length === 0

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>

                {savedAddresses.length > 0 && !useNewAddress ? (
                    <div className="place-order-saved-block">
                        <p className="place-order-saved-title">Deliver to</p>
                        <div className="place-order-saved-list" role="list">
                            {savedAddresses.map((addr) => (
                                <button
                                    key={addr.id}
                                    type="button"
                                    role="listitem"
                                    className={`place-order-saved-card ${selectedAddressId === addr.id ? 'place-order-saved-card--active' : ''}`}
                                    onClick={() => selectSavedAddress(addr)}
                                >
                                    <span className={`place-order-saved-radio ${selectedAddressId === addr.id ? 'place-order-saved-radio--on' : ''}`} aria-hidden />
                                    <span className="place-order-saved-text">
                                        <span className="place-order-saved-name">{addr.firstName} {addr.lastName}</span>
                                        <span className="place-order-saved-line">{addr.street}</span>
                                        <span className="place-order-saved-line">{addr.city}, {addr.state} {addr.zipcode}{addr.country ? `, ${addr.country}` : ''}</span>
                                        <span className="place-order-saved-meta">{addr.phone}</span>
                                        <span className="place-order-saved-meta">{addr.email}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                        <button type="button" className="place-order-add-new" onClick={chooseNewAddress}>
                            <span className="place-order-add-new-icon" aria-hidden>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </span>
                            Add new address
                        </button>
                    </div>
                ) : null}

                {showAddressForm ? (
                    <div className={`place-order-form-panel ${savedAddresses.length > 0 ? 'place-order-form-panel--nested' : ''}`}>
                        {savedAddresses.length > 0 ? (
                            <button type="button" className="place-order-back-saved" onClick={backToSavedAddresses}>
                                ← Choose a saved address
                            </button>
                        ) : null}
                        <p className="place-order-form-heading">
                            {savedAddresses.length > 0 ? 'New delivery address' : 'Enter delivery details'}
                        </p>
                        <div className="multi-field">
                            <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                            <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                        </div>
                        <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                        <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street, house / flat no.' required />
                        <div className="multi-field">
                            <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                            <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                        </div>
                        <div className="multi-field">
                            <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Pin code' required />
                            <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                        </div>
                        <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
                        <label className="place-order-save-check">
                            <input
                                type="checkbox"
                                checked={saveAfterOrder}
                                onChange={(e) => setSaveAfterOrder(e.target.checked)}
                            />
                            <span>Save this address for next time</span>
                        </label>
                    </div>
                ) : null}
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment === "cod" ? "Place Order" : "Proceed To Payment"}</button>
            </div>
        </form>
    )
}

export default PlaceOrder
