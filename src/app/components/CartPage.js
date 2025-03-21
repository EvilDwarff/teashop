'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Image from "next/image";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [updatingItems, setUpdatingItems] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const router = useRouter();
  

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.push("/account");
          return;
        }

        const user = JSON.parse(storedUser);
        const response = await fetch("/api/cart/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });

        if (!response.ok) throw new Error("Failed to load cart");
        
        const data = await response.json();
        setCartItems(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const getCartId = async (user_id) => {
    const response = await fetch("/api/cart/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });
    return (await response.json()).cart_id;
  };

  const removeFromCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const cart_id = await getCartId(user.id);

      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_id, product_id: productToDelete }),
      });

      if (response.ok) {
        setCartItems(prev => prev.filter(item => item.product_id !== productToDelete));
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error removing item");
      setShowErrorModal(true);
    } finally {
      setShowConfirmModal(false);
      setProductToDelete(null);
    }
  };

  

  const handleQuantityChange = async (product_id, newQuantity) => {
    try {
      setUpdatingItems(prev => ({...prev, [product_id]: true}));
      
      newQuantity = Math.max(50, Math.min(1000, newQuantity));
      
      const user = JSON.parse(localStorage.getItem("user"));
      
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product_id,
          quantity: newQuantity
        }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error ||  "Update error");
      }
  
      setCartItems(prev => prev.map(item => 
        item.product_id === product_id 
          ? {...item, quantity: data.quantity} 
          : item
      ));
  
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message);
      setShowErrorModal(true);
    } finally {
      setUpdatingItems(prev => ({...prev, [product_id]: false}));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (item.quantity * item.price_per_gram), 0
    ).toFixed(2);
  };
const ConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <p className="mb-4 text-lg">Are you sure you want to remove this item?</p>
        <div className="flex gap-4 justify-end">
          <button 
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={removeFromCart}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  const ErrorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <p className="mb-4 text-red-500">{errorMessage}</p>
        <button 
          onClick={() => setShowErrorModal(false)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <Header />
        <div className="container mt-8 text-center">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="container mt-8 text-center text-red-500">{error}</div>
      </div>
    );
  }



  const handleSubmitOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        router.push("/account");
        return;
      }
  
      console.log("Отправляем адрес:", address); // Лог для проверки перед отправкой
  
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          address,  // Теперь передается полный адрес
          payment_method: paymentMethod
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Ошибка при создании заказа");
  
      setCartItems([]);
      setIsOrderModalOpen(false);
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        router.push("/account");
      }, 3000);
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      setErrorMessage(error.message);
      setShowErrorModal(true);
    }
  };
  

 
  const OrderModal = ({ address, setAddress, setIsOrderModalOpen, handleSubmitOrder }) => {
    const [tempAddress, setTempAddress] = useState(address); // Временный стейт для корректного ввода
  
    useEffect(() => {
      setTempAddress(address); // Обновляем, если переданный адрес изменился
    }, [address]);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
  
          <div className="mb-4">
            <label className="block mb-2 font-medium">Delivery Address</label>
            <textarea
              value={tempAddress} // Ввод теперь работает без багов
              onChange={(e) => setTempAddress(e.target.value)} // Локально обновляем
              onBlur={() => setAddress(tempAddress)} // Записываем в основной стейт при потере фокуса
              className="w-full p-2 border rounded"
              rows="3"
              placeholder="Enter delivery address"
            />
          </div>
  
          <div className="mb-6">
            <label className="block mb-2 font-medium">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Card">Credit/Debit Card</option>
              <option value="Cash">Cash on Delivery</option>
            </select>
          </div>
  
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold">${calculateTotal()}</span>
          </div>
  
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => {
                setAddress(tempAddress); // Фиксим потерю данных при закрытии
                setIsOrderModalOpen(false);
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setAddress(tempAddress); // Перед отправкой точно записываем
                handleSubmitOrder();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    );
  };
  










const SuccessMessage = () => (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      Order placed successfully!
    </div>
  );




  return (
  
    <div>
      <Header />
      <div className="container justify-center min-h-screen p-9 ">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Your cart is empty</p>
            <button 
              onClick={() => router.push("/products")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-gray-600">{item.collection}</p>
                    
                    <div className="mt-4 flex flex-col gap-4">
                      <div className="w-full">
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="50"
                            max="1000"
                            step="50"
                            value={item.quantity}
                            onChange={(e) => 
                              handleQuantityChange(
                                item.product_id, 
                                parseInt(e.target.value))
                            }
                            className="w-full"
                            disabled={updatingItems[item.product_id]}
                          />
                          <span className="w-24 text-center border rounded py-1">
                            {item.quantity}g
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>50g</span>
                          <span>1000g</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold">
                            ${(item.quantity * item.price_per_gram).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${item.price_per_gram}/g
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setProductToDelete(item.product_id);
                            setShowConfirmModal(true);
                          }}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
<div className="bg-gray-50 p-6 rounded-lg sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl">Total:</span>
                <span className="text-2xl font-bold">${calculateTotal()}</span>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {orderSuccess && <SuccessMessage />}
      {isOrderModalOpen && (
  <OrderModal
    address={address}
    setAddress={setAddress}
    setIsOrderModalOpen={setIsOrderModalOpen}
    handleSubmitOrder={handleSubmitOrder}
  />
)}
      {showConfirmModal && <ConfirmModal />}
      {showErrorModal && <ErrorModal />}
    </div>
  );
}
