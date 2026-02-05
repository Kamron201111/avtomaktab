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

  // 🆕 USER REGISTER (RO‘YXATDAN O‘TISH)
  async function registerUser(phone, birthDate) {
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

    if (error || !data) return false;

    setUser(data);
    setIsAdmin(false);
    return true;
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
        registerUser, // 👈 QO‘SHILDI
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
