import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabaseClient.jsx";

function Test() {
  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: choiceId }
  const [checked, setChecked] = useState({}); // { questionId: true/false }
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 daqiqa
  const [testStarted, setTestStarted] = useState(false);

  // Savollar va variantlarni olish
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let { data: questions } = await supabase.from("questions").select("*").order("created_at", { ascending: true });
        let { data: choices } = await supabase.from("choices").select("*");
        
        // Faqat 25 ta savolni random tanlash
        if (questions && questions.length > 0) {
          const shuffled = questions.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 25);
          setQuestions(selected);
        } else {
          setQuestions([]);
        }
        
        setChoices(choices || []);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Test holatini localStorage dan olish
  useEffect(() => {
    const savedTestState = localStorage.getItem('testState');
    if (savedTestState) {
      const state = JSON.parse(savedTestState);
      setTestStarted(state.testStarted);
      setCurrent(state.current);
      setAnswers(state.answers);
      setChecked(state.checked);
      setTimeLeft(state.timeLeft);
      setShowResult(state.showResult);
    }
  }, []);

  // Test holatini localStorage ga saqlash
  useEffect(() => {
    if (testStarted || Object.keys(answers).length > 0) {
      const testState = {
        testStarted,
        current,
        answers,
        checked,
        timeLeft,
        showResult
      };
      localStorage.setItem('testState', JSON.stringify(testState));
    }
  }, [testStarted, current, answers, checked, timeLeft, showResult]);

  // Timer
  useEffect(() => {
    let timer;
    if (testStarted && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, showResult]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function startTest() {
    setTestStarted(true);
    setTimeLeft(1800);
    setCurrent(0);
    setAnswers({});
    setChecked({});
    setShowResult(false);
    setShowFeedback(false);
    setIsCorrect(null);
    // localStorage ni tozalash
    localStorage.removeItem('testState');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Savollar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">Savollar topilmadi</h2>
          <p className="text-secondary-600 mb-4">Test savollari bazada mavjud emas</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  if (!testStarted && !showResult) {
    return (
      <div className="min-h-screen bg-secondary-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 text-center"
          >
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-4">AvtoTest - Imtihon</h1>
              <p className="text-lg text-secondary-600 mb-8">
                Haydovchilik guvohnomasi uchun test imtihoni
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">Vaqt</h3>
                <p className="text-secondary-600">30 daqiqa</p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">Savollar</h3>
                <p className="text-secondary-600">25 ta savol</p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-secondary-900 mb-2">O'tish</h3>
                <p className="text-secondary-600">18+ to'g'ri javob</p>
              </div>
            </div>

            <button
              onClick={startTest}
              className="btn-primary text-lg px-8 py-4"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Testni boshlash</span>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const correctAnswers = getResult();
    const percentage = (correctAnswers / questions.length) * 100;
    const passed = correctAnswers >= 18;

    return (
      <div className="min-h-screen bg-secondary-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 text-center"
          >
            <div className="mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                passed ? 'bg-success-100' : 'bg-error-100'
              }`}>
                <svg className={`w-12 h-12 ${passed ? 'text-success-600' : 'text-error-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {passed ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-4">
                {passed ? "Tabriklaymiz! Imtihondan o'tdingiz!" : "Imtihondan o'ta olmadingiz"}
              </h1>
              <p className="text-lg text-secondary-600 mb-8">
                Natijangiz: {correctAnswers} / {questions.length} ({percentage.toFixed(1)}%)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card p-6">
                <h3 className="font-semibold text-secondary-900 mb-4">Natijalar</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">To'g'ri javoblar:</span>
                    <span className="font-semibold text-success-600">{correctAnswers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Noto'g'ri javoblar:</span>
                    <span className="font-semibold text-error-600">{questions.length - correctAnswers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Foiz:</span>
                    <span className="font-semibold text-primary-600">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-semibold text-secondary-900 mb-4">Tahlil</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">O'tish balli:</span>
                    <span className="font-semibold">18/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Holat:</span>
                    <span className={`font-semibold ${passed ? 'text-success-600' : 'text-error-600'}`}>
                      {passed ? 'O\'tdi' : 'O\'tmadi'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startTest}
                className="btn-primary"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Qayta urinish</span>
                </div>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('testState');
                  window.location.reload();
                }}
                className="btn-secondary"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Yangi test</span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[current];
  const currentChoices = choices.filter(c => c.question_id === currentQuestion.id);
  const selectedChoice = answers[currentQuestion.id];
  const isChecked = checked[currentQuestion.id];

  function handleSelect(choiceId) {
    setAnswers({ ...answers, [currentQuestion.id]: choiceId });
    setShowFeedback(false);
    setIsCorrect(null);
  }

  function handleCheck() {
    if (!selectedChoice) return;
    const choice = choices.find(c => c.id === selectedChoice);
    const correct = choice && choice.is_correct;
    setChecked({ ...checked, [currentQuestion.id]: true });
    setShowFeedback(true);
    setIsCorrect(correct);
  }

  function handleNext() {
    setShowFeedback(false);
    setIsCorrect(null);
    if (current < questions.length - 1) setCurrent(current + 1);
  }

  function handlePrev() {
    setShowFeedback(false);
    setIsCorrect(null);
    if (current > 0) setCurrent(current - 1);
  }

  function handleFinish() {
    setShowResult(true);
    // Test tugaganda localStorage ni tozalash
    localStorage.removeItem('testState');
  }

  function getResult() {
    let correct = 0;
    for (let q of questions) {
      const userChoice = choices.find(c => c.id === answers[q.id]);
      if (userChoice && userChoice.is_correct) correct++;
    }
    return correct;
  }

  // Pagination funksiyasi
  function getPaginationItems() {
    const items = [];
    const total = questions.length;
    
    // Har doim birinchi sahifa
    items.push(0);
    
    if (current > 2) {
      items.push('...');
    }
    
    // Joriy sahifadan oldingi
    if (current > 1) {
      items.push(current - 1);
    }
    
    // Joriy sahifa
    if (current > 0 && current < total - 1) {
      items.push(current);
    }
    
    // Joriy sahifadan keyingi
    if (current < total - 2) {
      items.push(current + 1);
    }
    
    if (current < total - 3) {
      items.push('...');
    }
    
    // Har doim oxirgi sahifa
    if (total > 1) {
      items.push(total - 1);
    }
    
    return items;
  }

  // Javob rangini aniqlash
  function getAnswerColor(choice) {
    const isSelected = selectedChoice === choice.id;
    const isChecked = checked[currentQuestion.id];
    
    if (isChecked) {
      // Tekshirilgandan keyin
      if (choice.is_correct) {
        return 'border-success-500 bg-success-50 text-success-900'; // To'g'ri javob - yashil
      } else if (isSelected && !choice.is_correct) {
        return 'border-error-500 bg-error-50 text-error-900'; // Noto'g'ri tanlangan javob - qizil
      } else {
        return 'border-secondary-200 bg-white text-secondary-600'; // Boshqa javoblar
      }
    } else {
      // Tekshirilmagandan oldin
      if (isSelected) {
        return 'border-primary-500 bg-primary-50 text-primary-900'; // Tanlangan javob - primary
      } else {
        return 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-primary-25'; // Tanlanmagan javob
      }
    }
  }

  // Javob ikonini aniqlash
  function getAnswerIcon(choice) {
    const isSelected = selectedChoice === choice.id;
    const isChecked = checked[currentQuestion.id];
    
    if (isChecked) {
      if (choice.is_correct) {
        return (
          <svg className="w-4 h-4 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      } else if (isSelected && !choice.is_correct) {
        return (
          <svg className="w-4 h-4 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      }
    } else if (isSelected) {
      return (
        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
      );
    }
    return null;
  }
    
    return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
          <motion.div
          initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-secondary-900">AvtoTest</h1>
              <p className="text-secondary-600">
                Savol {current + 1} / {questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600">{formatTime(timeLeft)}</div>
                <div className="text-sm text-secondary-500">Qolgan vaqt</div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${(timeLeft / 1800) * 100}, 100`}
                    className="text-secondary-200"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-secondary-600">
                    {Math.round((timeLeft / 1800) * 100)}%
                  </span>
                </div>
              </div>
            </div>
            </div>
          </motion.div>

        {/* Question */}
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="card p-8 mb-6"
        >
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-secondary-900 leading-relaxed mb-4">
              {currentQuestion.question_text}
              </h2>
            
            {/* Rasm ko'rsatish */}
            {currentQuestion.image_url && (
            <div className="mb-6">
                  <img 
                    src={currentQuestion.image_url} 
                    alt="Savol rasmi" 
                  className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                  style={{ maxHeight: '300px' }}
                  />
                </div>
              )}
            </div>

          <div className="space-y-4">
              {currentChoices.map((choice, index) => (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                onClick={() => !isChecked && handleSelect(choice.id)}
                  disabled={isChecked}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  getAnswerColor(choice)
                } ${isChecked ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedChoice === choice.id
                      ? 'border-primary-500 bg-primary-500' 
                      : 'border-secondary-300'
                  }`}>
                    {getAnswerIcon(choice)}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span>{choice.choice_text}</span>
                </div>
                </motion.button>
              ))}
            </div>
        </motion.div>

        {/* Action Buttons */}

        <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={handleCheck}
                  disabled={!selectedChoice || isChecked}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tekshirish</span>
            </div>
                </button>

                {current === questions.length - 1 && (
                  <button
                    onClick={handleFinish}
              className="btn-primary"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Testni yakunlash</span>
              </div>
                  </button>
                )}
              </div>


          {/* Feedback */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg text-center font-bold text-lg"
            style={{ 
              backgroundColor: isCorrect ? '#dcfce7' : '#fef2f2',
              color: isCorrect ? '#166534' : '#dc2626'
            }}
          >
            {isCorrect ? "✅ To'g'ri!" : "❌ Xato!"}
          </motion.div>
        )}


        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Oldingi</span>
            </div>
          </button>

          <div className="flex space-x-2">
            {getPaginationItems().map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (typeof item === 'number') {
                    setCurrent(item);
                    setShowFeedback(false);
                    setIsCorrect(null);
                  }
                }}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  typeof item === 'number'
                    ? (current === item
                        ? 'bg-primary-500 text-white'
                        : (() => {
                            const questionId = questions[item]?.id;
                            const userChoice = answers[questionId];
                            const isQuestionChecked = checked[questionId];
                            
                            if (isQuestionChecked && userChoice) {
                              const choice = choices.find(c => c.id === userChoice);
                              if (choice && choice.is_correct) {
                                return 'bg-success-500 text-white'; // To'g'ri javob
                              } else {
                                return 'bg-error-500 text-white'; // Noto'g'ri javob
                              }
                            } else if (userChoice) {
                              return 'bg-secondary-300 text-secondary-700'; // Javob berilgan
                            } else {
                              return 'bg-secondary-100 text-secondary-500 hover:bg-secondary-200'; // Javob berilmagan
                            }
                          })())
                    : 'text-secondary-400 cursor-default'
                }`}
                disabled={typeof item !== 'number'}
              >
                {typeof item === 'number' ? item + 1 : item}
              </button>
            ))}
            </div>

          <button
            onClick={current === questions.length - 1 ? handleFinish : handleNext}
            className="btn-primary"
          >
            <div className="flex items-center space-x-2">
              <span>{current === questions.length - 1 ? 'Tugatish' : 'Keyingi'}</span>
              {current !== questions.length - 1 && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </button>
          </div>
          
              {/* Status Table */}
              <div className="w-full mt-8">
                <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2 justify-center">
                  {questions.map((q, idx) => {
                    const userChoice = answers[q.id];
                    const isQuestionChecked = checked[q.id];
                    let statusColor = "bg-primary-100 text-primary-700 border-primary-300";
                    if (isQuestionChecked && userChoice) {
                      const choice = choices.find(c => c.id === userChoice);
                      if (choice && choice.is_correct) {
                        statusColor = "bg-success-500 text-white border-success-500"; // Correct
                      } else {
                        statusColor = "bg-error-500 text-white border-error-500"; // Incorrect
                      }
                    } else if (userChoice) {
                      statusColor = "bg-primary-500 text-white border-primary-500"; // Answered but not checked
                    }
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setCurrent(idx);
                          setShowFeedback(false);
                          setIsCorrect(null);
                        }}
                        className={`w-8 h-8 rounded-full font-bold border-2 flex items-center justify-center transition-colors duration-150
                          ${statusColor}
                          ${current === idx ? "ring-2 ring-primary-400" : ""}
                        `}
                        aria-label={`Savol ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-wrap justify-center mt-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-success-500 border-2 border-success-500 inline-block"></span>
                    <span className="text-success-700">To'g'ri javob</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-error-500 border-2 border-error-500 inline-block"></span>
                    <span className="text-error-700">Xato javob</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary-500 border-2 border-primary-500 inline-block"></span>
                    <span className="text-primary-700">Belgilanmagan</span>
                  </div>
                </div>
              </div>
      </div>
    </div>

  );
}

export default Test; 