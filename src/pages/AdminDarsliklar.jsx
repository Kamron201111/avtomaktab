import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.jsx";
import { useAuth } from "../AuthContext.jsx";
import { Navigate } from "react-router-dom";

function AdminDarsliklar() {
  const { user, isAdmin } = useAuth();
  const [darsliklar, setDarsliklar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDarslik, setNewDarslik] = useState({
    title: "",
    description: "",
    link: ""
  });

  useEffect(() => {
    if (isAdmin) {
      fetchDarsliklar();
    }
  }, [isAdmin]);

  async function fetchDarsliklar() {
    setLoading(true);
    try {
      let { data } = await supabase.from("darsliklar").select("*").order("id");
      setDarsliklar(data || []);
    } catch (error) {
      console.error("Darsliklarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addDarslik() {
    if (!newDarslik.title || !newDarslik.link) {
      alert("Sarlavha va video linkini kiriting!");
      return;
    }

    try {
      const { error } = await supabase.from("darsliklar").insert([newDarslik]);
      if (!error) {
        setNewDarslik({ title: "", description: "", link: "" });
        fetchDarsliklar();
        alert("Darslik muvaffaqiyatli qo'shildi!");
      } else {
        alert("Xatolik: " + error.message);
      }
    } catch (error) {
      alert("Xatolik: " + error.message);
    }
  }

  async function deleteDarslik(id) {
    if (window.confirm("Darslikni o'chirishni xohlaysizmi?")) {
      try {
        const { error } = await supabase.from("darsliklar").delete().eq("id", id);
        if (!error) {
          setDarsliklar(darsliklar.filter(d => d.id !== id));
          alert("Darslik o'chirildi!");
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
          <div className="px-6 py-4 border-b border-secondary-200 bg-gradient-to-r from-accent-50 to-primary-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Darsliklarni boshqarish</h1>
                <p className="text-secondary-600">Yangi darsliklar qo'shish va mavjudlarni boshqarish</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Yangi darslik qo'shish
              </h2>
              <div className="card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Sarlavha</label>
                    <input 
                      placeholder="Darslik sarlavhasi" 
                      value={newDarslik.title} 
                      onChange={e => setNewDarslik(d => ({ ...d, title: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Video link</label>
                    <input 
                      placeholder="YouTube video linki" 
                      value={newDarslik.link} 
                      onChange={e => setNewDarslik(d => ({ ...d, link: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Tavsif</label>
                    <textarea
                      placeholder="Darslik haqida qisqacha ma'lumot"
                      value={newDarslik.description}
                      onChange={e => setNewDarslik(d => ({ ...d, description: e.target.value }))}
                      className="input-field"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button 
                      onClick={addDarslik}
                      disabled={!newDarslik.title || !newDarslik.link}
                      className="btn-success w-full"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Darslik qo'shish</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Darsliklar ro'yxati ({darsliklar.length})
              </h2>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="min-w-full divide-y divide-secondary-200">
                    <thead className="bg-secondary-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Sarlavha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Tavsif</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Video link</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-secondary-200">
                      {darsliklar.map(d => (
                        <tr key={d.id} className="hover:bg-secondary-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-secondary-900">#{d.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">{d.title}</td>
                          <td className="px-6 py-4 text-sm text-secondary-500 max-w-xs truncate">{d.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                            <a 
                              href={d.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-accent-600 hover:text-accent-800 transition-colors flex items-center space-x-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span>Ko'rish</span>
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => deleteDarslik(d.id)}
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

export default AdminDarsliklar; 