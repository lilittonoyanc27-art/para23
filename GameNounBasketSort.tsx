import { useState, useEffect } from 'react';
import { NOUN_ITEMS } from './data';
import { NounItem } from './types';
import { ArrowLeft, CheckCircle2, ChevronRight, XCircle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onBack: () => void;
  onGameComplete: (score: number) => void;
}

interface SortedItem {
  noun: NounItem;
  correctBasket: string;
  userBasket: string;
  isCorrect: boolean;
}

export default function GameNounBasketSort({ onBack, onGameComplete }: Props) {
  const [deck, setDeck] = useState<NounItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [history, setHistory] = useState<SortedItem[]>([]);
  const [isDone, setIsDone] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  useEffect(() => {
    // Pick 10 random nouns to keep the game short and high momentum
    const shuffled = [...NOUN_ITEMS].sort(() => Math.random() - 0.5).slice(0, 10);
    setDeck(shuffled);
    setCurrentIdx(0);
    setHistory([]);
    setIsDone(false);
    setLastFeedback(null);
  }, []);

  if (deck.length === 0) {
    return <div className="text-center p-8">Կատարվում է...</div>;
  }

  const currentNoun = deck[currentIdx];

  const handleBasketSelect = (basket: 'el' | 'la' | 'los' | 'las') => {
    if (isDone) return;

    // Calculate correct basket
    let correctBasket = '';
    if (currentNoun.gender === 'M' && currentNoun.number === 'S') correctBasket = 'el';
    else if (currentNoun.gender === 'F' && currentNoun.number === 'S') correctBasket = 'la';
    else if (currentNoun.gender === 'M' && currentNoun.number === 'P') correctBasket = 'los';
    else if (currentNoun.gender === 'F' && currentNoun.number === 'P') correctBasket = 'las';

    const isCorrect = basket === correctBasket;

    // Add to history
    const newItem: SortedItem = {
      noun: currentNoun,
      correctBasket,
      userBasket: basket,
      isCorrect,
    };

    setHistory(prev => [...prev, newItem]);
    
    // Set feedback
    setLastFeedback({
      isCorrect,
      text: isCorrect
        ? `💥 Ճիշտ է! «${correctBasket} ${currentNoun.spanish}»`
        : `😢 Սխալ է! Ճիշտ տարբերակն է՝ «${correctBasket} ${currentNoun.spanish}»`
    });

    // Advance index or complete
    if (currentIdx < deck.length - 1) {
      setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
        setLastFeedback(null);
      }, 1000);
    } else {
      setTimeout(() => {
        setIsDone(true);
        // Calculate points (max 40)
        const correctCount = history.filter(h => h.isCorrect).length + (isCorrect ? 1 : 0);
        const pointsWon = Math.round((correctCount / deck.length) * 40);
        onGameComplete(pointsWon);
      }, 1200);
    }
  };

  const getBasketColor = (basket: string) => {
    switch(basket) {
      case 'el': return 'bg-blue-500 border-blue-600 hover:bg-blue-600 text-white';
      case 'la': return 'bg-rose-500 border-rose-600 hover:bg-rose-600 text-white';
      case 'los': return 'bg-indigo-600 border-indigo-700 hover:bg-indigo-700 text-white';
      case 'las': return 'bg-pink-500 border-pink-600 hover:bg-pink-600 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const correctAnswersCount = history.filter(h => h.isCorrect).length;

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
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">ԽԱՂ 5</span>
          <h2 className="text-lg font-bold font-display text-slate-800 font-display">Գոյականների Դասակարգում</h2>
        </div>
        <div className="text-sm font-semibold font-mono text-slate-500">
          {isDone ? 'Ավարտ' : `${currentIdx + 1}/${deck.length}`}
        </div>
      </div>

      {!isDone ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300" 
              style={{ width: `${((currentIdx + 1) / deck.length) * 100}%` }}
            ></div>
          </div>

          <div className="text-center text-sm text-slate-500 mb-2">
            Ընտրեք ճիշտ որոշյալ հոդը տրված գոյականի համար.
          </div>

          {/* Active Card with animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ rotate: -2, scale: 0.95, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-slate-50 border-2 border-slate-100 p-8 rounded-3xl text-center space-y-3 max-w-sm mx-auto shadow-xs relative"
            >
              <div className="absolute top-3 right-3 text-2xl">⚡</div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Իսպաներեն Բառ</span>
              <h3 className="text-3xl font-black font-display text-slate-800 tracking-wide">{currentNoun.spanish}</h3>
              <p className="text-sm text-slate-500 border-t border-dashed border-slate-200 pt-2 font-medium">
                Հայերեն՝ <strong className="text-slate-600">{currentNoun.armenian}</strong>
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Instant feedback notification */}
          <div className="h-10 flex items-center justify-center">
            {lastFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                  lastFeedback.isCorrect 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {lastFeedback.text}
              </motion.div>
            )}
          </div>

          {/* 4 Definitive Article Baskets */}
          <div className="space-y-3 max-w-md mx-auto">
            <span className="text-center block text-[10px] font-bold uppercase tracking-widest text-slate-400">Տեղադրեք զամբյուղներից մեկի մեջ`</span>
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {['el', 'la', 'los', 'las'].map((basketOption) => (
                <button
                  key={basketOption}
                  disabled={lastFeedback !== null}
                  onClick={() => handleBasketSelect(basketOption as any)}
                  className={`py-4 rounded-2xl font-mono font-extrabold text-xl shadow-xs transition-all border cursor-pointer hover:scale-[1.03] active:scale-[0.98] ${getBasketColor(basketOption)}`}
                >
                  <span className="block">{basketOption}</span>
                  <span className="text-[10px] uppercase font-sans font-normal opacity-75">
                    {basketOption === 'el' && 'Արական Եզակի'}
                    {basketOption === 'la' && 'Իգական Եզակի'}
                    {basketOption === 'los' && 'Արական Հոգնակի'}
                    {basketOption === 'las' && 'Իգական Հոգնակի'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="text-center py-4 space-y-3">
            <div className="inline-block p-4 bg-emerald-100 text-emerald-600 rounded-full">
              <Trophy size={48} className="animate-bounce" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold font-display text-slate-800">Դասակարգումը Կատարված է:</h3>
              <p className="text-slate-500 text-sm">
                Դուք ճիշտ տեղադրեցիք <strong className="text-slate-800">{correctAnswersCount}</strong> գոյական՝ <strong className="text-slate-800">{deck.length}</strong>-ից:
              </p>
            </div>
          </div>

          {/* Score breakdown table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs">
            <span className="font-bold text-slate-600 block mb-2 px-1">Ձեր դասակարգումների արդյունքները՝</span>
            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
              {history.map((h, index) => (
                <div key={index} className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {h.isCorrect ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-rose-500" />}
                    <span className="font-medium font-mono text-slate-700">{h.noun.spanish} ({h.noun.armenian})</span>
                  </div>
                  <div className="font-mono text-[11px]">
                    <span className="text-slate-400">զամբյուղ՝ </span>
                    <strong className={h.isCorrect ? 'text-emerald-600' : 'text-slate-400'}>{h.userBasket}</strong>
                    {!h.isCorrect && (
                      <>
                        <span className="text-slate-400"> (ճիշտը՝ </span>
                        <strong className="text-rose-600">{h.correctBasket}</strong>
                        <span className="text-slate-400">)</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 p-4 border border-emerald-100 rounded-2xl text-center">
            <span className="text-xs font-semibold text-emerald-800 block mb-1">Վաստակած մակարդակը</span>
            <span className="text-lg font-bold font-display text-emerald-950">
              {correctAnswersCount === deck.length ? 'Հոդերի Վարպետ 🎓🏆' : correctAnswersCount >= 7 ? 'Բարձր Գիտելիքներ 🌟' : 'Կարիք կա պարապելու 📚'}
            </span>
            <div className="text-xs text-white bg-emerald-600 mt-2 font-bold px-3 py-1 rounded-full inline-block">
              +{Math.round((correctAnswersCount / deck.length) * 40)} Միավոր!
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                const shuffled = [...NOUN_ITEMS].sort(() => Math.random() - 0.5).slice(0, 10);
                setDeck(shuffled);
                setCurrentIdx(0);
                setHistory([]);
                setIsDone(false);
                setLastFeedback(null);
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
    </div>
  );
}
