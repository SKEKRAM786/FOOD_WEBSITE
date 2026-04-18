import { createContext, useCallback, useEffect, useState } from "react";
import { food_list as seedFoodList, menu_list } from "../assets/assets";
import axios from "axios";
import {
    getUserIdFromToken,
    readAddresses,
    writeAddresses,
    pickAddressFields,
} from "../utils/addresses";
export const StoreContext = createContext(null);

/** Same host the admin panel uses — set VITE_API_URL in .env for production (e.g. your Render URL). */
const API_URL = (import.meta.env.VITE_API_URL || "").trim() || "http://localhost:4000";

const DELIVERY_LOCATION_KEY = "bitehub_delivery_location";

const locationPickerListeners = new Set();

const StoreContextProvider = (props) => {

    const url = API_URL
    const [foodList, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [deliveryLocation, setDeliveryLocationState] = useState(() =>
        typeof localStorage !== "undefined" ? (localStorage.getItem(DELIVERY_LOCATION_KEY) || "") : ""
    );
    const currency = "₹";
    const deliveryCharge = 50;

    /** Prefer React state, fall back to localStorage so cart API works right after login before re-render. */
    const authToken = () => (token || (typeof localStorage !== "undefined" ? localStorage.getItem("token") : "") || "");

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        const t = authToken();
        if (t) {
            try {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token: t } });
            } catch (e) {
                console.warn("Cart sync failed", e);
            }
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        const t = authToken();
        if (t) {
            try {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token: t } });
            } catch (e) {
                console.warn("Cart sync failed", e);
            }
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = foodList.find((product) => String(product._id) === String(item));
                totalAmount += itemInfo.price * cartItems[item];
            }  
            } catch (error) {
                
            }
            
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            const apiData = response.data.data || [];
            const apiIds = new Set(apiData.map((p) => String(p._id)));
            const fromAssets = seedFoodList.filter((p) => !apiIds.has(String(p._id)));
            setFoodList([...apiData, ...fromAssets]);
        } catch (e) {
            console.warn("Food list API unavailable, using bundled menu.", e);
            setFoodList(seedFoodList);
        }
    }

    const loadCartData = async (auth) => {
        const t =
            typeof auth === "string" && auth
                ? auth
                : auth && typeof auth === "object" && auth.token
                  ? auth.token
                  : localStorage.getItem("token");
        if (!t) return;
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: t } });
            if (response.data?.success) {
                setCartItems(response.data.cartData || {});
            } else {
                setCartItems({});
            }
        } catch (e) {
            console.warn("Could not load cart", e);
            setCartItems({});
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData({ token: localStorage.getItem("token") })
            }
        }
        loadData()
    }, [])

    useEffect(() => {
        const uid = getUserIdFromToken(token);
        setSavedAddresses(uid ? readAddresses(uid) : []);
    }, [token]);

    const setDeliveryLocation = (value) => {
        const v = String(value || "").trim();
        setDeliveryLocationState(v);
        if (v) localStorage.setItem(DELIVERY_LOCATION_KEY, v);
        else localStorage.removeItem(DELIVERY_LOCATION_KEY);
    };

    const subscribeLocationPicker = useCallback((fn) => {
        locationPickerListeners.add(fn);
        return () => locationPickerListeners.delete(fn);
    }, []);

    const openDeliveryLocationPicker = useCallback(() => {
        locationPickerListeners.forEach((fn) => {
            try {
                fn();
            } catch (e) {
                console.error(e);
            }
        });
    }, []);

    const addSavedAddress = (payload) => {
        const uid = getUserIdFromToken(token);
        if (!uid) return null;
        const fields = pickAddressFields(payload);
        if (!Object.values(fields).some((v) => String(v).trim())) return null;
        const entry = {
            id: crypto.randomUUID(),
            ...fields,
            createdAt: Date.now(),
        };
        setSavedAddresses((prev) => {
            const next = [...prev, entry];
            writeAddresses(uid, next);
            return next;
        });
        return entry.id;
    };

    const removeSavedAddress = (id) => {
        const uid = getUserIdFromToken(token);
        if (!uid) return;
        setSavedAddresses((prev) => {
            const next = prev.filter((a) => a.id !== id);
            writeAddresses(uid, next);
            return next;
        });
    };

    const contextValue = {
        url,
        food_list: foodList,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge,
        savedAddresses,
        addSavedAddress,
        removeSavedAddress,
        deliveryLocation,
        setDeliveryLocation,
        subscribeLocationPicker,
        openDeliveryLocationPicker
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;