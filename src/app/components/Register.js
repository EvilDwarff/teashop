"use client";

import { useState } from "react";

export default function Register({ setUser, setShowRegister }) {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    if (
      !formData.login ||
      !formData.password ||
      !formData.name ||
      !formData.email
    ) {
      setError("All fields are required!");
      return;
    }
    setError("");

    // Регистрация
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setSuccessMessage("Registration successful! Please log in.");
      setFormData({ login: "", password: "", name: "", email: "" }); // Очистка формы
    } else {
      setError("Registration failed, try again.");
    }
  }

  return (
    <form onSubmit={handleRegister} className="flex flex-col space-y-4">
      {error && <p className="text-center text-red-600">{error}</p>}
      {successMessage && (
        <p className="text-center text-green-600">{successMessage}</p>
      )}
      <input
        type="text"
        placeholder="Login"
        value={formData.login}
        onChange={(e) => setFormData({ ...formData, login: e.target.value })}
        className="border px-4 py-2 rounded-md"
        required
        onInvalid={(e) => {
          e.target.setCustomValidity("This field is required");
        }}
        onInput={(e) => {
          e.target.setCustomValidity("");
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="border px-4 py-2 rounded-md"
        required
        onInvalid={(e) => {
          e.target.setCustomValidity("This field is required");
        }}
        onInput={(e) => {
          e.target.setCustomValidity("");
        }}
      />
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="border px-4 py-2 rounded-md"
        required
        onInvalid={(e) => {
          e.target.setCustomValidity("This field is required");
        }}
        onInput={(e) => {
          e.target.setCustomValidity("");
        }}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="border px-4 py-2 rounded-md"
        required
        onInvalid={(e) => {
          e.target.setCustomValidity("This field is required");
        }}
        onInput={(e) => {
          e.target.setCustomValidity("");
        }}
      />
      <button
        type="submit"
        className="bg-black text-white py-2 rounded-md hover:bg-gray-800"
      >
        Register
      </button>
      <button
        type="button"
        onClick={() => setShowRegister(false)}
        className="text-blue-600 hover:underline"
      >
        
      </button>
    </form>
  );
}