import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  formatPhoneNumber,
  validatePhoneNumber,
  getFullPhoneNumber,
} from "../utils/phoneFormatter.js";

function Login() {
  const { loginUser, loginAdmin, registerUser } = useAuth();
  const navigate = useNavigate();

  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User states
  const [userPhone, setUserPhone] = useState("");
  const [userBirthYear, setUserBirthYear] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Admin states
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  function handlePhoneChange(e) {
    const formatted = formatPhoneNumber(e.target.value);
    setUserPhone(formatted);

    if (formatted.length > 0 && !validatePhoneNumber(formatted)) {
      setPhoneError("Telefon raqami to‘liq emas");
    } else {
      setPhoneError("");
    }
  }

  // 🔥 USER LOGIN → bo‘lmasa AUTO REGISTER
  async function handleUserLogin(e) {
    e.preventDefault();

    if (!userPhone || !userBirthYear) {
      setError("Barcha maydonlarni to‘ldiring!");
      return;
    }

    if (!validatePhoneNumber(userPhone)) {
      setError("Telefon raqamini to‘g‘ri kiriting!");
      return;
    }

    setLoading(true);
    setError("");

    const phone = getFullPhoneNumber(userPhone);

    try {
      // 1️⃣ Avval LOGIN qilib ko‘ramiz
      const loginSuccess = await loginUser(phone, userBirthYear);

      if (loginSuccess) {
        navigate("/darsliklar");
        return;
      }

      // 2️⃣ Agar login bo‘lmasa → REGISTER
      const registerSuccess = await registerUser(
        phone,
        `${userBirthYear}-01-01`
      );

      if (registerSuccess) {
        navigate("/darsliklar");
      } else {
        setError("Kirishda xatolik yuz berdi!");
      }
    } catch {
      setError("Kirishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  }

  // ADMIN LOGIN
  async function handleAdminLogin(e) {
    e.preventDefault();

    if (!adminUsername || !adminPassword) {
      setError("Barcha maydonlarni to‘ldiring!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await loginAdmin(adminUsername, adminPassword);
      if (success) {
        navigate("/admin");
      } else {
        setError("Login yoki parol noto‘g‘ri!");
      }
    } catch {
      setError("Kirishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="max-w-md w-full card p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isAdminLogin ? "Admin kirish" : "Kirish / Ro‘yxatdan o‘tish"}
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-center font-medium">
            {error}
          </div>
        )}

        {!isAdminLogin ? (
          <form onSubmit={handleUserLogin} className="space-y-4">
            <input
              type="tel"
              placeholder="+998(XX)XXX-XX-XX"
              value={userPhone}
              onChange={handlePhoneChange}
              className="input-field"
              disabled={loading}
            />

            <input
              type="number"
              placeholder="Tug‘ilgan yil (1999)"
              value={userBirthYear}
              onChange={(e) => setUserBirthYear(e.target.value)}
              className="input-field"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || phoneError}
              className="btn-primary w-full"
            >
              {loading ? "Kuting..." : "Kirish"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAdminLogin(true);
                setError("");
              }}
              className="w-full text-sm text-gray-500"
            >
              Admin bilan bog‘lanish
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Admin login"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Parol"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="input-field"
            />

            <button type="submit" className="btn-primary w-full">
              Admin kirish
            </button>

            <button
              type="button"
              onClick={() => setIsAdminLogin(false)}
              className="w-full text-sm text-primary-600"
            >
              Orqaga
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
