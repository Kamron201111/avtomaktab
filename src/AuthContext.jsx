import React, { createContext, useContext, useState } from "react";
import { supabase } from "./supabaseClient.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // User login (telefon + tug‘ilgan yil)
  async function loginUser(phone, birthYear) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .filter("birth_date", "gte", `${birthYear}-01-01`)
      .filter("birth_date", "lt", `${Number(birthYear) + 1}-01-01`)
      .single();

    if (error || !data) return false;

    setUser(data);
    setIsAdmin(false);
    return true;
  }

  // 🆕 USER REGISTER (agar bor bo‘lsa — login qiladi)
  async function registerUser(phone, birthDate) {
    // 1️⃣ Avval qo‘shib ko‘ramiz
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          phone: phone,
          birth_date: birthDate,
        },
      ])
      .select()
      .single();

    // 2️⃣ Agar muvaffaqiyatli bo‘lsa
    if (!error && data) {
      setUser(data);
      setIsAdmin(false);
      return true;
    }

    // 3️⃣ Agar UNIQUE error bo‘lsa → user allaqachon bor
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("phone", phone)
      .single();

    if (existingUser) {
      setUser(existingUser);
      setIsAdmin(false);
      return true;
    }

    return false;
  }

  // Admin login
  async function loginAdmin(username, password) {
    const { data, error } = await supabase
      .from("admin")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) return false;

    setUser(data);
    setIsAdmin(true);
    return true;
  }

  function logout() {
    setUser(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loginUser,
        registerUser,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
