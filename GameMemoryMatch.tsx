import { useState, useEffect } from 'react';
import { DAYS_OF_WEEK } from './data';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onBack: () => void;
  onGameComplete: (score: number) => void;
}

interface MemoryCard {
  id: string; // unique ID for grid matching
  content: string; // "lunes" or "Երկուշաբթի"
  language: 'es' | 'am';
  matchId: string; // order/day id to match (lunes matches Երկուշաբթի if order is 0 or day ID is same)
  isFlipped: boolean;
  isMatched: boolean;
}

export default function GameMemoryMatch({ onBack, onGameComplete }: Props) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selected, setSelected] = useState<number[]>([]); // index of flipped cards (max 2)
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const initGame = () => {
    // Generate matches from DAYS_OF_WEEK
    const cardSet: MemoryCard[] = [];
    
    DAYS_OF_WEEK.forEach((day) => {
      // Spanish card
      cardSet.push({
        id: `es-${day.id}`,
        content: day.spanish,
        language: 'es',
        matchId: day.id,
        isFlipped: false,
        isMatched: false,
      });
      // Armenian card
      cardSet.push({
        id: `am-${day.id}`,
        content: day.armenian,
        language: 'am',
        matchId: day.id,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle cards
    const shuffled = cardSet.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelected([]);
    setMoves(0);
    setMatches(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    // Prevent clicking if already matched, already flipped, or if 2 cards are currently flipped
    if (cards[index].isMatched || cards[index].isFlipped || selected.length >= 2) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newSelected;
      const card1 = cards[firstIdx];
      const card2 = cards[secondIdx];

      // Check match: different language cards, but matching day id (matchId)
      if (card1.matchId === card2.matchId && card1.language !== card2.language) {
        // Correct Match!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setSelected([]);
          
          const newMatchesCount = matches + 1;
          setMatches(newMatchesCount);

          if (newMatchesCount === DAYS_OF_WEEK.length) {
            setIsCompleted(true);
            // Award score inversely proportional to moves. Best moves is 7. Under 15 moves gets max points, etc.
            const scoreCalculated = Math.max(15, Math.min(40, 45 - (moves - 7)));
            onGameComplete(scoreCalculated);
          }
        }, 600);
      } else {
        // Not a match! Flip back
        setTimeout(() => {
          const revertedCards = [...cards];
          revertedCards[firstIdx].isFlipped = false;
          revertedCards[secondIdx].isFlipped = false;
          setCards(revertedCards);
          setSelected([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-w-3xl mx-auto">
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
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">ԽԱՂ 4</span>
          <h2 className="text-lg font-bold font-display text-slate-800">Հիշողության Խաղ (Matching)</h2>
        </div>
        <button
          onClick={initGame}
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-all"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Խառնել</span>
        </button>
      </div>

      {/* Score and Stats */}
      <div className="flex justify-around items-center bg-indigo-50/30 border border-indigo-100/30 p-3 rounded-xl mb-6 text-sm">
        <div>
          <span className="text-slate-500">Քայլեր՝ </span>
          <strong className="text-indigo-900 font-mono text-base">{moves}</strong>
        </div>
        <div>
          <span className="text-slate-500">Համընկնումներ՝ </span>
          <strong className="text-indigo-900 font-mono text-base">{matches} / {DAYS_OF_WEEK.length}</strong>
        </div>
      </div>

      {/* Cards Grid */}
      {!isCompleted ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
          {cards.map((card, index) => {
            const isFlippedOrMatched = card.isFlipped || card.isMatched;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className="h-24 w-full perspective-1000 cursor-pointer"
              >
                <div
                  className={`relative w-full h-full text-center transition-all duration-500 transform-style-3d rounded-xl ${
                    isFlippedOrMatched ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front Side (Flipped State showing word) */}
                  <div
                    className={`absolute inset-0 backface-hidden w-full h-full rounded-xl flex flex-col items-center justify-center p-2 border ${
                      card.isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                        : card.language === 'es'
                        ? 'bg-amber-500 text-white border-amber-600 font-mono font-bold shadow-sm'
                        : 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-sm'
                    } rotate-y-180`}
                  >
                    <span className="text-xs opacity-75 font-sans font-normal block mb-1">
                      {card.isMatched ? '✓' : card.language === 'es' ? 'ESP' : 'ARM'}
                    </span>
                    <span className="text-xs sm:text-xs md:text-sm tracking-tight leading-4 select-none font-bold block break-all text-center">
                      {card.content}
                    </span>
                  </div>

                  {/* Back Side (Unflipped default showing card cover) */}
                  <div className="absolute inset-0 backface-hidden w-full h-full rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors hover:scale-103 shadow-xs">
                    <span className="text-xl font-extrabold text-slate-300 font-display select-none">🇪🇸</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6 space-y-6"
        >
          <div className="inline-block p-4 bg-indigo-100 text-indigo-600 rounded-full">
            <Trophy size={48} className="animate-bounce" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-extrabold font-display text-slate-800">Շաբաթվա օրերը յուրացված են:</h3>
            <p className="text-slate-500 text-sm">
              Դուք ավարտեցիք խաղը ընդամենը <strong className="text-slate-800">{moves}</strong> քայլով:
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl max-w-sm mx-auto border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Վաստակած մակարդակը</span>
            <span className="text-lg font-bold font-display text-indigo-700">
              {moves <= 12 ? 'Գերբնական հիշողություն 🧠⚡' : moves <= 18 ? 'Ակտիվ ուղեղ 💡' : 'Սկսնակ Իսպանախոս 📚'}
            </span>
            <div className="text-xs text-indigo-600 mt-2 font-bold px-3 py-1 bg-indigo-50 rounded-full inline-block">
              +{Math.max(15, Math.min(40, 45 - (moves - 7)))} Միավոր!
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={initGame}
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

      {/* Embedded CSS for 3D card flips */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
