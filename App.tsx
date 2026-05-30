import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Layers, 
  HelpCircle, 
  Trophy, 
  BookOpen, 
  RefreshCw, 
  ChevronRight, 
  CheckCircle,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Theory & Games Subcomponents
import TheorySection from './TheorySection';
import GameDaysOrder from './GameDaysOrder';
import GameArticleQuiz from './GameArticleQuiz';
import GameSentenceFill from './GameSentenceFill';
import GameMemoryMatch from './GameMemoryMatch';
import GameNounBasketSort from './GameNounBasketSort';
import GameSpeedQuiz from './GameSpeedQuiz';
import GameTimeAndMeeting from './GameTimeAndMeeting';
import GameClockQuiz from './GameClockQuiz';

export default function App() {
  const [activeGame, setActiveGame] = useState<number | null>(null);
  const [globalScore, setGlobalScore] = useState<number>(0);
  const [completedGames, setCompletedGames] = useState<number[]>([]);
  const [showTheory, setShowTheory] = useState<boolean>(false);
  const [isResetConfirming, setIsResetConfirming] = useState<boolean>(false);

  // Load stats from localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem('es_learn_score');
    const savedCompleted = localStorage.getItem('es_learn_completed');
    if (savedScore) {
      setGlobalScore(parseInt(savedScore, 10));
    }
    if (savedCompleted) {
      try {
        setCompletedGames(JSON.parse(savedCompleted));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleGameComplete = (scoreEarned: number) => {
    if (activeGame === null) return;
    
    // Update score
    const newScore = globalScore + scoreEarned;
    setGlobalScore(newScore);
    localStorage.setItem('es_learn_score', newScore.toString());

    // Mark as completed
    if (!completedGames.includes(activeGame)) {
      const newCompleted = [...completedGames, activeGame];
      setCompletedGames(newCompleted);
      localStorage.setItem('es_learn_completed', JSON.stringify(newCompleted));
    }
  };

  const resetStats = () => {
    setIsResetConfirming(true);
  };

  const confirmReset = () => {
    setGlobalScore(0);
    setCompletedGames([]);
    setActiveGame(null);
    localStorage.removeItem('es_learn_score');
    localStorage.removeItem('es_learn_completed');
    setIsResetConfirming(false);
  };

  const gamesList = [
    {
      id: 1,
      title: 'Շաբաթվա օրերի հերթականություն',
      desc: 'Դասավորեք օրերը սկսած lunes-ից (Երկուշաբթի):',
      badge: 'Օրեր',
      color: 'border-l-indigo-600 hover:bg-indigo-50/40',
      tagColor: 'bg-indigo-100 text-indigo-800',
      icon: <Calendar className="text-indigo-600" size={20} />,
      points: '+30 XP'
    },
    {
      id: 2,
      title: 'Հոդերի Ընտրություն',
      desc: 'Որոշեք ճիշտ որոշյալ կամ անորոշ հոդը տարբեր գոյականների համար:',
      badge: 'Հոդեր',
      color: 'border-l-indigo-600 hover:bg-indigo-50/40',
      tagColor: 'bg-yellow-100 text-yellow-850',
      icon: <Layers className="text-indigo-600" size={20} />,
      points: 'մինչև +40 XP'
    },
    {
      id: 3,
      title: 'Նախադասությունների Լրացում',
      desc: 'Լրացրեք նախադասություններում բաց թողնված օրերն ու քերականական հոդերը:',
      badge: 'Խառը թեմաներ',
      color: 'border-l-indigo-600 hover:bg-indigo-50/40',
      tagColor: 'bg-teal-100 text-teal-800',
      icon: <HelpCircle className="text-indigo-600" size={20} />,
      points: 'մինչև +40 XP'
    },
    {
      id: 4,
      title: 'Հիշողության Խաղ (Flashcards)',
      desc: 'Գտեք համապատասխան օրերի զույգերը իսպաներենով և հայերենով:',
      badge: 'Օրեր',
      color: 'border-l-indigo-600 hover:bg-indigo-50/40',
      tagColor: 'bg-rose-100 text-rose-800',
      icon: <Sparkles className="text-indigo-600" size={20} />,
      points: 'մինչև +40 XP'
    },
    {
      id: 5,
      title: 'Գոյականների Դասակարգում',
      desc: 'Տեղադրեք գոյականները համապատասխան el, la, los, las զամբյուղների մեջ:',
      badge: 'Հոդեր',
      color: 'border-l-indigo-600 hover:bg-indigo-50/40',
      tagColor: 'bg-indigo-150 text-indigo-905',
      icon: <Layers className="text-indigo-600" size={20} />,
      points: 'մինչև +40 XP'
    },
    {
      id: 6,
      title: 'Իսպաներենի Արագ Վիկտորինա',
      desc: 'Պատասխանեք Ճիշտ/Սխալ հարցերին սահմանափակ ժամանակահատվածում:',
      badge: 'Արագություն ⚡',
      color: 'border-l-indigo-600 hover:bg-indigo-50/40',
      tagColor: 'bg-purple-100 text-purple-800',
      icon: <Trophy className="text-indigo-600" size={20} />,
      points: 'մինչև +50 XP'
    },
    {
      id: 7,
      title: 'Ժամ և Հանդիպման Պայմանավորվածություն',
      desc: 'Պատասխանեք ժամային և շաբաթվա օրերի վերաբերյալ հարցերին՝ պայմանավորվելով հանդիպման մասին:',
      badge: 'Ժամ և Ժամադրություն 🕒',
      color: 'border-l-indigo-600 hover:bg-indigo-50/40',
      tagColor: 'bg-amber-100 text-amber-900 border border-amber-200',
      icon: <Clock className="text-indigo-600" size={20} />,
      points: 'մինչև +40 XP'
    },
    {
      id: 8,
      title: 'Կողմնորոշվիր Ժամացույցով (20 Հարց)',
      desc: 'Վիզուալ հիանալի ժամացույցի միջոցով որոշեք և սովորեք, թե ինչպես է ասվում յուրաքանչյուր ժամը իսպաներենով:',
      badge: 'Վիզուալ Ժամացույց 🕒⚡',
      color: 'border-l-indigo-600 hover:bg-indigo-50/40',
      tagColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      icon: <Sparkles className="text-indigo-600" size={20} />,
      points: 'մինչև +60 XP'
    }
  ];

  return (
    <div className="min-h-screen bg-indigo-50 text-indigo-950 font-sans p-3 sm:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative ambient background radial blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-yellow-300 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-150px] left-[-150px] w-[500px] h-[500px] bg-indigo-300 rounded-full opacity-25 blur-3xl pointer-events-none"></div>

      {/* Flag border header effect */}
      <div className="absolute top-0 left-0 right-0 h-2.5 flex pointer-events-none z-50">
        <div className="bg-[#C60B1E] h-full flex-1"></div>
        <div className="bg-[#F1BF00] h-full flex-1"></div>
        <div className="bg-[#C60B1E] h-full flex-1"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10 my-4 sm:my-6 flex flex-col gap-6">
        
        {/* RE-ARCHITECTED TAB-LESS UNIFIED HEADER */}
        <header className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl p-5 sm:p-6 border-b-4 border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-5 shrink-0">
          {/* Logo Brand Indicator */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F1BF00] rounded-2xl flex items-center justify-center text-[#C60B1E] font-black text-2xl shadow-lg shadow-yellow-250 border-2 border-white select-none shrink-0 animate-pulse">
              ES
            </div>
            <div>
              <h1 className="text-xl font-black text-indigo-950 tracking-tight leading-none flex items-center gap-2">
                HOLA! <span className="text-[10px] sm:text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Լսարան</span>
              </h1>
              <p className="text-xs font-bold text-indigo-400 mt-1 uppercase tracking-wider">Իսպաներենի ինտերակտիվ ուսացման հարթակ</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full md:w-auto">
            {/* Daily Streak */}
            <div className="flex items-center gap-2 bg-yellow-50 text-indigo-900 px-4 py-2 rounded-full border border-yellow-205 text-[11px] font-black select-none">
              <span className="text-sm">🔥</span>
              <span>7 ՕՐ ԱՆԸՆԴՀԱՏ</span>
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 select-none">
              <span className="text-sm">💎</span>
              <span className="font-mono font-black text-[11px]">{globalScore} XP</span>
            </div>

            {/* Progress Badge */}
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full border border-indigo-100 select-none">
              <span className="text-sm">🏆</span>
              <span className="font-mono font-black text-[11px]">{completedGames.length}/8</span>
            </div>

            {/* Reset Control */}
            <button
              onClick={resetStats}
              className="flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full shadow-xs border border-rose-100 hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer text-[10px] font-black"
              title="Զրոյացնել առաջընթացը"
            >
              <RotateCcw size={13} />
              <span>ԶՐՈՅԱՑՆԵԼ</span>
            </button>
          </div>
        </header>

        {/* Dynamic Canvas Area */}
        <section className="bg-transparent relative">
          <AnimatePresence mode="wait">
            {activeGame === null ? (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. Collapsible Grammar Theory Handbook */}
                <div className="bg-white rounded-3xl border border-indigo-100 shadow-md">
                  <button
                    onClick={() => setShowTheory(!showTheory)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left outline-none cursor-pointer focus:ring-2 focus:ring-indigo-300 rounded-3xl group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-indigo-950 group-hover:text-indigo-700 transition-colors">
                          📖 Իսպաներենի Ուսումնական Ուղեցույց (Տեսություն)
                        </h3>
                        <p className="text-xs text-indigo-450 mt-0.5">Բացեք՝ շաբաթվա օրերի և քերականական հոդերի կանոններին ծանոթանալու համար</p>
                      </div>
                    </div>
                    <div>
                      {showTheory ? <ChevronUp size={20} className="text-indigo-400" /> : <ChevronDown size={20} className="text-indigo-400" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {showTheory && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-indigo-50"
                      >
                        <div className="p-4 sm:p-6 bg-slate-50/50 rounded-b-3xl">
                          <TheorySection />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Games Grid Bento Box */}
                <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-indigo-50 pb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-indigo-950 tracking-tight">
                        🎮 Ինտերակտիվ Ուսուցողական Խաղեր
                      </h3>
                      <p className="text-xs text-indigo-400 font-semibold mt-0.5">Ընտրեք 8 խաղերից ցանկացածը՝ միավորներ վաստակելու համար</p>
                    </div>
                    <span className="text-[11px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-black uppercase tracking-wider">
                      ներառյալ նոր վիզուալ ժամացույցը
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {gamesList.map((game) => {
                      const isCompleted = completedGames.includes(game.id);

                      return (
                        <div
                          id={`game-selection-card-${game.id}`}
                          key={game.id}
                          onClick={() => setActiveGame(game.id)}
                          className={`bg-white rounded-2xl p-5 border-2 border-indigo-50 hover:border-indigo-350 hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between group relative shadow-xs hover:shadow-lg`}
                        >
                          {/* Success completion badge */}
                          {isCompleted && (
                            <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                              <CheckCircle size={14} className="stroke-[3px]" />
                            </div>
                          )}

                          <div className="space-y-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${game.tagColor}`}>
                              {game.badge}
                            </span>

                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                {game.icon}
                              </div>
                              <h4 className="font-extrabold text-indigo-950 group-hover:text-indigo-600 transition-colors leading-snug text-sm sm:text-base">
                                {game.title}
                              </h4>
                            </div>

                            <p className="text-xs text-indigo-400 leading-relaxed font-semibold">
                              {game.desc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-indigo-50 mt-5 pt-3">
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                              {game.points}
                            </span>
                            <div className="flex items-center text-xs font-black text-indigo-650 group-hover:text-indigo-950 transition-colors">
                              ԽԱՂԱԼ
                              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5px]" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="active-game-container"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full bg-transparent"
              >
                {activeGame === 1 && (
                  <GameDaysOrder
                    onBack={() => setActiveGame(null)}
                    onGameComplete={handleGameComplete}
                  />
                )}
                {activeGame === 2 && (
                  <GameArticleQuiz
                    onBack={() => setActiveGame(null)}
                    onGameComplete={handleGameComplete}
                  />
                )}
                {activeGame === 3 && (
                  <GameSentenceFill
                    onBack={() => setActiveGame(null)}
                    onGameComplete={handleGameComplete}
                  />
                )}
                {activeGame === 4 && (
                  <GameMemoryMatch
                    onBack={() => setActiveGame(null)}
                    onGameComplete={handleGameComplete}
                  />
                )}
                {activeGame === 5 && (
                  <GameNounBasketSort
                    onBack={() => setActiveGame(null)}
                    onGameComplete={handleGameComplete}
                  />
                )}
                {activeGame === 6 && (
                  <GameSpeedQuiz
                    onBack={() => setActiveGame(null)}
                    onGameComplete={handleGameComplete}
                  />
                )}
                {activeGame === 7 && (
                  <GameTimeAndMeeting
                    onBack={() => setActiveGame(null)}
                    onGameComplete={handleGameComplete}
                  />
                )}
                {activeGame === 8 && (
                  <GameClockQuiz
                    onBack={() => setActiveGame(null)}
                    onGameComplete={handleGameComplete}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Unified bottom Footer card */}
        <footer className="text-center text-[11px] text-indigo-400 bg-white shadow-md rounded-[1.5rem] py-4 px-6 relative z-10 border-t border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Իսպաներենի և հայերենի զուգադրմամբ ինտերակտիվ վարժարան (Օրեր, Հոդեր և Ժամանակ):</span>
          <span className="font-semibold text-indigo-450 font-mono">© 2026 ES Armenian Spanish Interactive LMS</span>
        </footer>
      </div>

      {/* Bespoke safe React confirmation modal overlay for resetting stats (works inside iframe!) */}
      <AnimatePresence>
        {isResetConfirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] max-w-sm w-full p-6 sm:p-8 shadow-2xl border-4 border-indigo-200 text-center space-y-5"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm">
                ⚠️
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-indigo-950 font-display">Զրոյացնե՞լ առաջընթացը</h3>
                <p className="text-xs text-indigo-400 font-bold leading-relaxed">
                  Ցանկանու՞մ եք զրոյացնել ձեր հավաքած բոլոր միավորները (XP) և անցած խաղերի պատմությունը: Այս գործողությունը անդառնալի է:
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirming(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer outline-none"
                >
                  Չեղարկել
                </button>
                <button
                  type="button"
                  onClick={confirmReset}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md shadow-rose-100 hover:scale-105 active:scale-95 transition-all cursor-pointer outline-none"
                >
                  Այո, Ջնջել
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
