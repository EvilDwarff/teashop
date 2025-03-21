"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import LogoutButton from "./LogoutButton";
import { useRouter } from "next/navigation";
import { Prosto_One, Montserrat } from "next/font/google";

const prostoOne = Prosto_One({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ weight: "400", subsets: ["latin"] });

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/account");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Ошибка парсинга пользователя:", error);
      router.push("/account");
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/order/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });

        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error("Ошибка загрузки заказов:", error);
      }
    };

    fetchOrders();
  }, [user]);

  useEffect(() => {
    fetch("/api/order/statuses")
      .then(res => res.json())
      .then(data => setStatuses(data.statuses))
      .catch(err => console.error("Ошибка загрузки статусов:", err));
  }, []);

  const handleStatusChange = async (order_id, status_id) => {
    try {
      const res = await fetch("/api/order/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id, status_id }),
      });

      if (res.ok) {
        setOrders(prev =>
          prev.map(order =>
            order.order_id === order_id
              ? { ...order, status_id, order_status: statuses.find(s => s.id === status_id).name }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
    }
  };

  if (!user) {
    return (
      <div>
        <Header />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (user.role !== 1) {
    return (
      <div>
        <Header />
        <h1>У вас нет доступа</h1>
        <LogoutButton />
      </div>
    );
  }

  return (
    <div >
      <Header />
      <div className="container mx-auto p-4">
      <h1 className={`${prostoOne.className} text-[22px] mb-2`}>Админ</h1>
      <h2 className={`${prostoOne.className} text-[22px] mb-2`}>Заказы</h2>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-500">Заказов пока нет</p>
        ) : (
          orders.map((order) => (
            <div key={order.order_id} className="flex justify-between mb-4 p-4 border rounded-lg bg-gray-100">
              <div className="flex flex-col">
                <span className="font-semibold">Заказ #{order.order_id}</span>
                <span className="text-sm text-gray-600">{order.order_date}</span>
                <span>{order.address} | {order.payment_method}</span>
                <span>Сумма: ${parseFloat(order.total_amount).toFixed(2)}</span>
              </div>

              <div>
                <select 
                  value={order.status_id} 
                  onChange={(e) => handleStatusChange(order.order_id, Number(e.target.value))}
                  className="border px-2 py-1 rounded-md bg-white"
                >
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      <LogoutButton />
      </div>
    </div>
  );
}
