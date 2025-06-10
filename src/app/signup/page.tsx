"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { hashPassword } from "../lib/auth";

export default function SignupPage() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [ID,setID] = useState("");
  const [phone, setPhone] =  useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const hashedPassword = await hashPassword(password);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, ID, phone, password: hashedPassword }),
    });
    const result = await response.json();
    console.log(result);
    // if (response.ok) {
    //   router.replace("/profile");
    // }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input
        type="text"
        value={ID}
        onChange ={(e) => setID(e.target.value)}
        placeholder="National ID or Passport ID"
      />
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number"
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}