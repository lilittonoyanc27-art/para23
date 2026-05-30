import { useState, useEffect } from 'react';
import { SENTENCE_QUESTIONS } from './data';
import { SentenceQuestion } from './types';
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onBack: () => void;
  onGameComplete: (score: number) => void;
}

export default function GameSentenceFill({ onBack, onGameComplete }: Props) {
  const [questions, setQuestions] = useState<SentenceQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');

  useEffect(() => {
    // Shuffle sentence questions
    const shuffled = [...SENTENCE_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
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
  const { sentenceWithBlank, translation, options, correctAnswer, explanation } = currentQuestion;

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === correctAnswer) {
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

  // Turn sentence "Hoy es ___." into split strings to insert the selected answer visually inside the blank!
  const renderSentence = () => {
    const parts = sentenceWithBlank.split('___');
    return (
      <div className="text-2xl font-extrabold font-display text-slate-800 tracking-wide flex justify-center items-center flex-wrap gap-2 py-4">
        <span>{parts[0]}</span>
        <span className={`px-3 py-1 font-mono rounded-xl border-2 transition-all ${
          isAnswered
            ? selectedAnswer === correctAnswer
              ? 'bg-emerald-500 border-emerald-500 text-white min-w-[100px] text-center'
              : 'bg-rose-500 border-rose-500 text-white min-w-[100px] text-center'
            : 'bg-slate-50 border-dashed border-slate-300 text-slate-400 min-w-[100px] text-center'
        }`}>
          {isAnswered ? selectedAnswer : '???'}
        </span>
        <span>{parts[1]}</span>
      </div>
    );
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
          <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-wider">ԽԱՂ 3</span>
          <h2 className="text-lg font-bold font-display text-slate-800">Նախադասությունների Լրացում</h2>
        </div>
        <div className="text-sm font-semibold font-mono text-slate-500">
          {gameState === 'playing' ? `${currentIdx + 1}/${questions.length}` : 'Ավարտ'}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'playing' ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-teal-500 h-full transition-all duration-300" 
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Armenian Translation Translation Bubble */}
            <div className="bg-teal-50/30 border border-teal-100/50 rounded-2xl p-4 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-700">Հայերեն Թարգմանությունը`</span>
              <p className="text-slate-700 text-sm font-semibold">{translation}</p>
            </div>

            {/* Sentence Render */}
            {renderSentence()}

            {/* Multiple Choice Answers */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === correctAnswer;

                let buttonStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300';
                if (isAnswered) {
                  if (isCorrect) {
                     buttonStyle = 'bg-emerald-500 border-emerald-500 text-white pointer-events-none scale-[1.02]';
                  } else if (isSelected) {
                     buttonStyle = 'bg-rose-500 border-rose-500 text-white pointer-events-none scale-[0.98]';
                  } else {
                     buttonStyle = 'bg-slate-50 border-slate-100 text-slate-300 pointer-events-none';
                  }
                }

                return (
                  <button
                    key={option}
                    disabled={isAnswered}
                    onClick={() => handleSelect(option)}
                    className={`py-3.5 px-4 rounded-xl border font-mono font-bold text-center transition-all cursor-pointer ${buttonStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border flex gap-3 ${
                  selectedAnswer === correctAnswer 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                    : 'bg-rose-50 border-rose-100 text-rose-800'
                }`}
              >
                {selectedAnswer === correctAnswer ? (
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                ) : (
                  <XCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {selectedAnswer === correctAnswer ? 'Գերազա՛նց է' : 'Ճիշտ տարբերակը'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">{explanation}</p>
                </div>
              </motion.div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end pt-2">
                <button
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
            <div className="inline-block p-4 bg-teal-100 text-teal-600 rounded-full">
              <Trophy size={48} className="animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold font-display text-slate-800">Խաղն Ավարտվեց:</h3>
              <p className="text-slate-500 text-sm">
                Դուք ճիշտ պատասխանեցիք <strong className="text-slate-800">{score}</strong> նախադասության՝ <strong className="text-slate-800">{questions.length}</strong>-ից:
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl max-w-sm mx-auto border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Վաստակած մակարդակը</span>
              <span className="text-lg font-bold font-display text-teal-700">
                {score === questions.length ? 'Նախադասությունների Վարպետ ✍️' : score >= 5 ? 'Լավ առաջընթաց ✨' : 'Շարունակեք սովորել 📖'}
              </span>
              <div className="text-xs text-teal-600 mt-2 font-bold px-3 py-1 bg-teal-50 rounded-full inline-block">
                +{Math.round((score / questions.length) * 40)} Միավոր!
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  const shuffled = [...SENTENCE_QUESTIONS].sort(() => Math.random() - 0.5);
                  setQuestions(shuffled);
                  setCurrentIdx(0);
                  setSelectedAnswer(null);
                  setIsAnswered(false);
                  setScore(0);
                  setGameState('playing');
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
