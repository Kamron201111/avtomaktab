import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.jsx";
import { useAuth } from "../AuthContext.jsx";

function Admin() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Users state
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ 
    fio: "", 
    phone: "", 
    passport: "", 
    birth_date: "", 
    category: "B" 
  });

  // Tests state
  const [tests, setTests] = useState([]);
  const [newTest, setNewTest] = useState({
    question_text: "",
    image_url: ""
  });
  const [choices, setChoices] = useState([]);
  const [newChoices, setNewChoices] = useState([
    { choice_text: "", is_correct: false },
    { choice_text: "", is_correct: false },
    { choice_text: "", is_correct: false },
    { choice_text: "", is_correct: false }
  ]);

  // Darsliklar state
  const [darsliklar, setDarsliklar] = useState([]);
  const [newDarslik, setNewDarslik] = useState({
    title: "",
    description: "",
    video_url: "",
    order_number: 1
  });

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchTests();
      fetchDarsliklar();
    }
  }, [isAdmin]);

  // Users CRUD
  async function fetchUsers() {
    let { data } = await supabase.from("users").select("*");
    setUsers(data || []);
  }

  async function addUser() {
    if (!newUser.fio || !newUser.phone || !newUser.passport || !newUser.birth_date) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }
    
    const { error } = await supabase.from("users").insert([newUser]);
    if (!error) {
      setNewUser({ fio: "", phone: "", passport: "", birth_date: "", category: "B" });
      fetchUsers();
      alert("Foydalanuvchi muvaffaqiyatli qo'shildi!");
    } else {
      alert("Xatolik: " + error.message);
    }
  }

  async function deleteUser(id) {
    if (window.confirm("Foydalanuvchini o'chirishni xohlaysizmi?")) {
      const { error } = await supabase.from("users").delete().eq("id", id);
      if (!error) {
        setUsers(users.filter(u => u.id !== id));
        alert("Foydalanuvchi o'chirildi!");
      } else {
        alert("Xatolik: " + error.message);
      }
    }
  }

  // Tests CRUD
  async function fetchTests() {
    let { data } = await supabase.from("questions").select("*");
    setTests(data || []);
    
    let { data: choicesData } = await supabase.from("choices").select("*");
    setChoices(choicesData || []);
  }

  async function addTest() {
    if (!newTest.question_text) {
      alert("Savol matnini kiriting!");
      return;
    }
    
    if (newChoices.filter(c => c.choice_text.trim()).length < 2) {
      alert("Kamida 2 ta javob variantini kiriting!");
      return;
    }
    
    if (newChoices.filter(c => c.is_correct).length !== 1) {
      alert("Aniq 1 ta to'g'ri javobni belgilang!");
      return;
    }

    try {
      // Savolni qo'shamiz
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .insert([newTest])
        .select();

      if (questionError) throw questionError;

      const questionId = questionData[0].id;

      // Javob variantlarini qo'shamiz
      const choicesToInsert = newChoices
        .filter(c => c.choice_text.trim())
        .map(c => ({ ...c, question_id: questionId }));

      const { error: choicesError } = await supabase
        .from("choices")
        .insert(choicesToInsert);

      if (choicesError) throw choicesError;

      setNewTest({ question_text: "", image_url: "" });
      setNewChoices([
        { choice_text: "", is_correct: false },
        { choice_text: "", is_correct: false },
        { choice_text: "", is_correct: false },
        { choice_text: "", is_correct: false }
      ]);
      fetchTests();
      alert("Test muvaffaqiyatli qo'shildi!");
    } catch (error) {
      alert("Xatolik: " + error.message);
    }
  }

  async function deleteTest(id) {
    if (window.confirm("Testni o'chirishni xohlaysizmi?")) {
      try {
        // Avval javob variantlarini o'chiramiz
        await supabase.from("choices").delete().eq("question_id", id);
        // Keyin savolni o'chiramiz
        const { error } = await supabase.from("questions").delete().eq("id", id);
        if (!error) {
          setTests(tests.filter(t => t.id !== id));
          alert("Test o'chirildi!");
        } else {
          alert("Xatolik: " + error.message);
        }
      } catch (error) {
        alert("Xatolik: " + error.message);
      }
    }
  }

  // Darsliklar CRUD
  async function fetchDarsliklar() {
    let { data } = await supabase.from("darsliklar").select("*").order("order_number");
    setDarsliklar(data || []);
  }

  async function addDarslik() {
    if (!newDarslik.title || !newDarslik.video_url) {
      alert("Sarlavha va video URL ni kiriting!");
      return;
    }

    const { error } = await supabase.from("darsliklar").insert([newDarslik]);
    if (!error) {
      setNewDarslik({ title: "", description: "", video_url: "", order_number: 1 });
      fetchDarsliklar();
      alert("Darslik muvaffaqiyatli qo'shildi!");
    } else {
      alert("Xatolik: " + error.message);
    }
  }

  async function deleteDarslik(id) {
    if (window.confirm("Darslikni o'chirishni xohlaysizmi?")) {
      const { error } = await supabase.from("darsliklar").delete().eq("id", id);
      if (!error) {
        setDarsliklar(darsliklar.filter(d => d.id !== id));
        alert("Darslik o'chirildi!");
      } else {
        alert("Xatolik: " + error.message);
      }
    }
  }

  function updateChoice(index, field, value) {
    const updated = [...newChoices];
    updated[index] = { ...updated[index], [field]: value };
    setNewChoices(updated);
  }

  if (!isAdmin) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Faqat admin uchun!</h1>
        <p className="text-gray-600">Bu sahifaga kirish uchun admin huquqlari kerak.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Foydalanuvchilar
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Testlar
              </button>
              <button
                onClick={() => setActiveTab('darsliklar')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'darsliklar'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Darsliklar
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Yangi foydalanuvchi qo'shish</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <input 
                      placeholder="FIO" 
                      value={newUser.fio} 
                      onChange={e => setNewUser(u => ({ ...u, fio: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                      placeholder="Telefon" 
                      value={newUser.phone} 
                      onChange={e => setNewUser(u => ({ ...u, phone: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                      placeholder="Passport (AB1234567)" 
                      value={newUser.passport} 
                      onChange={e => setNewUser(u => ({ ...u, passport: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                      type="date"
                      placeholder="Tug'ilgan sana" 
                      value={newUser.birth_date} 
                      onChange={e => setNewUser(u => ({ ...u, birth_date: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select 
                      value={newUser.category} 
                      onChange={e => setNewUser(u => ({ ...u, category: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="A">A - Mototsikl</option>
                      <option value="B">B - Avtomobil</option>
                      <option value="C">C - Yuk avtomobili</option>
                      <option value="BC">BC - Avtomobil va yuk avtomobili</option>
                    </select>
                    <button 
                      onClick={addUser}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Qo'shish
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Foydalanuvchilar ro'yxati</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FIO</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tug'ilgan sana</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategoriya</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(u => (
                          <tr key={u.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.fio}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.passport}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(u.birth_date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => deleteUser(u.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                O'chirish
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tests Tab */}
            {activeTab === 'tests' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Yangi test qo'shish</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Savol</label>
                      <textarea
                        placeholder="Savol matnini kiriting..."
                        value={newTest.question_text}
                        onChange={e => setNewTest(t => ({ ...t, question_text: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rasm URL (ixtiyoriy)</label>
                      <input
                        placeholder="https://example.com/image.jpg"
                        value={newTest.image_url}
                        onChange={e => setNewTest(t => ({ ...t, image_url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Javob variantlari</label>
                      <div className="space-y-2">
                        {newChoices.map((choice, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              placeholder={`Variant ${index + 1}`}
                              value={choice.choice_text}
                              onChange={e => updateChoice(index, 'choice_text', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="radio"
                              name="correct"
                              checked={choice.is_correct}
                              onChange={() => {
                                const updated = newChoices.map((c, i) => ({
                                  ...c,
                                  is_correct: i === index
                                }));
                                setNewChoices(updated);
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="text-sm text-gray-500">To'g'ri</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={addTest}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Test qo'shish
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Testlar ro'yxati</h2>
                  <div className="space-y-4">
                    {tests.map(test => {
                      const testChoices = choices.filter(c => c.question_id === test.id);
                      return (
                        <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900">{test.question_text}</h3>
                            <button 
                              onClick={() => deleteTest(test.id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              O'chirish
                            </button>
                          </div>
                          {test.image_url && (
                            <img src={test.image_url} alt="Test rasmi" className="w-32 h-20 object-cover rounded mb-2" />
                          )}
                          <div className="text-sm text-gray-600">
                            <p>Javob variantlari:</p>
                            <ul className="list-disc list-inside ml-2">
                              {testChoices.map(choice => (
                                <li key={choice.id} className={choice.is_correct ? 'text-green-600 font-medium' : ''}>
                                  {choice.choice_text} {choice.is_correct && '(To\'g\'ri)'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Darsliklar Tab */}
            {activeTab === 'darsliklar' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Yangi darslik qo'shish</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      placeholder="Sarlavha" 
                      value={newDarslik.title} 
                      onChange={e => setNewDarslik(d => ({ ...d, title: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                      placeholder="Video URL (YouTube)" 
                      value={newDarslik.video_url} 
                      onChange={e => setNewDarslik(d => ({ ...d, video_url: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                      type="number"
                      placeholder="Tartib raqami" 
                      value={newDarslik.order_number} 
                      onChange={e => setNewDarslik(d => ({ ...d, order_number: parseInt(e.target.value) || 1 }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      onClick={addDarslik}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Darslik qo'shish
                    </button>
                  </div>
                  <div className="mt-4">
                    <textarea
                      placeholder="Darslik tavsifi (ixtiyoriy)"
                      value={newDarslik.description}
                      onChange={e => setNewDarslik(d => ({ ...d, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Darsliklar ro'yxati</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tartib</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sarlavha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tavsif</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video URL</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {darsliklar.map(d => (
                          <tr key={d.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.order_number}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{d.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <a href={d.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                Ko'rish
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => deleteDarslik(d.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                O'chirish
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;