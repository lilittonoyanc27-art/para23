import { useState, useEffect } from 'react';
import { NOUN_ITEMS } from './data';
import { NounItem } from './types';
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, HelpCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onBack: () => void;
  onGameComplete: (score: number) => void;
}

interface QuizItem {
  noun: NounItem;
  type: 'definite' | 'indefinite';
  correctAnswer: string;
}

export default function GameArticleQuiz({ onBack, onGameComplete }: Props) {
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');

  // Generate questions
  useEffect(() => {
    // Generate a random set of 8 noun questions with mixed article types
    const shuffledNouns = [...NOUN_ITEMS].sort(() => Math.random() - 0.5).slice(0, 8);
    const generated: QuizItem[] = shuffledNouns.map(noun => {
      const type = Math.random() > 0.5 ? 'definite' : 'indefinite';
      let correctAnswer = '';
      
      if (type === 'definite') {
        if (noun.gender === 'M' && noun.number === 'S') correctAnswer = 'el';
        else if (noun.gender === 'F' && noun.number === 'S') correctAnswer = 'la';
        else if (noun.gender === 'M' && noun.number === 'P') correctAnswer = 'los';
        else if (noun.gender === 'F' && noun.number === 'P') correctAnswer = 'las';
      } else {
        if (noun.gender === 'M' && noun.number === 'S') correctAnswer = 'un';
        else if (noun.gender === 'F' && noun.number === 'S') correctAnswer = 'una';
        else if (noun.gender === 'M' && noun.number === 'P') correctAnswer = 'unos';
        else if (noun.gender === 'F' && noun.number === 'P') correctAnswer = 'unas';
      }
      
      return { noun, type, correctAnswer };
    });
    setQuestions(generated);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setGameState('playing');
  }, []);

  if (questions.length === 0) {
    return <div className="text-center p-8">Կատարվում է...</div>;
  }

  const currentQuestion = questions[currentIdx];
  const { noun, type, correctAnswer } = currentQuestion;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setGameState('finished');
      // Award up to 40 points
      const pointsWon = Math.round((score / questions.length) * 40);
      onGameComplete(pointsWon);
    }
  };

  // Definite/Indefinite candidate answer pools
  const options = type === 'definite' ? ['el', 'la', 'los', 'las'] : ['un', 'una', 'unos', 'unas'];

  // Explaining correct answer logic in Armenian
  const getExplanation = () => {
    const genderStr = noun.gender === 'M' ? 'արական' : 'իգական';
    const numberStr = noun.number === 'S' ? 'եզակի' : 'հոգնակի';
    const typeStr = type === 'definite' ? 'որոշյալ (definite)' : 'անորոշ (indefinite)';
    
    return `«${noun.spanish}» գոյականը ${genderStr} սեռի ${numberStr} թվի է: Հետևաբար, նրա ${typeStr} հոդն է՝ «${correctAnswer}»:`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-50/50">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Հետ
        </button>
        <div className="text-center">
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">ԽԱՂ 2</span>
          <h2 className="text-lg font-bold font-display text-slate-800">Հոդերի Ընտրություն</h2>
        </div>
        <div className="text-sm font-semibold font-mono text-slate-500">
          {gameState === 'playing' ? `${currentIdx + 1}/${questions.length}` : 'Ավարտ'}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'playing' ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full transition-all duration-300" 
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Instruction */}
            <div className="text-center space-y-2 py-3 bg-amber-50/30 rounded-2xl border border-amber-100/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Լրացրեք {type === 'definite' ? 'ՈՐՈՇՅԱԼ (Definite)' : 'ԱՆՈՐՈՇ (Indefinite)'} հոդը
              </span>
              
              <div className="flex justify-center items-center gap-3">
                <span className="text-3xl font-bold font-mono text-slate-300">____</span>
                <span className="text-3xl font-extrabold font-display text-slate-800 tracking-wide">{noun.spanish}</span>
              </div>
              
              <p className="text-xs text-slate-500">
                Թարգմանություն` <strong className="text-slate-600">{noun.armenian} ({noun.number === 'S' ? 'եզակի' : 'հոգնակի'})</strong>
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              {options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === correctAnswer;
                
                let buttonStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs';
                if (isAnswered) {
                  if (isCorrect) {
                    buttonStyle = 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-100';
                  } else if (isSelected) {
                    buttonStyle = 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-100';
                  } else {
                    buttonStyle = 'bg-slate-50 border-slate-100 text-slate-300 scale-98 pointer-events-none';
                  }
                }

                return (
                  <button
                    id={`btn-opt-${option}`}
                    key={option}
                    disabled={isAnswered}
                    onClick={() => handleAnswerSelect(option)}
                    className={`py-4 px-6 rounded-2xl border text-lg font-bold font-mono transition-all text-center focus:outline-none cursor-pointer ${buttonStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback Details */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border flex gap-3 ${
                  selectedAnswer === correctAnswer 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {selectedAnswer === correctAnswer ? (
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                ) : (
                  <XCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {selectedAnswer === correctAnswer ? 'Կեցցե՛ս, ճիշտ է։' : 'Սխալ է, ուշադիր եղեք։'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">{getExplanation()}</p>
                </div>
              </motion.div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  id="btn-next"
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 text-sm shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                >
                  {currentIdx === questions.length - 1 ? 'Ավարտել' : 'Հաջորդը'}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-6"
          >
            <div className="inline-block p-4 bg-yellow-100 text-amber-600 rounded-full">
              <Trophy size={48} className="animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold font-display text-slate-800">Վիկտորինան Ավարտվեց:</h3>
              <p className="text-slate-500 text-sm">
                Դուք ճիշտ պատասխանեցիք <strong className="text-slate-800">{score}</strong> հարցի՝ <strong className="text-slate-800">{questions.length}</strong>-ից:
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl max-w-sm mx-auto border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Վաստակած մակարդակը</span>
              <span className="text-lg font-bold font-display text-amber-700">
                {score === questions.length ? 'Փայլուն Իսպանախոս 🌟' : score >= 5 ? 'Լավ առաջընթաց 👍' : 'Փորձեք կրկին 📚'}
              </span>
              <div className="text-xs text-amber-600 mt-2 font-bold px-3 py-1 bg-amber-50 rounded-full inline-block">
                +{Math.round((score / questions.length) * 40)} Միավոր!
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  // Restart game
                  setQuestions([]);
                  setTimeout(() => {
                    const shuffledNouns = [...NOUN_ITEMS].sort(() => Math.random() - 0.5).slice(0, 8);
                    const generated: QuizItem[] = shuffledNouns.map(noun => {
                      const type = Math.random() > 0.5 ? 'definite' : 'indefinite';
                      let correctAnswer = '';
                      if (type === 'definite') {
                        if (noun.gender === 'M' && noun.number === 'S') correctAnswer = 'el';
                        else if (noun.gender === 'F' && noun.number === 'S') correctAnswer = 'la';
                        else if (noun.gender === 'M' && noun.number === 'P') correctAnswer = 'los';
                        else if (noun.gender === 'F' && noun.number === 'P') correctAnswer = 'las';
                      } else {
                        if (noun.gender === 'M' && noun.number === 'S') correctAnswer = 'un';
                        else if (noun.gender === 'F' && noun.number === 'S') correctAnswer = 'una';
                        else if (noun.gender === 'M' && noun.number === 'P') correctAnswer = 'unos';
                        else if (noun.gender === 'F' && noun.number === 'P') correctAnswer = 'unas';
                      }
                      return { noun, type, correctAnswer };
                    });
                    setQuestions(generated);
                    setCurrentIdx(0);
                    setSelectedAnswer(null);
                    setIsAnswered(false);
                    setScore(0);
                    setGameState('playing');
                  }, 100);
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
              >
                Խաղալ կրկին
              </button>
              <button
                onClick={onBack}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Վերադառնալ Մենյու
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
