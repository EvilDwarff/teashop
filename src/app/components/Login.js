"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login({ setUser }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    if (!login || !password) {
      setError("All fields are required!");
      return;
    }
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    if (res.ok) {
      const { user } = await res.json();
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/account");
    } else {
      setError("Invalid login or password.");
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col space-y-4">
      {error && <p className="text-center text-red-600">{error}</p>}
      <input
        type="text"
        placeholder="Login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        Log In
      </button>
    </form>
  );
}
