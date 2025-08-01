import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.jsx";
import { useAuth } from "../AuthContext.jsx";
import { Navigate } from "react-router-dom";
import { formatPhoneNumber, validatePhoneNumber, getFullPhoneNumber } from "../utils/phoneFormatter.js";

function AdminUsers() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ 
    fio: "", 
    phone: "", 
    passport: "", 
    birth_date: "", 
    category: "B" 
  });
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  async function fetchUsers() {
    setLoading(true);
    try {
      let { data } = await supabase.from("users").select("*");
      setUsers(data || []);
    } catch (error) {
      console.error("Foydalanuvchilarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  }

  function handlePhoneChange(e) {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setNewUser(u => ({ ...u, phone: formattedPhone }));
    
    // Validatsiya
    if (formattedPhone.length > 0 && !validatePhoneNumber(formattedPhone)) {
      setPhoneError("Telefon raqami to'liq emas");
    } else {
      setPhoneError("");
    }
  }

  async function addUser() {
    if (!newUser.fio || !newUser.phone || !newUser.passport || !newUser.birth_date) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }

    if (!validatePhoneNumber(newUser.phone)) {
      alert("Telefon raqamini to'g'ri kiriting!");
      return;
    }
    
    try {
      const userData = {
        ...newUser,
        phone: getFullPhoneNumber(newUser.phone)
      };
      
      const { error } = await supabase.from("users").insert([userData]);
      if (!error) {
        setNewUser({ fio: "", phone: "", passport: "", birth_date: "", category: "B" });
        setPhoneError("");
        fetchUsers();
        alert("Foydalanuvchi muvaffaqiyatli qo'shildi!");
      } else {
        alert("Xatolik: " + error.message);
      }
    } catch (error) {
      alert("Xatolik: " + error.message);
    }
  }

  async function deleteUser(id) {
    if (window.confirm("Foydalanuvchini o'chirishni xohlaysizmi?")) {
      try {
        const { error } = await supabase.from("users").delete().eq("id", id);
        if (!error) {
          setUsers(users.filter(u => u.id !== id));
          alert("Foydalanuvchi o'chirildi!");
        } else {
          alert("Xatolik: " + error.message);
        }
      } catch (error) {
        alert("Xatolik: " + error.message);
      }
    }
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="px-6 py-4 border-b border-secondary-200 bg-gradient-to-r from-primary-50 to-accent-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Foydalanuvchilarni boshqarish</h1>
                <p className="text-secondary-600">Yangi foydalanuvchilar qo'shish va mavjudlarni boshqarish</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Yangi foydalanuvchi qo'shish
              </h2>
              <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">FIO</label>
                    <input 
                      placeholder="Familiya va ism" 
                      value={newUser.fio} 
                      onChange={e => setNewUser(u => ({ ...u, fio: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Telefon raqam</label>
                    <input 
                      placeholder="+998(XX)XXX-XX-XX" 
                      value={newUser.phone} 
                      onChange={handlePhoneChange}
                      className={`input-field ${phoneError ? 'border-error-500' : ''}`}
                    />
                    {phoneError && (
                      <p className="text-error-500 text-sm mt-1">{phoneError}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Passport</label>
                    <input 
                      placeholder="AB1234567" 
                      value={newUser.passport} 
                      onChange={e => setNewUser(u => ({ ...u, passport: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Tug'ilgan sana</label>
                    <input 
                      type="date"
                      value={newUser.birth_date} 
                      onChange={e => setNewUser(u => ({ ...u, birth_date: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Kategoriya</label>
                    <select 
                      value={newUser.category} 
                      onChange={e => setNewUser(u => ({ ...u, category: e.target.value }))}
                      className="input-field"
                    >
                      <option value="A">A - Mototsikl</option>
                      <option value="B">B - Avtomobil</option>
                      <option value="C">C - Yuk avtomobili</option>
                      <option value="BC">BC - Avtomobil va yuk avtomobili</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={addUser}
                      disabled={phoneError || !newUser.fio || !newUser.phone || !newUser.passport || !newUser.birth_date}
                      className="btn-success w-full"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Qo'shish</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Foydalanuvchilar ro'yxati ({users.length})
              </h2>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="min-w-full divide-y divide-secondary-200">
                    <thead className="bg-secondary-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">FIO</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Telefon</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Passport</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Tug'ilgan sana</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Kategoriya</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-secondary-200">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-secondary-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-secondary-900">{u.fio}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{u.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{u.passport}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{new Date(u.birth_date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              u.category === 'A' ? 'bg-warning-100 text-warning-800' :
                              u.category === 'B' ? 'bg-primary-100 text-primary-800' :
                              u.category === 'C' ? 'bg-success-100 text-success-800' :
                              'bg-accent-100 text-accent-800'
                            }`}>
                              {u.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => deleteUser(u.id)}
                              className="text-error-600 hover:text-error-900 transition-colors"
                            >
                              <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>O'chirish</span>
                              </div>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers; 