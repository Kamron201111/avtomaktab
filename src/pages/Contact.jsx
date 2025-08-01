import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient.jsx";
import { formatPhoneNumber, validatePhoneNumber, getFullPhoneNumber } from "../utils/phoneFormatter.js";

function Contact() {
  const [formData, setFormData] = useState({
    ism: "",
    email: "",
    telefon: "",
    xabar: ""
  });
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Map loading timeout
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  function handlePhoneChange(e) {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, telefon: formattedPhone }));
    
    if (formattedPhone.length > 0 && !validatePhoneNumber(formattedPhone)) {
      setPhoneError("Telefon raqami to'liq emas");
    } else {
      setPhoneError("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!formData.ism || !formData.xabar) {
      setError("Ism va xabar maydonlari majburiy!");
      return;
    }

    if (formData.telefon && !validatePhoneNumber(formData.telefon)) {
      setError("Telefon raqamini to'g'ri kiriting!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const contactData = {
        ism: formData.ism,
        email: formData.email || null,
        telefon: formData.telefon ? getFullPhoneNumber(formData.telefon) : null,
        xabar: formData.xabar
      };

      const { error } = await supabase.from("aloqa").insert([contactData]);
      
      if (error) {
        setError("Xabar yuborishda xatolik yuz berdi!");
      } else {
        setSuccess(true);
        setFormData({ ism: "", email: "", telefon: "", xabar: "" });
        setPhoneError("");
      }
    } catch (error) {
      setError("Xabar yuborishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  }

  function handleMapLoad() {
    setMapLoaded(true);
  }

  function handleMapError() {
    setMapLoaded(true);
    // Show fallback map
    const fallbackMap = document.getElementById('fallback-map');
    if (fallbackMap) {
      fallbackMap.style.display = 'block';
    }
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
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">Biz bilan bog'laning</h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Savollaringiz yoki takliflaringiz bo'lsa, biz bilan bog'laning. 
            Sizning fikrlaringiz biz uchun muhim!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manzil
              </h2>
              <p className="text-secondary-600 leading-relaxed">
                Toshkent shahri, Chilonzor tumani<br />
                AvtoTest markazi
              </p>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Telefon
              </h2>
              <div className="space-y-2">
                <p className="text-secondary-600">
                  <span className="font-medium">Asosiy:</span> +998 71 123 45 67
                </p>
                <p className="text-secondary-600">
                  <span className="font-medium">Qo'shimcha:</span> +998 90 123 45 67
                </p>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ish vaqti
              </h2>
              <div className="space-y-2">
                <p className="text-secondary-600">
                  <span className="font-medium">Dushanba - Shanba:</span><br />
                  09:00 - 18:00
                </p>
                <p className="text-secondary-600">
                  <span className="font-medium">Yakshanba:</span><br />
                  10:00 - 16:00
                </p>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </h2>
              <p className="text-secondary-600">
                <a 
                  href="mailto:info@avtotest.uz" 
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  info@avtotest.uz
                </a>
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Xabar yuborish
              </h2>

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-success-700 font-medium">
                      Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.
                    </span>
                  </div>
                </motion.div>
              )}

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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="ism" className="block text-sm font-medium text-secondary-700 mb-2">
                    Ismingiz <span className="text-error-500">*</span>
                  </label>
                  <input
                    id="ism"
                    type="text"
                    placeholder="Familiya va ism"
                    value={formData.ism}
                    onChange={(e) => setFormData(prev => ({ ...prev, ism: e.target.value }))}
                    className="input-field"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                    Email (ixtiyoriy)
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="telefon" className="block text-sm font-medium text-secondary-700 mb-2">
                    Telefon raqam (ixtiyoriy)
                  </label>
                  <input
                    id="telefon"
                    type="tel"
                    placeholder="+998(XX)XXX-XX-XX"
                    value={formData.telefon}
                    onChange={handlePhoneChange}
                    className={`input-field ${phoneError ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                    disabled={loading}
                  />
                  {phoneError && (
                    <p className="text-error-500 text-sm mt-1">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="xabar" className="block text-sm font-medium text-secondary-700 mb-2">
                    Xabar <span className="text-error-500">*</span>
                  </label>
                  <textarea
                    id="xabar"
                    rows={5}
                    placeholder="Xabaringizni yozing..."
                    value={formData.xabar}
                    onChange={(e) => setFormData(prev => ({ ...prev, xabar: e.target.value }))}
                    className="input-field"
                    disabled={loading}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.ism || !formData.xabar}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Yuborilmoqda...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Xabar yuborish</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
              Bizning manzil
            </h2>
            
            {/* Google Maps */}
            <div className="rounded-lg overflow-hidden shadow-lg mb-4 relative">
              {!mapLoaded && (
                <div className="absolute inset-0 bg-secondary-100 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-secondary-600">Xarita yuklanmoqda...</p>
                  </div>
                </div>
              )}
              
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191885.50264770747!2d69.1393792!3d41.2994958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2z0KLQstC10YDRgdC60LDRjyDRg9C7Liwg0KLQstC10YDRgdC60LDRjyDQo9C00L7RgNC-0L3Rliwg0KPQutGA0LDQuNC90LA!5e0!3m2!1sru!2s!4v1703123456789!5m2!1sru!2s"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AvtoTest manzili - Toshkent shahri, Chilonzor tumani"
                className="w-full"
                onLoad={handleMapLoad}
                onError={handleMapError}
              ></iframe>
              
              {/* Fallback OpenStreetMap */}
              <iframe
                id="fallback-map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=69.1393792,41.2994958,69.1493792,41.3094958&layer=mapnik&marker=41.3044958,69.1443792"
                width="100%"
                height="400"
                style={{ border: 0, display: 'none' }}
                title="AvtoTest manzili - OpenStreetMap"
                className="w-full"
              ></iframe>
            </div>
            {/* Map Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://maps.google.com/?q=Tashkent+Chilanzar+district"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Google Maps da ochish</span>
              </a>
              
              <a
                href="https://www.openstreetmap.org/search?query=Tashkent%2C%20Chilanzar%20district"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>OpenStreetMap da ochish</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact; 