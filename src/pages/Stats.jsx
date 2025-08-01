import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient.jsx";
import { useAuth } from "../AuthContext.jsx";

function Stats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  async function fetchStats() {
    setLoading(true);
    setError("");
    
    try {
      // Foydalanuvchining barcha test natijalarini olish
      let { data: testResults, error } = await supabase
        .from("test_natijalar")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (testResults && testResults.length > 0) {
        const totalTests = testResults.length;
        const totalScore = testResults.reduce((sum, result) => sum + result.score, 0);
        const averageScore = Math.round(totalScore / totalTests);
        const bestScore = Math.max(...testResults.map(r => r.score));
        const passedTests = testResults.filter(r => r.score >= 18).length;
        const passRate = Math.round((passedTests / totalTests) * 100);

        // So'nggi 5 ta test
        const recentTests = testResults.slice(0, 5);

        // Oylik statistika
        const monthlyStats = {};
        testResults.forEach(result => {
          const date = new Date(result.created_at);
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!monthlyStats[monthYear]) {
            monthlyStats[monthYear] = { count: 0, totalScore: 0 };
          }
          monthlyStats[monthYear].count++;
          monthlyStats[monthYear].totalScore += result.score;
        });

        setStats({
          totalTests,
          averageScore,
          bestScore,
          passedTests,
          passRate,
          recentTests,
          monthlyStats
        });
      } else {
        setStats({
          totalTests: 0,
          averageScore: 0,
          bestScore: 0,
          passedTests: 0,
          passRate: 0,
          recentTests: [],
          monthlyStats: {}
        });
      }
    } catch (error) {
      console.error("Statistikani yuklashda xatolik:", error);
      setError("Statistikani yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Statistika yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Xatolik</h2>
          <p className="text-secondary-600 mb-4">{error}</p>
          <button onClick={fetchStats} className="btn-primary">
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">Test statistikasi</h1>
          <p className="text-xl text-secondary-600">
            {user?.fio} - Test natijalaringiz
          </p>
        </motion.div>

        {stats.totalTests === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-12 text-center"
          >
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Hali test ishlamagansiz</h2>
            <p className="text-secondary-600 mb-8">
              Test ishlashni boshlang va statistikangizni ko'ring
            </p>
            <a href="/test" className="btn-primary">
              Test boshlash
            </a>
          </motion.div>
        ) : (
          <>
            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">{stats.totalTests}</h3>
                <p className="text-secondary-600">Jami testlar</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6 text-center"
              >
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">{stats.averageScore}</h3>
                <p className="text-secondary-600">O'rtacha ball</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6 text-center"
              >
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">{stats.bestScore}</h3>
                <p className="text-secondary-600">Eng yaxshi natija</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6 text-center"
              >
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">{stats.passRate}%</h3>
                <p className="text-secondary-600">O'tish foizi</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Tests */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="card p-6"
              >
                <h2 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  So'nggi testlar
                </h2>
                <div className="space-y-4">
                  {stats.recentTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          test.score >= 18 ? 'bg-success-100' : 'bg-error-100'
                        }`}>
                          <svg className={`w-4 h-4 ${test.score >= 18 ? 'text-success-600' : 'text-error-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {test.score >= 18 ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">
                            {test.score}/25 ball
                          </p>
                          <p className="text-sm text-secondary-500">
                            {new Date(test.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${
                          test.score >= 18 ? 'text-success-600' : 'text-error-600'
                        }`}>
                          {test.score >= 18 ? 'O\'tdi' : 'O\'tmadi'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Performance Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="card p-6"
              >
                <h2 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 text-accent-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  Oylik statistika
                </h2>
                <div className="space-y-4">
                  {Object.entries(stats.monthlyStats).map(([month, data]) => (
                    <div key={month} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-secondary-700">
                          {new Date(month + '-01').toLocaleDateString('uz-UZ', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </span>
                        <span className="text-sm text-secondary-600">
                          {data.count} test
                        </span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((data.totalScore / (data.count * 25)) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-secondary-500">
                          O'rtacha: {Math.round(data.totalScore / data.count)}/25
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 text-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/test" className="btn-primary">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Yangi test</span>
                  </div>
                </a>
                <button onClick={fetchStats} className="btn-secondary">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Yangilash</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default Stats; 