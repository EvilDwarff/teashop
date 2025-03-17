"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function LogoutButton() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart_id");
    localStorage.removeItem("token");
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      router.push("/");
    }, 2000);
  };

  return (
    <>
      <button
        onClick={handleLogout}
        className="mt-6 bg-[#3D3D3D] text-white uppercase text-[14px] leading-[20px] tracking-[0.1px] px-8 py-4 w-[263px] h-[56px] text-center hover:bg-gray-600"
      >
        Logout
      </button>

      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <p className="text-lg font-semibold">You Logout.</p>
            <button
              onClick={() => setShowAlert(false)}
              className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 border-3"
            >
              ОК
            </button>
          </div>
        </div>
      )}
    </>
  );
}
