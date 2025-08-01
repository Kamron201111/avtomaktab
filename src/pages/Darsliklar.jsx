import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient.jsx";

function Darsliklar() {
  const [darsliklar, setDarsliklar] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDarsliklar();
  }, []);

  async function fetchDarsliklar() {
    setLoading(true);
    setError("");
    
    try {
      let { data, error } = await supabase
        .from("darsliklar")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setDarsliklar(data);
      } else {
        setDarsliklar([]);
      }
    } catch (error) {
      console.error("Darsliklarni yuklashda xatolik:", error);
      setError("Darsliklarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  function nextDarslik() {
    if (currentIndex < darsliklar.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }

  function previousDarslik() {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }

  function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    
    // YouTube URL dan video ID ni olish
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Darsliklar yuklanmoqda...</p>
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
          <button onClick={fetchDarsliklar} className="btn-primary">
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  if (darsliklar.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Darsliklar mavjud emas</h2>
          <p className="text-secondary-600 mb-8">
            Hozircha hech qanday darslik qo'shilmagan
          </p>
          <button onClick={fetchDarsliklar} className="btn-primary">
            Yangilash
          </button>
        </div>
      </div>
    );
  }

  const currentDarslik = darsliklar[currentIndex];
  const embedUrl = getYouTubeEmbedUrl(currentDarslik.link);

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">Video darsliklar</h1>
          <p className="text-xl text-secondary-600">
            Haydovchilik guvohnomasi uchun foydali videolar
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              Darslik {currentIndex + 1} / {darsliklar.length}
            </h2>
            <div className="text-sm text-secondary-600">
              {Math.round(((currentIndex + 1) / darsliklar.length) * 100)}% tugallandi
            </div>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / darsliklar.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-accent-500 to-primary-500 h-2 rounded-full"
            ></motion.div>
          </div>
        </motion.div>

        {/* Video Player */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="card overflow-hidden mb-8"
        >
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={embedUrl}
              title={currentDarslik.title || `Darslik ${currentIndex + 1}`}
              className="w-full h-96"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>

        {/* Video Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            {currentDarslik.title || `Darslik ${currentIndex + 1}`}
          </h2>
          {currentDarslik.description && (
            <p className="text-secondary-600 leading-relaxed mb-6">
              {currentDarslik.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-secondary-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Video darslik</span>
              </div>
              <div className="flex items-center space-x-2 text-secondary-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">#{currentDarslik.id}</span>
              </div>
            </div>
            
            <a
              href={currentDarslik.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>YouTube da ochish</span>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-between items-center"
        >
          <button
            onClick={previousDarslik}
            disabled={currentIndex === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Oldingi darslik</span>
            </div>
          </button>

          {/* Darsliklar ro'yxati */}
          <div className="flex space-x-2">
            {darsliklar.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                  index === currentIndex
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-200 text-secondary-600 hover:bg-secondary-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={nextDarslik}
            disabled={currentIndex === darsliklar.length - 1}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-2">
              <span>Keyingi darslik</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </motion.div>

        {/* Darsliklar ro'yxati */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-xl font-bold text-secondary-900 mb-6">Barcha darsliklar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {darsliklar.map((darslik, index) => (
              <motion.div
                key={darslik.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`card p-6 cursor-pointer transition-all duration-200 ${
                  index === currentIndex
                    ? 'ring-2 ring-primary-500 bg-primary-50'
                    : 'hover:shadow-medium hover:-translate-y-1'
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === currentIndex
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-100 text-secondary-600'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">
                      {darslik.title || `Darslik ${index + 1}`}
                    </h4>
                    <p className="text-sm text-secondary-500">#{darslik.id}</p>
                  </div>
                </div>
                {darslik.description && (
                  <p className="text-secondary-600 text-sm line-clamp-2">
                    {darslik.description}
                  </p>
                )}
                {index === currentIndex && (
                  <div className="mt-3 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-primary-600 font-medium">Hozir ko'rilmoqda</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Darsliklar; 