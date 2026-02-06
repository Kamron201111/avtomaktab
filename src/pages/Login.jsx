import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber, validatePhoneNumber, getFullPhoneNumber } from "../utils/phoneFormatter.js";

function Login() {
  const { loginUser, loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // User login state
  const [userPhone, setUserPhone] = useState("");
  const [userBirthYear, setUserBirthYear] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Admin login state
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  function handlePhoneChange(e) {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setUserPhone(formattedPhone);
    
    if (formattedPhone.length > 0 && !validatePhoneNumber(formattedPhone)) {
      setPhoneError("Telefon raqami to'liq emas");
    } else {
      setPhoneError("");
    }
  }

  async function handleUserLogin(e) {
    e.preventDefault();
    if (!userPhone || !userBirthYear) {
      setError("Barcha maydonlarni to'ldiring!");
      return;
    }

    if (!validatePhoneNumber(userPhone)) {
      setError("Telefon raqamini to'g'ri kiriting!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await loginUser(getFullPhoneNumber(userPhone), userBirthYear);
      if (success) {
        navigate("/darsliklar");
      } else {
        console.log(userPhone, userBirthYear);
        setError("Telefon raqam yoki tug'ilgan yil noto'g'ri!");
      }
    } catch (error) {
      setError("Kirishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    if (!adminUsername || !adminPassword) {
      setError("Barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);
    setError("Login yoki parol xato ");

    try {
      const success = await loginAdmin(adminUsername, adminPassword);
      if (success) {
        navigate("/admin-users");
      } else {
        setError("Login yoki parol noto'g'ri!");
      }
    } catch (error) {
      setError("Kirishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 mb-2">
            {isAdminLogin ? "Admin kirish" : "Foydalanuvchi kirish"}
          </h2>
          <p className="text-secondary-600">
            {isAdminLogin ? "Administrator paneliga kirish" : "AvtoTest platformasiga kirish"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8"
        >
          {/* Toggle buttons */}
          <div className="flex mb-8 bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => {
                setIsAdminLogin(false);
                setError("");
                setUserPhone("");
                setUserBirthYear("");
                setPhoneError("");
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isAdminLogin
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Foydalanuvchi</span>
              </div>
            </button>
            <button
              onClick={() => {
                setIsAdminLogin(true);
                setError("");
                setAdminUsername("");
                setAdminPassword("");
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isAdminLogin
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-secondary-600 hover:text-secondary-900"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Admin</span>
              </div>
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-error-700 font-medium">{error}</span>
              </div>
            </motion.div>
          )}

          {!isAdminLogin ? (
            // User Login Form
            <form onSubmit={handleUserLogin} className="space-y-6">
              <div>
                <label htmlFor="userPhone" className="block text-sm font-medium text-secondary-700 mb-2">
                  Telefon raqam
                </label>
                <div className="relative">
                  <input
                    id="userPhone"
                    type="tel"
                    placeholder="+998(XX)XXX-XX-XX"
                    value={userPhone}
                    onChange={handlePhoneChange}
                    className={`input-field ${phoneError ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                {phoneError && (
                  <p className="text-error-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>

              <div>
                <label htmlFor="userBirthYear" className="block text-sm font-medium text-secondary-700 mb-2">
                  Tug'ilgan yil
                </label>
                <div className="relative">
                  <input
                    id="userBirthYear"
                    type="number"
                    placeholder="1990"
                    min="1950"
                    max="2010"
                    value={userBirthYear}
                    onChange={(e) => setUserBirthYear(e.target.value)}
                    className="input-field"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phoneError || !userPhone || !userBirthYear}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Kirilmoqda...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Kirish</span>
                  </div>
                )}
              </button>
            </form>
          ) : (
            // Admin Login Form
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label htmlFor="adminUsername" className="block text-sm font-medium text-secondary-700 mb-2">
                  Login
                </label>
                <div className="relative">
                  <input
                    id="adminUsername"
                    type="text"
                    placeholder="Admin login"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="input-field"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                  Parol
                </label>
                <div className="relative">
                  <input
                    id="adminPassword"
                    type="password"
                    placeholder="Parol"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="input-field"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !adminUsername || !adminPassword}
                className="btn-primary w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Kirilmoqda...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Admin kirish</span>
                  </div>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-secondary-500">
              {!isAdminLogin ? (
                <>
                  <span>Foydalanuvchi hisobingiz yo'qmi? </span>
                  <span className="text-primary-600 font-medium">Admin bilan bog'laning</span>
                </>
              ) : (
                <>
                  <span>Foydalanuvchi bo'lsangiz </span>
                  <button
                    onClick={() => setIsAdminLogin(false)}
                    className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    bu yerga bosing
                  </button>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login; 
