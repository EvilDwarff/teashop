"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Prosto_One, Montserrat } from "next/font/google";

const prostoOne = Prosto_One({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ weight: "400", subsets: ["latin"] });

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [weight, setWeight] = useState(250);
  const [price, setPrice] = useState(0);
  const [user, setUser] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error loading product:", err));
  }, [id]);

  useEffect(() => {
    if (product) {
      const calculatedPrice = (product.price_per_gram * weight).toFixed(2);
      setPrice(calculatedPrice);
    }
  }, [product, weight]);

  const showModalWithTimeout = (message) => {
    setModalMessage(message);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 5000);
  };

  const handleAddToCart = async () => {
    try {
      if (!user) {
        showModalWithTimeout("You need to register to add items to the cart");
        setTimeout(() => router.push("/account"), 2000);
        return;
      }

      // Получаем или создаем корзину
      let cartId = localStorage.getItem("cart_id");

      if (!cartId) {
        const createResponse = await fetch("/api/cart/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_user: user.id }),
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          throw new Error(errorData.error || "Error creating cart");
        }

        const { cart_id } = await createResponse.json();
        cartId = cart_id;
        localStorage.setItem("cart_id", cartId);
      }

      // Добавляем товар
      const addResponse = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: cartId,
          product_id: product.id,
          quantity: weight,
        }),
      });

      if (!addResponse.ok) {
        const errorData = await addResponse.json();
        if (errorData.error === "Cart not found") {
          localStorage.removeItem("cart_id");
        }
        throw new Error(errorData.error || "Error adding product");
      }

      // Обновляем состояние корзины
      window.dispatchEvent(new Event("cartUpdated"));
      showModalWithTimeout("Product added to cart successfully!");
    } catch (error) {
      console.error("Error:", error);
      showModalWithTimeout(error.message);
    }
  };

  if (!product)
    return <p className="text-center text-gray-600 mt-8">Loading...</p>;

  return (
    <div>
      <Header />
      <div className={`${montserrat.className} p-4 max-w-4xl mx-auto`}>
        <div className="flex gap-8 items-center">
          <div className="w-1/2 h-[300px] flex justify-center items-center">
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
          <div className="w-1/2 h-[300px] bg-gray-100 p-6 rounded-lg flex flex-col justify-between">
<h1 className={`${prostoOne.className} text-2xl font-bold break-words`}>{product.name}</h1>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Country:</span>
<span className={`${montserrat.className} font-semibold`}>{product.country}</span>

            </div>
            <div className="flex flex-col mt-4">
<span className={`${montserrat.className} text-3xl font-bold`}>${price}</span>

              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full mt-2"
              />
              <span className="text-gray-600">{weight}g</span>
            </div>
            <button
              className="bg-black text-white px-6 py-2 rounded-md"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Модальное окно */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
              <p className="text-lg font-semibold">{modalMessage}</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Блок информации о чае */}
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
<h2 className={`${prostoOne.className} text-xl font-bold mb-4`}>Brewing Instructions</h2>

          <p>
            <strong>Serving Size:</strong> 2 tsp per cup, 6 tsp per pot
          </p>
          <p>
            <strong>Water Temperature:</strong> 100°C
          </p>
          <p>
            <strong>Brewing Time:</strong> 3 - 5 minutes
          </p>

<h2 className={`${prostoOne.className} text-xl font-bold mt-6`}>About This Tea</h2>

          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>Flavor:</strong> {product.flavor}
            </p>
            <p>
              <strong>Qualities:</strong> {product.qualities}
            </p>
            <p>
              <strong>Caffeine:</strong> {product.caffeine}
            </p>
            <p>
              <strong>Allergens:</strong> {product.allergens}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
