"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Login from "./Login";
import Register from "./Register";
import Header from "./Header";
import LogoutButton from "./LogoutButton";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null); // New state for order details
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Ошибка при разборе данных пользователя:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/order/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });

        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders || []);
          console.log("🔍 Заказы:", data.orders); // Log the orders to verify they are set correctly
        }
      } catch (error) {
        console.error("Ошибка загрузки заказов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const fetchOrderDetails = async (orderId) => {
    if (!orderId) {
      console.error("❌ Ошибка: Order ID не передан!");
      return;
    }

    console.log("🔍 Запрос на детали заказа:", orderId);

    try {
      const response = await fetch("/api/order/get-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }), // Теперь точно передаем ID
      });

      const data = await response.json();

      if (response.ok) {
        console.log("📦 Получены детали заказа:", data);
        setOrderDetails(data.items || []); // Исправлено на `data.items`
      } else {
        console.error("❌ Ошибка API:", data.error);
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки деталей заказа:", error);
    }
  };

  return (
    <div className="bg-[#F4F4F4] min-h-screen flex flex-col">
      <Header />
      {!user ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="bg-white p-8 shadow-md rounded-lg w-96">
            {showRegister ? (
              <Register setUser={setUser} setShowRegister={setShowRegister} />
            ) : (
              <Login setUser={setUser} />
            )}
            <button
              onClick={() => setShowRegister(!showRegister)}
              className="mt-4 text-blue-600 hover:underline w-full text-center"
            >
              {showRegister
                ? "Already have an account? Log In"
                : "Don’t have an account? Sign Up"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="bg-white p-8 shadow-md rounded-lg w-96 text-center">
            <h2 className="text-xl font-semibold">Account Information</h2>
            <p className="mt-4 text-gray-700">
              <strong>Name:</strong> {user.name || "Not provided"}
            </p>
            <p className="text-gray-700">
              <strong>Email:</strong> {user.email || "Not provided"}
            </p>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">История заказов</h3>
              {loading ? (
                <p>Загрузка заказов...</p>
              ) : orders.length === 0 ? (
                <p>У вас пока нет заказов</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.order_id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">
                          Заказ #{order.order_id}
                        </span>
                        <span className="text-sm text-gray-600">
                          {order.order_date}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Статус: {order.order_status}</span>
                        <span className="font-semibold">
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => fetchOrderDetails(order.order_id)} // Передаем ID заказа
                        className="mt-2 text-blue-600 hover:underline"
                      >
                        Показать детали
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {orderDetails && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Детали заказа:</h4>
                <ul className="list-disc list-inside">
                  {orderDetails.map((item) => (
                    <li key={item.name}>
                      {item.name}<br/> Количество: {item.quantity} - Цена: $
                      {item.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
