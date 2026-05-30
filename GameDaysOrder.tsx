import { useState, useEffect } from 'react';
import { DAYS_OF_WEEK } from './data';
import { DayOfWeek } from './types';
import { RefreshCw, CheckCircle, AlertCircle, ArrowLeft, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onBack: () => void;
  onGameComplete: (score: number) => void;
}

export default function GameDaysOrder({ onBack, onGameComplete }: Props) {
  const [scrambled, setScrambled] = useState<DayOfWeek[]>([]);
  const [placed, setPlaced] = useState<(DayOfWeek | null)[]>([null, null, null, null, null, null, null]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isCompleted, setIsCompleted] = useState(false);

  // Helper to shuffle
  const shuffleAndSet = () => {
    const arr = [...DAYS_OF_WEEK];
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setScrambled(arr);
    setPlaced([null, null, null, null, null, null, null]);
    setFeedback({ type: null, message: '' });
    setIsCompleted(false);
  };

  useEffect(() => {
    shuffleAndSet();
  }, []);

  // Handle clicking a card from scrambled deck
  const handleScrambledClick = (day: DayOfWeek) => {
    // Find first empty index in placed list
    const firstEmptyIndex = placed.findIndex(item => item === null);
    if (firstEmptyIndex !== -1) {
      const newPlaced = [...placed];
      newPlaced[firstEmptyIndex] = day;
      setPlaced(newPlaced);
      
      // Remove from scrambled deck
      setScrambled(scrambled.filter(item => item.id !== day.id));
    }
  };

  // Handle clicking a card in placed slot to return it
  const handlePlacedClick = (index: number) => {
    const day = placed[index];
    if (day !== null) {
      // Put back in scrambled deck
      setScrambled([...scrambled, day]);
      
      // Clear placed slot
      const newPlaced = [...placed];
      newPlaced[index] = null;
      setPlaced(newPlaced);
      setFeedback({ type: null, message: '' });
    }
  };

  const handleCheck = () => {
    // Ensure all 7 slots are filled
    if (placed.includes(null)) {
      setFeedback({
        type: 'error',
        message: 'Խնդրում ենք տեղադրել բոլոր 7 օրերը համապատասխան վանդակներում:'
      });
      return;
    }

    // Verify ordering
    let correctCount = 0;
    const errors: number[] = [];
    placed.forEach((day, index) => {
      if (day && day.order === index) {
        correctCount++;
      } else {
        errors.push(index);
      }
    });

    if (correctCount === 7) {
      setFeedback({
        type: 'success',
        message: 'Հրաշալի՜ է: Դուք ճիշտ դասավորեցիք շաբաթվա բոլոր օրերը հերթականությամբ:'
      });
      setIsCompleted(true);
      onGameComplete(30); // 30 points awarded
    } else {
      setFeedback({
        type: 'error',
        message: `Սխալներ կան: Շաբաթվա օրերից ${7 - correctCount}-ը սխալ տեղում են գտնվում: Փորձեք նորից:`
      });
    }
  };

  const slotLabels = [
    'Օր 1 (Երկուշաբթի)',
    'Օր 2 (Երեքշաբթի)',
    'Օր 3 (Չորեքշաբթի)',
    'Օր 4 (Հինգշաբթի)',
    'Օր 5 (Ուրբաթ)',
    'Օր 6 (Շաբաթ)',
    'Օր 7 (Կիրակի)'
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-w-4xl mx-auto">
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
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">ԽԱՂ 1</span>
          <h2 className="text-lg font-bold font-display text-slate-800">Շաբաթվա օրերի հերթականություն</h2>
        </div>
        <button
          onClick={shuffleAndSet}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
          title="Խառնել նորից"
        >
          <RefreshCw size={16} />
          <span className="hidden sm:inline">Սկսել նորից</span>
        </button>
      </div>

      <div className="mb-6 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
        <h4 className="font-semibold text-slate-800 mb-1">Ինստրուկցիա.</h4>
        <p>Կտտացրեք ստորև տրված իսպաներեն օրերի վրա, որպեսզի դրանք տեղադրեք ճիշտ հաջորդականությամբ՝ <strong>Երկուշաբթիից (lunes) մինչև Կիրակի (domingo)</strong>: Տեղադրված օրվա վրա կտտացնելով՝ կարող եք այն հետ վերադարձնել:</p>
      </div>

      {/* Target Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 mb-8">
        {placed.map((day, index) => (
          <div key={index} className="flex flex-col h-full">
            <span className="text-[10px] text-slate-400 font-medium mb-1 block text-center truncate">{slotLabels[index]}</span>
            <div
              onClick={() => handlePlacedClick(index)}
              className={`h-16 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                day 
                  ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:scale-[1.02] shadow-sm'
                  : 'bg-slate-50 border-dashed border-slate-200 hover:border-slate-300'
              }`}
            >
              <AnimatePresence mode="wait">
                {day ? (
                  <motion.div
                    key={day.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="text-center w-full px-2"
                  >
                    <span className="font-bold text-sm block font-mono">{day.spanish}</span>
                    <span className="text-[10px] opacity-90 block">{day.armenian}</span>
                  </motion.div>
                ) : (
                  <span className="text-xs text-slate-300 font-medium font-mono text-center px-1">Դատարկ</span>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Scrambled Deck */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">Ընտրեք օրերը</span>
        
        {scrambled.length === 0 && !placed.includes(null) ? (
          <div className="text-center py-2 text-slate-400 text-xs font-medium">Բոլոր օրերը տեղադրված են: Ստուգեք արդյունքը:</div>
        ) : scrambled.length === 0 ? (
          <div className="text-center py-2 text-slate-400 text-xs font-medium">Կատարվում է...</div>
        ) : (
          <div className="flex flex-wrap gap-2.5 justify-center">
            {scrambled.map((day) => (
              <motion.button
                key={day.id}
                layoutId={`card-${day.id}`}
                onClick={() => handleScrambledClick(day)}
                className="px-4 py-3 bg-white hover:bg-amber-50 rounded-xl border border-slate-200 hover:border-amber-300 text-slate-700 font-medium text-sm font-mono transition-shadow shadow-xs hover:shadow-sm cursor-pointer hover:scale-[1.03]"
                whileTap={{ scale: 0.97 }}
              >
                <span className="block font-bold">{day.spanish}</span>
                <span className="text-[11px] text-slate-400 font-sans block mt-0.5">{day.armenian}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Control Buttons and feedback */}
      <div className="flex flex-col items-center gap-4">
        {feedback.type && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-sm max-w-xl w-full ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{feedback.type === 'success' ? 'Ճիշտ է' : 'Ուշադրություն'}</p>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{feedback.message}</p>
            </div>
          </motion.div>
        )}

        <div className="flex gap-4">
          {!isCompleted ? (
            <button
              onClick={handleCheck}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Ստուգել
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-3">
                <button
                  onClick={shuffleAndSet}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                  Խաղալ կրկին
                </button>
                <button
                  onClick={onBack}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Վերադառնալ Մենյու
                </button>
              </div>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-yellow-50 text-amber-800 px-4 py-1.5 rounded-full border border-yellow-200 text-xs font-semibold"
              >
                <Trophy size={14} className="text-amber-500 animate-bounce" />
                Ստացաք +30 Միավոր!
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
