import { useState } from 'react';
import { BookOpen, Calendar, HelpCircle, Layers, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function TheorySection() {
  const [activeTab, setActiveTab] = useState<'days' | 'articles' | 'hints'>('days');

  return (
    <div id="theory-section" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-indigo-50 max-w-4xl mx-auto my-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-yellow-100 text-yellow-700 rounded-2xl">
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="text-xl font-extrabold font-display tracking-tight text-indigo-950">Իսպաներենի Ուսումնական Ուղեցույց (Տեսություն)</h2>
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Ուսումնասիրեք կանոնները խաղն սկսելուց առաջ</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-indigo-50 pb-px mb-6 overflow-x-auto">
        <button
          id="tab-days"
          onClick={() => setActiveTab('days')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-black border-b-4 transition-all shrink-0 cursor-pointer ${
            activeTab === 'days'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-indigo-400 hover:text-indigo-900'
          }`}
        >
          <Calendar size={16} />
          Շաբաթվա Օրեր
        </button>
        <button
          id="tab-articles"
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-black border-b-4 transition-all shrink-0 cursor-pointer ${
            activeTab === 'articles'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-indigo-400 hover:text-indigo-900'
          }`}
        >
          <Layers size={16} />
          Հոդեր (Artículos)
        </button>
        <button
          id="tab-hints"
          onClick={() => setActiveTab('hints')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-black border-b-4 transition-all shrink-0 cursor-pointer ${
            activeTab === 'hints'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-indigo-400 hover:text-indigo-900'
          }`}
        >
          <HelpCircle size={16} />
          Հուշումներ և Բացառություններ
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[220px]">
        {activeTab === 'days' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-105">
              <h3 className="font-extrabold text-indigo-950 mb-2 font-display text-base uppercase tracking-wide">Կարևոր կանոններ`</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-indigo-900/80">
                <li>Իսպաներենում շաբաթվա օրերը գրվում են <strong className="text-rose-600 font-extrabold">փոքրատառով</strong> (օրինակ՝ <code className="bg-indigo-50 px-1.5 py-0.5 rounded font-mono font-bold text-indigo-900">lunes</code>, այլ ոչ թե <code className="bg-indigo-50 px-1.5 py-0.5 rounded font-mono">Lunes</code>):</li>
                <li>Շաբաթվա բոլոր օրերը պատկանում են <strong className="text-indigo-650 font-extrabold">արական սեռին</strong>: Հետևաբար, նրանց հետ օգտագործվում է արական որոշյալ հոդը՝ <code className="bg-indigo-50 px-1.5 py-0.5 rounded font-mono text-indigo-800 font-black">el</code> (օր.` <strong className="font-mono font-extrabold">el lunes</strong> - երկուշաբթի օրը):</li>
                <li>Հոգնակի թվով օգտագործելու համար փոխում ենք միայն հոդը՝ <code className="bg-indigo-50 px-1.5 py-0.5 rounded font-mono text-indigo-800 font-black">los</code> (օր.` <strong className="font-mono font-extrabold">los lunes</strong> - երկուշաբթի օրերին): Բուն բառերը (բացի շաբաթ և կիրակի օրերից) hոգնակիում չեն փոխվում, քանի որ արդեն վերջանում են <strong className="font-mono">-s</strong>-ով:</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
              {[
                { es: 'lunes', am: 'Երկուշաբթի', color: 'bg-rose-50 text-rose-800 border-rose-100 shadow-xs' },
                { es: 'martes', am: 'Երեքշաբթի', color: 'bg-yellow-50 text-yellow-800 border-yellow-105 shadow-xs' },
                { es: 'miércoles', am: 'Չորեքշաբթի', color: 'bg-indigo-50 text-indigo-800 border-indigo-100 shadow-xs' },
                { es: 'jueves', am: 'Հինգշաբթի', color: 'bg-emerald-50 text-emerald-800 border-emerald-100 shadow-xs' },
                { es: 'viernes', am: 'Ուրբաթ', color: 'bg-teal-50 text-teal-800 border-teal-100 shadow-xs' },
                { es: 'sábado', am: 'Շաբաթ', color: 'bg-purple-50 text-purple-800 border-purple-100 shadow-xs font-semibold' },
                { es: 'domingo', am: 'Կիրակի', color: 'bg-pink-50 text-pink-800 border-pink-100 shadow-xs font-bold' },
              ].map((day, dIdx) => (
                <div key={day.es} className={`p-3 rounded-2xl border text-center transition-transform hover:scale-105 duration-200 ${day.color}`}>
                  <span className="text-[10px] text-indigo-400 font-extrabold block">ՕՐ {dIdx + 1}</span>
                  <span className="font-black block text-sm font-mono mt-0.5">{day.es}</span>
                  <span className="text-xs mt-1 block font-bold">{day.am}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'articles' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Definite Articles */}
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-extrabold text-indigo-950 font-display">Որոշյալ հոդեր (Artículos Definidos)</span>
                </div>
                <p className="text-xs text-indigo-900/70 mb-4 leading-relaxed font-medium">
                  Օգտագործվում են, երբ խոսքը հատուկ կամ արդեն հայտնի առարկայի/անձի մասին է (հայերենում համապատասխանում է <strong>-ը / -ն</strong> հոդերին):
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-indigo-50 text-center shadow-xs">
                    <span className="text-[10px] text-indigo-400 block font-extrabold uppercase">Արական Եզակի</span>
                    <strong className="text-xl text-indigo-650 font-mono font-black">el</strong>
                    <span className="text-[11px] text-indigo-800 block mt-0.5">el libro (գիրքը)</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-indigo-50 text-center shadow-xs">
                    <span className="text-[10px] text-indigo-400 block font-extrabold uppercase">Իգական Եզակի</span>
                    <strong className="text-xl text-indigo-650 font-mono font-black">la</strong>
                    <span className="text-[11px] text-indigo-800 block mt-0.5">la casa (տունը)</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-indigo-50 text-center shadow-xs">
                    <span className="text-[10px] text-indigo-400 block font-extrabold uppercase">Արական Հոգնակի</span>
                    <strong className="text-xl text-indigo-650 font-mono font-black">los</strong>
                    <span className="text-[11px] text-indigo-800 block mt-0.5">los libros (գրքերը)</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-indigo-50 text-center shadow-xs">
                    <span className="text-[10px] text-indigo-400 block font-extrabold uppercase">Իգական Հոգնակի</span>
                    <strong className="text-xl text-indigo-650 font-mono font-black">las</strong>
                    <span className="text-[11px] text-indigo-800 block mt-0.5">las casas (տները)</span>
                  </div>
                </div>
              </div>

              {/* Indefinite Articles */}
              <div className="bg-yellow-50/50 p-5 rounded-2xl border border-yellow-105">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-extrabold text-indigo-950 font-display">Անորոշ հոդեր (Artículos Indefinidos)</span>
                </div>
                <p className="text-xs text-indigo-900/70 mb-4 leading-relaxed font-medium">
                  Օգտագործվում են, երբ խոսքը անորոշ, անհայտ առարկայի/անձի մասին է (հայերենում համապատասխանում է <strong>«մի»</strong> բառին կամ առանց հոդի օգտագործմանը):
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-yellow-50 text-center shadow-xs">
                    <span className="text-[10px] text-indigo-400 block font-extrabold uppercase">Արական Եզակի</span>
                    <strong className="text-xl text-yellow-700 font-mono font-black">un</strong>
                    <span className="text-[11px] text-indigo-800 block mt-0.5">un libro (մի գիրք)</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-yellow-50 text-center shadow-xs">
                    <span className="text-[10px] text-indigo-400 block font-extrabold uppercase">Իգական Եզակի</span>
                    <strong className="text-xl text-yellow-700 font-mono font-black">una</strong>
                    <span className="text-[11px] text-indigo-800 block mt-0.5">una casa (մի տուն)</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-yellow-50 text-center shadow-xs">
                    <span className="text-[10px] text-indigo-400 block font-extrabold uppercase">Արական Հոգնակի</span>
                    <strong className="text-xl text-yellow-700 font-mono font-black">unos</strong>
                    <span className="text-[11px] text-indigo-800 block mt-0.5">unos libros (մի քանի...)</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-yellow-50 text-center shadow-xs">
                    <span className="text-[10px] text-indigo-400 block font-extrabold uppercase">Իգական Հոգնակի</span>
                    <strong className="text-xl text-yellow-700 font-mono font-black">unas</strong>
                    <span className="text-[11px] text-indigo-800 block mt-0.5">unas casas (մի քանի...)</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'hints' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                <h4 className="font-extrabold text-emerald-900 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  Ինչպե՞ս գուշակել սեռը (Gender Rules)
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-indigo-950 font-medium">
                  <li><strong>Արական</strong> են <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-100 font-mono font-black text-emerald-800">-o</code>-ով վերջացող բառերը (perro, gato, libro):</li>
                  <li><strong>Իգական</strong> են <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-100 font-mono font-black text-emerald-800">-a</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-100 font-mono font-black text-emerald-800">-ción</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-100 font-mono font-black text-emerald-800">-dad</code>-ով վերջացողները (casa, manzana, canción, ciudad):</li>
                  <li>Հոգնակի թիվը կազմվում է <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-100 font-mono font-bold text-emerald-800">-s</code> կամ <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-100 font-mono font-bold text-emerald-800">-es</code> ավելացնելով եթե վերջանում է բաղաձայնով (flor → flores):</li>
                </ul>
              </div>

              <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100">
                <h4 className="font-bold text-rose-900 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-rose-600" />
                  Կարևոր բացառություններ (Exceptions)
                </h4>
                <p className="text-xs text-rose-950 leading-relaxed font-semibold mb-2">
                  Կան բառեր, որոնք խախտում են վերևում նշված սովորական կանոնները.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-rose-900/90 font-medium">
                  <li><strong className="font-mono text-rose-700">la mano</strong> (ձեռքը) - իգական է, թեև վերջանում է «o»-ով:</li>
                  <li><strong className="font-mono text-rose-700">el día</strong> (օրը) - արական է, թեև վերջանում է «a»-ով:</li>
                  <li><strong className="font-mono text-rose-700">el agua</strong> (ջուրը) - եզակի թվով օգտագործվում է <strong className="font-mono">el</strong>-ով՝ արտասանության հեշտության համար, բայց հոգնակիում՝ <strong className="font-mono">las aguas</strong>:</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
