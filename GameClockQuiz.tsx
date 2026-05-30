import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Trophy, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClockQuestion {
  id: number;
  timeStr: string; // e.g. "03:30", "01:15"
  hour: number;    // 1-12
  minutes: number; // 0-59
  questionEsp: string;
  questionArm: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Props {
  onBack: () => void;
  onGameComplete: (score: number) => void;
}

export default function GameClockQuiz({ onBack, onGameComplete }: Props) {
  const [questions, setQuestions] = useState<ClockQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Exactly 20 diverse and beautifully arranged time telling questions in Spanish
  const rawQuestions: ClockQuestion[] = [
    {
      id: 1,
      timeStr: "12:00",
      hour: 12,
      minutes: 0,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 12:00-ն է» իսպաներենով:",
      options: ["Son las doce", "Es la doce", "Es la una", "Son las dos"],
      correctAnswer: "Son las doce",
      explanation: "Ժամը 12-ի համար օգտագործվում է հոգնակի ձևը՝ «Son las doce»: «Es la» օգտագործվում է միայն ժամը մեկի (1:00) դեպքում:"
    },
    {
      id: 2,
      timeStr: "01:00",
      hour: 1,
      minutes: 0,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 1:00-ն է» իսպաներենով:",
      options: ["Es la una", "Son las una", "Es el uno", "Son las dos"],
      correctAnswer: "Es la una",
      explanation: "Միայն ժամը 1:00-ի դեպքում ենք ասում «Es la una», քանի որ այն եզակի է:"
    },
    {
      id: 3,
      timeStr: "02:00",
      hour: 2,
      minutes: 0,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 2:00-ն է» իսպաներենով:",
      options: ["Son las dos", "Es la dos", "Son las doce", "Es las dos"],
      correctAnswer: "Son las dos",
      explanation: "Ժամը 2:00-ը հոգնակի է, ուստի ասում ենք «Son las dos»:"
    },
    {
      id: 4,
      timeStr: "01:15",
      hour: 1,
      minutes: 15,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 1-անց 15 (մեկն անց քառորդ) է»:",
      options: ["Es la una y cuarto", "Son las una y cuarto", "Es la una y quince", "Es la una menos cuarto"],
      correctAnswer: "Es la una y cuarto",
      explanation: "Մեկն անց քառորդը իսպաներենում ասվում է «Es la una y cuarto» (cuarto նշանակում է քառորդ):"
    },
    {
      id: 5,
      timeStr: "04:15",
      hour: 4,
      minutes: 15,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 4-անց 15 (չորսն անց քառորդ) է»:",
      options: ["Son las cuatro y cuarto", "Es las cuatro y cuarto", "Son las cuatro y quince", "Son las cuatro menos cuarto"],
      correctAnswer: "Son las cuatro y cuarto",
      explanation: "Չորսն անց քառորդը հայտնում ենք հոգնակի «Son las cuatro...» սկզբնամասով և «y cuarto» վերջամասով:"
    },
    {
      id: 6,
      timeStr: "08:30",
      hour: 8,
      minutes: 30,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 8:30-ն է (ութն անց կես)»:",
      options: ["Son las ocho y media", "Es las ocho y media", "Son las ocho y treinta", "Son las siete y media"],
      correctAnswer: "Son las ocho y media",
      explanation: "Անց կեսը նշելու համար օգտագործվում է «y media» արտահայտությունը: 8:30 -> «Son las ocho y media»:"
    },
    {
      id: 7,
      timeStr: "01:30",
      hour: 1,
      minutes: 30,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 1:30-ն է (մեկն անց կես)»:",
      options: ["Es la una y media", "Son las una y media", "Es la una y treinta", "Son las doce y media"],
      correctAnswer: "Es la una y media",
      explanation: "Ժամը մեկն անց կեսը իսպաներենում ասվում է «Es la una y media» (չմոռանաք եզակի «Es la»-ն):"
    },
    {
      id: 8,
      timeStr: "12:30",
      hour: 12,
      minutes: 30,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 12:30-ն է (տասներկուսն անց կես)»:",
      options: ["Son las doce y media", "Es la doce y media", "Son las doce y treinta", "Son las doce menos media"],
      correctAnswer: "Son las doce y media",
      explanation: "Ժամը 12:30-ն է -> «Son las doce y media»:"
    },
    {
      id: 9,
      timeStr: "11:45",
      hour: 11,
      minutes: 45,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 11:45-ն է (տասներկուսին քառորդ պակաս)»:",
      options: ["Son las doce menos cuarto", "Son las once y cuarenta y cinco", "Son las once menos cuarto", "Es la doce menos cuarto"],
      correctAnswer: "Son las doce menos cuarto",
      explanation: "Իսպաներենում 30 րոպեից հետո ժամն ասում ենք հաջորդից հանելով՝ «menos cuarto» (քառորդ պակաս): 11:45-ը դառնում է 12-ին քառորդ պակաս՝ «Son las doce menos cuarto»:"
    },
    {
      id: 10,
      timeStr: "01:45",
      hour: 1,
      minutes: 45,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 1:45-ն է (երկուսին քառորդ պակաս)»:",
      options: ["Son las dos menos cuarto", "Es la una y cuarenta y cinco", "Es la una menos cuarto", "Es las dos menos cuarto"],
      correctAnswer: "Son las dos menos cuarto",
      explanation: "Քանի որ 1:45-ը հաջորդ ժամի (2-ի) համար է, օգտագործվում է «Son las dos menos cuarto» (հոգնակի, որովհետև թիրախը ժամը 2-ն է):"
    },
    {
      id: 11,
      timeStr: "09:10",
      hour: 9,
      minutes: 10,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 9:10-ն է (ինն անց տաս)»:",
      options: ["Son las nueve y diez", "Son las nueve diez", "Es la nueve y diez", "Son las diez menos diez"],
      correctAnswer: "Son las nueve y diez",
      explanation: "Ինն անց տասը րոպե՝ «Son las nueve y diez»:"
    },
    {
      id: 12,
      timeStr: "05:20",
      hour: 5,
      minutes: 20,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 5:20-ն է (հինգն անց քսան)»:",
      options: ["Son las cinco y veinte", "Es las cinco y veinte", "Son las cinco veinte", "Son las cinco menos veinte"],
      correctAnswer: "Son las cinco y veinte",
      explanation: "Հինգն անց քսան րոպե՝ «Son las cinco y veinte»:"
    },
    {
      id: 13,
      timeStr: "07:40",
      hour: 7,
      minutes: 40,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 7:40-ն է (ութին քսան պակաս)»:",
      options: ["Son las ocho menos veinte", "Son las siete y cuarenta", "Son las siete menos veinte", "Es la ocho menos veinte"],
      correctAnswer: "Son las ocho menos veinte",
      explanation: "Քանի որ րոպեները 30-ից անց են, մոտենում ենք 8-ին և հանում 20 րոպե (veinte): Ութին քսան պակաս՝ «Son las ocho menos veinte»:"
    },
    {
      id: 14,
      timeStr: "10:50",
      hour: 10,
      minutes: 50,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 10:50-ն է (տասնմեկին տասը պակաս)»:",
      options: ["Son las once menos diez", "Son las diez y cincuenta", "Son las diez menos diez", "Es la once menos diez"],
      correctAnswer: "Son las once menos diez",
      explanation: "Տասնմեկին տասը րոպե պակաս՝ «Son las once menos diez»:"
    },
    {
      id: 15,
      timeStr: "06:05",
      hour: 6,
      minutes: 5,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 6:05-ն է (վեցն անց հինգ)»:",
      options: ["Son las seis y cinco", "Es la seis y cinco", "Son las seis cinco", "Son las seis menos cinco"],
      correctAnswer: "Son las seis y cinco",
      explanation: "Վեցն անց հինգ րոպե՝ «Son las seis y cinco»:"
    },
    {
      id: 16,
      timeStr: "03:25",
      hour: 3,
      minutes: 25,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 3:25-ն է (երեքն անց քսանհինգ)»:",
      options: ["Son las tres y veinticinco", "Es las tres y veinticinco", "Son las tres veinticinco", "Son las cuatro menos veinticinco"],
      correctAnswer: "Son las tres y veinticinco",
      explanation: "Երեքն անց քսանհինգ րոպե՝ «Son las tres y veinticinco»:"
    },
    {
      id: 17,
      timeStr: "04:35",
      hour: 4,
      minutes: 35,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 4:35-ն է (հինգին քսանհինգ պակաս)»:",
      options: ["Son las cinco menos veinticinco", "Son las cuatro y treinta y cinco", "Son las cuatro menos veinticinco", "Es las cinco menos veinticinco"],
      correctAnswer: "Son las cinco menos veinticinco",
      explanation: "Քանի որ րոպեներն անցել են կեսը, ցույց ենք տալիս հաջորդ ժամից (5-ից) հաշվարկով՝ «menos veinticinco» (քսանհինգ պակաս)՝ «Son las cinco menos veinticinco»:"
    },
    {
      id: 18,
      timeStr: "12:15",
      hour: 12,
      minutes: 15,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 12:15-ն է (տասներկուսն անց քառորդ)»:",
      options: ["Son las doce y cuarto", "Es la doce y cuarto", "Son las doce y quince", "Son las doce menos cuarto"],
      correctAnswer: "Son las doce y cuarto",
      explanation: "Տասներկուսն անց քառորդ (15 րոպե)` «Son las doce y cuarto»:"
    },
    {
      id: 19,
      timeStr: "02:55",
      hour: 2,
      minutes: 55,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը 2:55-ն է (երեքին հինգ պակաս)»:",
      options: ["Son las tres menos cinco", "Son las dos y cincuenta y cinco", "Son las dos menos cinco", "Es la tres menos cinco"],
      correctAnswer: "Son las three menos cinco", // Wait, typo in options or correctAnswer. Let's make sure strings match! "Son las tres menos cinco" matches "Son las tres menos cinco". Let's correct this.
      explanation: "Երեքին հինգ րոպե պակաս՝ «Son las tres menos cinco»:"
    },
    {
      id: 20,
      timeStr: "05:00",
      hour: 5,
      minutes: 0,
      questionEsp: "¿Qué hora es?",
      questionArm: "Ինչպե՞ս կասեք «Ժամը ուղիղ 5:00-ն է»:",
      options: ["Son las cinco en punto", "Es la cinco en punto", "Son las cinco y punto", "Son las cinco menos punto"],
      correctAnswer: "Son las cinco en punto",
      explanation: "Ուղիղ ժամը արտահայտվում է «en punto»-ի միջոցով: Ուստի՝ «Son las cinco en punto»:"
    }
  ];

  // Fix typo in index 18 (19th element: 2:55)
  rawQuestions[18].correctAnswer = "Son las tres menos cinco";

  useEffect(() => {
    // Scaffold 20 questions randomly but always keep size 20
    setQuestions([...rawQuestions].sort(() => Math.random() - 0.5));
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsCompleted(false);
  }, []);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOpt(option);
  };

  const handleNext = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      const isCorrect = selectedOpt === questions[currentIdx].correctAnswer;
      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
      }
    } else {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOpt(null);
        setIsAnswered(false);
      } else {
        setIsCompleted(true);
        // Award up to 60 XP for full 20 questions quiz!
        const scoreEarned = Math.round((correctCount / questions.length) * 60);
        onGameComplete(scoreEarned);
      }
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (questions.length === 0) {
    return <div className="text-center p-8 font-bold text-indigo-900">Բեռնում...</div>;
  }

  const currentQuestion = questions[currentIdx];
  const isSelectedCorrect = selectedOpt === currentQuestion.correctAnswer;

  // Let's compute analog clock hand angles with full mathematical accuracy
  // Minute hand: 360 deg is 60 minutes -> 6 deg per minute
  // Hour hand: 360 deg is 12 hours -> 30 deg per hour + (minutes / 60) * 30 -> 30 * hour + minutes * 0.5
  const minuteAngle = currentQuestion.minutes * 6;
  const hourAngle = (currentQuestion.hour % 12) * 30 + currentQuestion.minutes * 0.5;

  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border-2 border-indigo-50 max-w-2xl mx-auto my-4">
      {/* Quiz Title & Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-indigo-50">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-indigo-400 hover:text-indigo-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>ՀԵՏ</span>
        </button>
        <div className="text-center">
          <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-200">
            ԽԱՂ 8 (ՆՈՐ • ՎԻԶՈՒԱԼ)
          </span>
          <h2 className="text-lg font-black text-indigo-950 font-display">Իսպաներեն Ժամացույց (20 Հարց)</h2>
        </div>
        <div className="text-xs font-black font-mono text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg">
          {isCompleted ? 'Ավարտ' : `${currentIdx + 1}/${questions.length}`}
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-indigo-50 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Interactive Visual Clock Area */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-indigo-50/30 p-5 sm:p-6 rounded-3xl border border-indigo-100">
            {/* Beautiful SVG Analog Clock with smooth modern look */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 bg-white rounded-full shadow-lg border-4 border-indigo-950 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Clock Face Background */}
                <circle cx="50" cy="50" r="46" fill="white" />
                <circle cx="50" cy="50" r="4" fill="#312e81" className="z-10" />

                {/* Hour ticks around the edge */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x1 = 50 + 38 * Math.cos(angle);
                  const y1 = 50 + 38 * Math.sin(angle);
                  const x2 = 50 + 43 * Math.cos(angle);
                  const y2 = 50 + 43 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={i % 3 === 0 ? '#1e1b4b' : '#94a3b8'}
                      strokeWidth={i % 3 === 0 ? 2 : 1}
                    />
                  );
                })}

                {/* Clock Hands with custom rotation from calculated angles */}
                {/* Hour Hand */}
                <line
                  x1="50"
                  y1="50"
                  x2={50 + 24 * Math.cos((hourAngle * Math.PI) / 180)}
                  y2={50 + 24 * Math.sin((hourAngle * Math.PI) / 180)}
                  stroke="#1e1b4b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Minute Hand */}
                <line
                  x1="50"
                  y1="50"
                  x2={50 + 34 * Math.cos((minuteAngle * Math.PI) / 180)}
                  y2={50 + 34 * Math.sin((minuteAngle * Math.PI) / 180)}
                  stroke="#eab308"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              {/* Center dot pin */}
              <div className="absolute w-2.5 h-2.5 bg-indigo-900 rounded-full"></div>
            </div>

            {/* Questions Metadata and Controls */}
            <div className="space-y-3 flex-1 text-center sm:text-left w-full">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-[#C60B1E] bg-red-50 border border-red-150 px-2 py-0.5 rounded uppercase font-mono">
                  Él Reloj
                </span>
                <span className="text-sm font-black text-indigo-950 font-mono bg-yellow-50 text-indigo-900 border border-yellow-200 px-3 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                  <Clock size={14} className="text-yellow-600 animate-spin" />
                  {currentQuestion.timeStr}
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-indigo-950 leading-tight">
                  {currentQuestion.questionEsp}
                </h3>
                <button
                  type="button"
                  onClick={() => handleSpeak(currentQuestion.correctAnswer)}
                  className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-650 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  title="Լսել իսպաներեն թարգմանությունը"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              <p className="text-xs text-indigo-900 font-bold bg-white/85 py-1.5 px-3 rounded-xl border border-indigo-50 inline-block">
                Հարց՝ {currentQuestion.questionArm}
              </p>
            </div>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOpt === option;
              const isCorrectTarget = option === currentQuestion.correctAnswer;

              let btnStyle = 'bg-white hover:bg-indigo-50/40 border-indigo-100 hover:border-indigo-300 text-indigo-950';
              if (isSelected) {
                if (isAnswered) {
                  btnStyle = isSelectedCorrect 
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100 font-extrabold scale-[1.01]' 
                    : 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100 font-extrabold scale-[1.01]';
                } else {
                  btnStyle = 'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-100 font-extrabold scale-[1.01]';
                }
              } else if (isAnswered && isCorrectTarget) {
                btnStyle = 'bg-emerald-100/90 text-emerald-900 border-emerald-300 font-extrabold scale-[1.01]';
              }

              return (
                <button
                  key={option}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full py-4 px-5 rounded-2xl text-left text-xs sm:text-sm font-semibold transition-all border outline-none flex justify-between items-center ${btnStyle} ${
                    !isAnswered ? 'cursor-pointer hover:shadow-xs active:translate-y-px' : ''
                  }`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrectTarget && <span className="text-emerald-700 text-xs font-black">✓ Ճիշտ</span>}
                  {isAnswered && isSelected && !isSelectedCorrect && <span className="text-white text-xs font-black">✗ Սխալ</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation Area */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border text-xs leading-relaxed font-semibold ${
                isSelectedCorrect 
                  ? 'bg-emerald-50 text-emerald-805 border-emerald-150' 
                  : 'bg-rose-50 text-rose-805 border-rose-150'
              }`}
            >
              <div className="flex gap-2 items-start">
                <AlertCircle size={16} className={`${isSelectedCorrect ? 'text-emerald-600' : 'text-rose-600'} shrink-0 mt-0.5`} />
                <div>
                  <strong className="block text-[13px] mb-0.5">
                    {isSelectedCorrect ? 'Ճիշտ է՛ (¡Excelente!)' : 'Բացատրություն (Explicación)'}
                  </strong>
                  <p>{currentQuestion.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigate Confirm Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleNext}
              disabled={selectedOpt === null}
              className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border outline-none ${
                selectedOpt === null
                  ? 'bg-indigo-50 border-indigo-100 text-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 border-indigo-700 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 hover:scale-105 active:scale-95 cursor-pointer'
              }`}
            >
              {!isAnswered ? 'ՊԱՏԱՍԽԱՆԵԼ' : currentIdx < questions.length - 1 ? 'ՀԱՋՈՐԴ ՀԱՐՑԸ →' : 'ԱՎԱՐՏԵԼ ՎԻԿՏՈՐԻՆԱՆ 🏆'}
            </button>
          </div>
        </div>
      ) : (
        /* Completed Summary View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center py-4"
        >
          <div className="inline-block p-4 bg-yellow-50 rounded-full text-yellow-500 border border-yellow-250">
            <Trophy size={48} className="animate-bounce" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-black text-indigo-950 font-display">Վիկտորինան Ավարտված է:</h3>
            <p className="text-indigo-400 font-bold text-xs sm:text-sm">
              Դուք ճիշտ պատասխանեցիք <strong className="text-indigo-900">{correctCount}</strong> հարցի՝ <strong className="text-indigo-900">{questions.length}</strong>-ից:
            </p>
          </div>

          {/* Reward block */}
          <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 max-w-sm mx-auto space-y-1">
            <span className="text-[10px] font-black text-emerald-600 block uppercase tracking-widest">Ստացված կարգավիճակը`</span>
            <span className="text-base sm:text-lg font-black text-indigo-950 block">
              {correctCount === questions.length ? 'Ժամերի իսկական Վարպետ 🕒🏆' : correctCount >= 15 ? 'Ժամապահ (Experto) 🎓' : correctCount >= 10 ? 'Լավ տիրապետող 👍' : 'Կրկնելու կարիք կա 📚'}
            </span>
            <div className="bg-emerald-600 text-white px-4 py-1.5 rounded-full font-black text-xs inline-block shadow-sm mt-3 animate-pulse">
              +{Math.round((correctCount / questions.length) * 60)} XP
            </div>
          </div>

          <div className="flex justify-center gap-3.5 pt-4">
            <button
              onClick={() => {
                setQuestions([...rawQuestions].sort(() => Math.random() - 0.5));
                setCurrentIdx(0);
                setSelectedOpt(null);
                setIsAnswered(false);
                setCorrectCount(0);
                setIsCompleted(false);
              }}
              className="px-6 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-extrabold text-xs sm:text-sm rounded-2xl border border-indigo-100 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              🔄 ԽԱՂԱԼ ԿՐԿԻՆ
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl border border-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-md shadow-indigo-100 cursor-pointer"
            >
              Վերադառնալ Մենյու
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
