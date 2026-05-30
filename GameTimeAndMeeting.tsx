import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Calendar, Bookmark, Trophy, RefreshCw, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  timeDisplay?: string;
  scenario?: string;
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

export default function GameTimeAndMeeting({ onBack, onGameComplete }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const rawQuestions: Question[] = [
    {
      id: 1,
      timeDisplay: '03:30',
      questionEsp: '¿Cómo se dice esta hora en español?',
      questionArm: 'Ինչպե՞ս է ասվում «03:30» (երեք անց կես) ժամը իսպաներենով:',
      options: ['Son las tres y media', 'Es las tres y media', 'Son las tres menos media', 'Es la una y media'],
      correctAnswer: 'Son las tres y media',
      explanation: 'Իսպաներենում 1:00-ից բացի բոլոր ժամերի համար ասվում է «Son las...», իսկ «y media» նշանակում է անց կես:'
    },
    {
      id: 2,
      timeDisplay: '01:15',
      questionEsp: '¿Cuál es la forma correcta para "01:15"?',
      questionArm: 'Ինչպե՞ս է կանոնավոր ձևով ասվում «01:15» (մեկն անց տասնհինգ/քառորդ) ժամը:',
      options: ['Es la una y cuarto', 'Son las una y cuarto', 'Es la una y quince', 'Son la una menos cuarto'],
      correctAnswer: 'Es la una y cuarto',
      explanation: 'Ժամը 1-ի դեպքում (1:00-1:59) օգտագործվում է եզակի ձևը՝ «Es la una...», իսկ «y cuarto» նշանակում է քառորդ անց:'
    },
    {
      id: 3,
      scenario: '📆 Mateo ➔ Anahit',
      questionEsp: '¿Cómo se dice "at 5:00" para pactar una hora?',
      questionArm: 'Ինչպե՞ս է ասվում «ժամը հինգին» ժամադրություն պայմանավորվելիս:',
      options: ['a las cinco', 'en las cinco', 'con las cinco', 'a la cinco'],
      correctAnswer: 'a las cinco',
      explanation: 'Հանդիպման կոնկրետ ժամ նշելիս ասում ենք «a las» + ժամը (բացառությամբ ժամը մեկին՝ «a la una»):'
    },
    {
      id: 4,
      scenario: '📅 Свободный день?',
      questionEsp: '¿Qué frase significa "¿Չորեքշաբթի օրը քեզ հարմա՞ր է"?',
      questionArm: 'Իսպաներեն ո՞ր նախադասությունն է նշանակում՝ «Չորեքշաբթի օրը քեզ հարմա՞ր է»:',
      options: [
        '¿Te viene bien el miércoles?',
        '¿Te va bien el lunes?',
        '¿Quieres el miércoles?',
        '¿Quedamos el viernes?'
      ],
      correctAnswer: '¿Te viene bien el miércoles?',
      explanation: '«¿Te viene bien...?» նշանակում է «քեզ հարմա՞ր է» + շաբաթվա օրը «el miércoles» (չորեքշաբթի):'
    },
    {
      id: 5,
      timeDisplay: '06:45',
      questionEsp: '¿Cómo expresan "6:45" restando tiempo en español?',
      questionArm: 'Ինչպե՞ս են իսպաներեն թարգմանում «6:45» (յոթին քառորդ պակաս) ժամը՝ հետհաշվարկով:',
      options: ['Son las siete menos cuarto', 'Son las seis menos cuarto', 'Es las siete menos cuarto', 'Son las siete y cuarenta y cinco'],
      correctAnswer: 'Son las siete menos cuarto',
      explanation: 'Հաջորդ սպասվող ժամից (7:00) հանում ենք տասնհինգ րոպե (cuarto)` «Son las siete menos cuarto»:'
    },
    {
      id: 6,
      scenario: '💬 "Nos vemos el viernes a las cinco."',
      questionEsp: '¿Qué significa esta oración en armenio?',
      questionArm: 'Ի՞նչ է նշանակում «Nos vemos el viernes a las cinco»:',
      options: [
        'Կհանդիպենք ուրբաթ ժամը հինգին:',
        'Կհանդիպենք չորեքշաբթի ժամը հինգին:',
        'Կհանդիպենք ուրբաթ ժամը երեքին:',
        'Կտեսնվենք երկուշաբթի ժամը հինգին:'
      ],
      correctAnswer: 'Կհանդիպենք ուրբաթ ժամը հինգին:',
      explanation: '«Nos vemos» նշանակում է կհանդիպենք/կտեսնվենք, «el viernes»՝ ուրբաթ, «a las cinco»՝ ժամը հինգին:'
    },
    {
      id: 7,
      scenario: '📆 Anahit ➔ Mateo',
      questionEsp: '¿Cómo dices "Monday at 1:00"?',
      questionArm: 'Ինչպե՞ս գրել «Երկուշաբթի ժամը մեկին (1:00-ին)»:',
      options: ['el lunes a la una', 'el lunes a las una', 'el lunes en la una', 'el lunes por la una'],
      correctAnswer: 'el lunes a la una',
      explanation: 'Ժամը մեկի (1:00) դեպքում օգտագործվում է եզակի «a la una»: Օրվա համար՝ «el lunes»:'
    },
    {
      id: 8,
      scenario: '🕒 Quedar exactamente',
      questionEsp: '¿Qué frase se reduce a "We meet exactly at 4:00"?',
      questionArm: 'Ինչպե՞ս թարգմանել «Պայմանավորվում ենք հանդիպել ժամը ճիշտ 4:00-ին»:',
      options: [
        'Quedamos a las cuatro en punto',
        'Quedamos a las cuatro menos punto',
        'Quedamos a la una en punto',
        'Nos vemos el sábado'
      ],
      correctAnswer: 'Quedamos a las cuatro en punto',
      explanation: '«Quedamos a las cuatro» նշանակում է պայմանավորվում ենք հանդիպել չորսին, իսկ «en punto» նշանակում է ճիշտ / զրո զրո րոպեներին:'
    }
  ];

  useEffect(() => {
    // Scaffold questions randomly
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
      // Locking the answer
      setIsAnswered(true);
      const isCorrect = selectedOpt === questions[currentIdx].correctAnswer;
      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
      }
    } else {
      // Advancing
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOpt(null);
        setIsAnswered(false);
      } else {
        setIsCompleted(true);
        // Award points (up to 40)
        const scoreEarned = Math.round((correctCount / questions.length) * 40);
        onGameComplete(scoreEarned);
      }
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (questions.length === 0) {
    return <div className="text-center p-8 font-bold">Բեռնում...</div>;
  }

  const currentQuestion = questions[currentIdx];
  const isSelectedCorrect = selectedOpt === currentQuestion.correctAnswer;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-indigo-50 max-w-2xl mx-auto">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-indigo-50">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Հետ</span>
        </button>
        <div className="text-center">
          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">ԽԱՂ 7 (ՆՈՐ)</span>
          <h2 className="text-base font-black text-indigo-950 font-display">Ժամադրության և Ժամային Խաղ</h2>
        </div>
        <div className="text-xs font-black font-mono text-indigo-400">
          {isCompleted ? 'Ավարտ' : `${currentIdx + 1}/${questions.length}`}
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-indigo-50 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question card */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 p-6 rounded-2xl border border-indigo-50 space-y-4">
            
            {/* Hour Visual Indicator (if timeDisplay exists) */}
            {currentQuestion.timeDisplay && (
              <div className="flex justify-center my-2">
                <div className="flex items-center gap-2 bg-indigo-900 text-yellow-300 px-5 py-2.5 rounded-2xl font-mono text-2xl font-black shadow-lg">
                  <Clock size={24} className="animate-pulse" />
                  <span>{currentQuestion.timeDisplay}</span>
                </div>
              </div>
            )}

            {/* Scenario Header (if scenario exists) */}
            {currentQuestion.scenario && (
              <div className="flex justify-center mb-1">
                <div className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider border border-rose-100 flex items-center gap-1.5">
                  <Calendar size={12} />
                  <span>{currentQuestion.scenario}</span>
                </div>
              </div>
            )}

            <div className="text-center space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block">Իսպաներեն թեմա</span>
              
              <div className="inline-flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-black text-indigo-950 leading-snug">
                  {currentQuestion.questionEsp}
                </h3>
                <button
                  onClick={() => handleSpeak(currentQuestion.questionEsp)}
                  className="p-1 text-indigo-400 hover:text-indigo-700 rounded-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  title="Արտասանել"
                >
                  <Volume2 size={15} />
                </button>
              </div>

              <div className="border-t border-dashed border-indigo-100/80 pt-2 text-sm text-indigo-900 font-bold bg-white/70 py-1.5 px-3 rounded-lg inline-block">
                Հայերեն՝ {currentQuestion.questionArm}
              </div>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOpt === option;
              const isCorrectTarget = option === currentQuestion.correctAnswer;
              
              let optStyle = 'bg-white hover:bg-indigo-50/40 border-indigo-100 hover:border-indigo-300 text-indigo-950';
              if (isSelected) {
                if (isAnswered) {
                  optStyle = isSelectedCorrect 
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100' 
                    : 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100';
                } else {
                  optStyle = 'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-100';
                }
              } else if (isAnswered && isCorrectTarget) {
                // highlight correct answer if wrong answer was chosen
                optStyle = 'bg-emerald-100/80 text-emerald-800 border-emerald-300 font-extrabold';
              }

              return (
                <button
                  key={option}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full py-3.5 px-5 rounded-2xl font-bold text-left text-xs sm:text-sm font-sans transition-all border outline-none flex justify-between items-center ${optStyle} ${
                    !isAnswered ? 'cursor-pointer hover:scale-[1.01] active:translate-y-px' : ''
                  }`}
                >
                  <span>{option}</span>
                  {isAnswered && isCorrectTarget && <span className="text-emerald-600 text-xs">✓ Ճիշտ</span>}
                  {isAnswered && isSelected && !isSelectedCorrect && <span className="text-white text-xs">✗ Սխալ</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border text-xs leading-relaxed font-semibold transition-all ${
                isSelectedCorrect 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border-rose-100'
              }`}
            >
              <div className="flex gap-2 items-start">
                {isSelectedCorrect ? (
                  <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block text-[13px] mb-0.5">
                    {isSelectedCorrect ? 'Հիանալի՛ է:' : 'Տեղեկատվություն:'}
                  </strong>
                  <p>{currentQuestion.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Nav / Confirm Button */}
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
              {!isAnswered ? 'ՊԱՏԱՍԽԱՆԵԼ' : currentIdx < questions.length - 1 ? 'ՀԱՋՈՐԴ ՀԱՐՑԸ →' : 'ԱՎԱՐՏԵԼ ԽԱՂԸ 🏆'}
            </button>
          </div>
        </div>
      ) : (
        /* Game Completed View */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center py-4"
        >
          <div className="inline-block p-4 bg-yellow-50 rounded-full text-yellow-500 border border-yellow-200">
            <Trophy size={48} className="animate-bounce" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-black text-indigo-950 font-display">Ժամային Խաղը կատարված է!</h3>
            <p className="text-indigo-400 font-bold text-xs sm:text-sm">
              Դուք ճիշտ պատասխանեցիք <strong className="text-indigo-900">{correctCount}</strong> հարցի՝ <strong className="text-indigo-900">{questions.length}</strong>-ից:
            </p>
          </div>

          {/* Reward block */}
          <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 max-w-sm mx-auto space-y-1 select-none">
            <span className="text-[10px] font-black text-emerald-600 block uppercase tracking-widest">Վաստակած մակարդակը`</span>
            <span className="text-base sm:text-lg font-black text-indigo-950 block">
              {correctCount === questions.length ? 'Ժամապահ և Ճշտապահ (Experto) 🎓🕒' : correctCount >= 5 ? 'Հանդիպումների կազմակերպիչ 🌟' : 'Կարիք կա կրկնելու 📚'}
            </span>
            <div className="bg-emerald-600 text-white px-4 py-1.5 rounded-full font-black text-xs inline-block shadow-sm mt-3 animate-pulse">
              +{Math.round((correctCount / questions.length) * 40)} XP
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
              ԽԱՂԱԼ ԿՐԿԻՆ 🔄
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
