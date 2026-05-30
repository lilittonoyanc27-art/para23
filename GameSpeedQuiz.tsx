import { useState, useEffect, useRef } from 'react';
import { DAYS_OF_WEEK, NOUN_ITEMS } from './data';
import { ArrowLeft, Check, X, Trophy, Timer, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onBack: () => void;
  onGameComplete: (score: number) => void;
}

interface SpeedQuestion {
  statementEsp: string;
  statementArm: string;
  isTrue: boolean;
  explanation: string;
}

export default function GameSpeedQuiz({ onBack, onGameComplete }: Props) {
  const [questions, setQuestions] = useState<SpeedQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds total
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'fever' | 'finished'>('intro');
  const timerRef = useRef<any>(null);

  // Generate a random pool of SpeedQuestions
  const generateQuestions = () => {
    const pool: SpeedQuestion[] = [];

    // Helper: random element from array
    function randItem<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    // 1. Days of week translations (True matches and False matches)
    DAYS_OF_WEEK.forEach(day => {
      // True match
      pool.push({
        statementEsp: `${day.spanish}`,
        statementArm: `նշանակում է ${day.armenian}`,
        isTrue: true,
        explanation: `«${day.spanish}»-ը իսպաներենով ${day.armenian} է:`
      });

      // False match
      const wrongDay = randItem(DAYS_OF_WEEK.filter(d => d.id !== day.id));
      pool.push({
        statementEsp: `${day.spanish}`,
        statementArm: `նշանակում է ${wrongDay.armenian}`,
        isTrue: false,
        explanation: `Ոչ! «${day.spanish}»-ը ${day.armenian} է, ոչ թեյ ${wrongDay.armenian}:`
      });
    });

    // 2. Articles grammatical truths
    const testNouns = [...NOUN_ITEMS];
    testNouns.forEach(noun => {
      const correctArt = noun.gender === 'M' ? (noun.number === 'S' ? 'el' : 'los') : (noun.number === 'S' ? 'la' : 'las');
      const wrongArt = noun.gender === 'M' ? (noun.number === 'S' ? 'la' : 'las') : (noun.number === 'S' ? 'el' : 'los');

      // True statement
      pool.push({
        statementEsp: `${correctArt} ${noun.spanish}`,
        statementArm: `ճիշտ որոշյալ հոդակապումն է:`,
        isTrue: true,
        explanation: `Այո՛: «${noun.spanish}»-ի հետ որոշյալ հոդն է «${correctArt}»:`
      });

      // False statement
      pool.push({
        statementEsp: `${wrongArt} ${noun.spanish}`,
        statementArm: `ճիշտ որոշյալ հոդակապումն է:`,
        isTrue: false,
        explanation: `Ո՛չ: «${noun.spanish}»-ի հետ պետք է լինի «${correctArt}», այլ ոչ թե «${wrongArt}»:`
      });
    });

    // 3. More conceptual assertions
    pool.push({
      statementEsp: 'Lunes, Martes, Jueves',
      statementArm: 'շաբաթվա բոլոր օրերը իսպաներենում գրվում են մեծատառով:',
      isTrue: false,
      explanation: 'Uխալ է։ Իսպաներենում օրերը միշտ գրվում են փոքրատառով` lunes, martes, jueves:'
    });
    pool.push({
      statementEsp: 'Un, Una, Unos, Unas',
      statementArm: 'հանդիսանում են իսպաներենի անորոշ (indefinite) հոդերը:',
      isTrue: true,
      explanation: 'Ճիշտ է։ Սրանք հենց անորոշ հոդերն են:'
    });
    pool.push({
      statementEsp: 'El, La, Los, Las',
      statementArm: 'նախատեսված են իսպաներենի որոշյալ (definite) հոդերի համար:',
      isTrue: true,
      explanation: 'Ճիշտ է։ Սրանք հոդերի որոշյալ տեսակներն են:'
    });
    pool.push({
      statementEsp: 'La mano',
      statementArm: 'սեռով արական գոյական է, քանի որ վերջանում է o-ով:',
      isTrue: false,
      explanation: 'Սխալ է. «la mano»-ն (ձեռքը) բացառություն է՝ այն իգական սեռի է, թեև վերջանում է o-ով:'
    });
    pool.push({
      statementEsp: 'El lunes',
      statementArm: 'նշանակում է «Երկուշաբթիները»:',
      isTrue: false,
      explanation: 'Սխալ է: «el lunes» նշանակում է «Երկուշաբթին (եզակի)», իսկ հոգնակին կլինի «los lunes»:'
    });

    // Shuffle pool
    return pool.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    const qList = generateQuestions();
    setQuestions(qList);
    setCurrentIdx(0);
    setScore(0);
    setTimeLeft(45);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleAnswer = (answer: boolean) => {
    if (gameState !== 'playing') return;

    const currentQ = questions[currentIdx];
    
    if (currentQ.isTrue === answer) {
      setScore(prev => prev + 10); // 10 points per speed hit
    } else {
      // Small penalty, subtract 3 seconds
      setTimeLeft(prev => Math.max(0, prev - 3));
    }

    // Advance
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      // Loop or generate more
      const nextBatch = generateQuestions();
      setQuestions(prev => [...prev, ...nextBatch]);
      setCurrentIdx(prev => prev + 1);
    }
  };

  const finishGame = () => {
    setGameState('finished');
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Scale speed points to app standard game weight (max 50 points based on speed score)
    const pointsWon = Math.min(50, Math.round(score / 5));
    onGameComplete(pointsWon);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-w-xl mx-auto">
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
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">ԽԱՂ 6</span>
          <h2 className="text-lg font-bold font-display text-slate-800 font-display">Իսպաներենի Արագ Վիկտորինա</h2>
        </div>
        <div className="w-8"></div>
      </div>

      {gameState === 'intro' && (
        <div className="text-center py-6 space-y-6">
          <div className="inline-block p-4.5 bg-rose-50 text-rose-500 rounded-full">
            <Timer size={44} className="animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800 font-display">Պատրա՞ստ եք Արագությանը:</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Դուք ունեք <strong>45 վայրկյան</strong>: Էկրանին կհայտնվեն պնդումներ իսպաներեն օրերի և հոդերի վերաբերյալ: Արագ ընտրեք՝ դրանք <strong>Ճիշտ են</strong>, թե <strong>Սխալ</strong>:
            </p>
            <p className="text-xs text-rose-600 font-medium">⚠️ Յուրաքանչյուր սխալ պատասխանը նվազեցնում է ժամանակը 3 վայրկյանով!</p>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all hover:scale-102"
          >
            Սկսել Խաղը (Start ⚡)
          </button>
        </div>
      )}

      {gameState === 'playing' && questions[currentIdx] && (
        <div className="space-y-6">
          {/* Progress Indicators / Timer */}
          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Timer size={18} className={`${timeLeft <= 10 ? 'text-rose-600 animate-bounce' : 'text-slate-500'}`} />
              <span className={`font-mono font-bold text-base ${timeLeft <= 10 ? 'text-rose-600' : 'text-slate-700'}`}>
                {timeLeft}s
              </span>
            </div>
            
            <div className="text-sm font-semibold text-slate-500">
              Միավորներ՝ <strong className="text-rose-600 font-mono text-base">{score}</strong>
            </div>
          </div>

          {/* Time bar indicator */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-rose-500' : 'bg-rose-600'}`} 
              style={{ width: `${(timeLeft / 45) * 100}%` }}
            ></div>
          </div>

          {/* Statement Board */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center space-y-4">
            <div className="inline-block px-3 py-1 bg-white border border-slate-100 rounded-full shadow-2xs">
              <span className="text-3xl font-extrabold font-mono text-amber-500">{questions[currentIdx].statementEsp}</span>
            </div>
            
            <p className="text-slate-700 font-bold text-lg leading-relaxed px-2 font-sans">
              {questions[currentIdx].statementArm}
            </p>
          </div>

          {/* True / False Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(false)}
              className="py-4 px-6 bg-red-500 hover:bg-red-600 active:scale-97 text-white font-black rounded-2xl flex items-center justify-center gap-2 text-base transition-all shadow-sm cursor-pointer"
            >
              <X size={20} />
              ՍԽԱԼ Է
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="py-4 px-6 bg-emerald-500 hover:bg-emerald-600 active:scale-97 text-white font-black rounded-2xl flex items-center justify-center gap-2 text-base transition-all shadow-sm cursor-pointer"
            >
              <Check size={20} />
              ՃԻՇՏ Է
            </button>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6 space-y-6"
        >
          <div className="inline-block p-4.5 bg-yellow-100 text-amber-600 rounded-full">
            <Trophy size={48} className="animate-bounce" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-extrabold font-display text-slate-800">Ժամանակն սպառվեց:</h3>
            <p className="text-slate-500 text-sm">
              Դուք կուտակեցիք <strong className="text-slate-800">{score}</strong> ռեակտիվ միավոր:
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl max-w-sm mx-auto border border-slate-100">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">Վաստակած մակարդակը</span>
            <div className="flex justify-center items-center gap-1 text-lg font-bold font-display text-amber-700 animate-pulse">
              <Award size={18} />
              <span>{score >= 120 ? 'Արագընթաց Մետեոր ☄️' : score >= 60 ? 'Արագ Մտածող ⚡' : 'Փորձառու 📚'}</span>
            </div>
            
            <div className="text-xs text-rose-600 mt-2 font-bold px-3 py-1 bg-rose-50 rounded-full inline-block">
              +{Math.min(50, Math.round(score / 5))} Միավոր Գլոբալ Ռեյտինգում!
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={startGame}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
            >
              Փորձել նորից
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
