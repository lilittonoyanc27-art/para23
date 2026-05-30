import { DayOfWeek, NounItem, QuizQuestion, SentenceQuestion } from './types';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  { id: '1', spanish: 'lunes', armenian: 'Երկուշաբթի', order: 0 },
  { id: '2', spanish: 'martes', armenian: 'Երեքշաբթի', order: 1 },
  { id: '3', spanish: 'miércoles', armenian: 'Չորեքշաբթի', order: 2 },
  { id: '4', spanish: 'jueves', armenian: 'Հինգշաբթի', order: 3 },
  { id: '5', spanish: 'viernes', armenian: 'Ուրբաթ', order: 4 },
  { id: '6', spanish: 'sábado', armenian: 'Շաբաթ', order: 5 },
  { id: '7', spanish: 'domingo', armenian: 'Կիրակի', order: 6 },
];

export const NOUN_ITEMS: NounItem[] = [
  // Masculine Singular
  { spanish: 'perro', armenian: 'շուն', gender: 'M', number: 'S', definition: 'perro (շուն)' },
  { spanish: 'libro', armenian: 'գիրք', gender: 'M', number: 'S', definition: 'libro (գիրք)' },
  { spanish: 'gato', armenian: 'կատու', gender: 'M', number: 'S', definition: 'gato (կատու)' },
  { spanish: 'sol', armenian: 'արև', gender: 'M', number: 'S', definition: 'sol (արև)' },
  { spanish: 'cuaderno', armenian: 'տետր', gender: 'M', number: 'S', definition: 'cuaderno (տետր)' },
  { spanish: 'bolígrafo', armenian: 'գրիչ', gender: 'M', number: 'S', definition: 'bolígrafo (գրիչ)' },
  
  // Feminine Singular
  { spanish: 'casa', armenian: 'տուն', gender: 'F', number: 'S', definition: 'casa (տուն)' },
  { spanish: 'mesa', armenian: 'սեղան', gender: 'F', number: 'S', definition: 'mesa (սեղան)' },
  { spanish: 'manzana', armenian: 'խնձոր', gender: 'F', number: 'S', definition: 'manzana (խնձոր)' },
  { spanish: 'flor', armenian: 'ծաղիկ', gender: 'F', number: 'S', definition: 'flor (ծաղիկ)' },
  { spanish: 'ventana', armenian: 'պատուհան', gender: 'F', number: 'S', definition: 'ventana (պատուհան)' },
  { spanish: 'manos', armenian: 'ձեռքեր', gender: 'F', number: 'P', definition: 'mano (ձեռք) - *Բացառություն է. վերջանում է o-ով, բայց իգական է' }, // Exception!
  
  // Masculine Plural
  { spanish: 'perros', armenian: 'շներ', gender: 'M', number: 'P', definition: 'perros (շներ)' },
  { spanish: 'libros', armenian: 'գրքեր', gender: 'M', number: 'P', definition: 'libros (գրքեր)' },
  { spanish: 'gatos', armenian: 'կատուներ', gender: 'M', number: 'P', definition: 'gatos (կատուներ)' },
  { spanish: 'bolígrafos', armenian: 'գրիչներ', gender: 'M', number: 'P', definition: 'bolígrafos (գրիչներ)' },
  
  // Feminine Plural
  { spanish: 'casas', armenian: 'տներ', gender: 'F', number: 'P', definition: 'casas (տներ)' },
  { spanish: 'mesas', armenian: 'սեղաններ', gender: 'F', number: 'P', definition: 'mesas (սեղաններ)' },
  { spanish: 'manzanas', armenian: 'խնձորներ', gender: 'F', number: 'P', definition: 'manzanas (խնձորներ)' },
  { spanish: 'flores', armenian: 'ծաղիկներ', gender: 'F', number: 'P', definition: 'flores (ծաղիկներ)' },
];

export const SENTENCE_QUESTIONS: SentenceQuestion[] = [
  {
    id: 1,
    sentenceWithBlank: 'Hoy es ___.',
    translation: 'Այսօր երկուշաբթի է:',
    options: ['lunes', 'martes', 'miércoles', 'sábado'],
    correctAnswer: 'lunes',
    explanation: '«Lunes» նշանակում է երկուշաբթի իսպաներենով:'
  },
  {
    id: 2,
    sentenceWithBlank: '___ sol es caliente.',
    translation: 'Արևը տաք է: (Որոշյալ հոդ)',
    options: ['El', 'La', 'Los', 'Las'],
    correctAnswer: 'El',
    explanation: '«Sol» (արև) գոյականը արական սեռի եզակի թիվ է, ուստի որոշյալ հոդն է «El»:'
  },
  {
    id: 3,
    sentenceWithBlank: 'Quiero comer ___ manzana.',
    translation: 'Ցանկանում եմ ուտել մի խնձոր: (Անորոշ հոդ)',
    options: ['un', 'una', 'unos', 'unas'],
    correctAnswer: 'una',
    explanation: '«Manzana»-ն (խնձոր) իգական սեռի եզակի գոյական է, ուստի անորոշ հոդն է «una»:'
  },
  {
    id: 4,
    sentenceWithBlank: 'El fin de semana es ___ y domingo.',
    translation: 'Շաբաթվա վերջը (weekend) շաբաթն ու կիրակին են:',
    options: ['jueves', 'viernes', 'sábado', 'lunes'],
    correctAnswer: 'sábado',
    explanation: '«Sábado» նշանակում է շաբաթ (օր):'
  },
  {
    id: 5,
    sentenceWithBlank: '___ chicas juegan en el parque.',
    translation: 'Աղջիկները խաղում են այգում: (Որոշյալ հոդ)',
    options: ['El', 'La', 'Los', 'Las'],
    correctAnswer: 'Las',
    explanation: '«Chicas»-ը (աղջիկներ) իգական սեռի հոգնակի գոյական է, ուստի որոշյալ հոդն է «Las»:'
  },
  {
    id: 6,
    sentenceWithBlank: 'Tengo ___ libros muy interesantes.',
    translation: 'Ունեմ մի քանի շատ հետաքրքիր գրքեր: (Անորոշ հոդ)',
    options: ['un', 'una', 'unos', 'unas'],
    correctAnswer: 'unos',
    explanation: '«Libros»-ը (գրքեր) արական սեռի հոգնակի է, ուստի անորոշ հոդն է «unos»:'
  },
  {
    id: 7,
    sentenceWithBlank: 'Mañana es ___ (Չորեքշաբթի):',
    translation: 'Վաղը չորեքշաբթի է:',
    options: ['martes', 'miércoles', 'jueves', 'viernes'],
    correctAnswer: 'miércoles',
    explanation: '«Miércoles» նշանակում է չորեքշաբթի:'
  },
  {
    id: 8,
    sentenceWithBlank: '___ casa de María es bonita.',
    translation: 'Մարիայի տունը սիրուն է: (Որոշյալ հոդ)',
    options: ['El', 'La', 'Un', 'Una'],
    correctAnswer: 'La',
    explanation: '«Casa» (տուն) գոյականը իգական սեռի եզակի թիվ է, ուստի որոշյալ հոդն է «La»:'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionArm: 'Ո՞րն է «ուրբաթ» օրվա իսպաներեն թարգմանությունը:',
    questionEsp: '¿Cómo se dice "viernes" en armenio?',
    options: ['jueves', 'viernes', 'sábado', 'martes'],
    correctAnswer: 'viernes',
    explanation: '«Viernes» նշանակում է Ուրբաթ:'
  },
  {
    id: 2,
    questionArm: 'Արդյո՞ք իսպաներենում շաբաթվա օրերը գրվում են մեծատառով (բացառությամբ նախադասության սկսվելուց):',
    questionEsp: '¿Se escriben los días de la semana con mayúscula en español?',
    options: ['Այո, միշտ', 'Ոչ, դրանք գրվում են փոքրատառով', 'Կախված է օրվանից', 'Միայն կիրակին'],
    correctAnswer: 'Ոչ, դրանք գրվում են փոքրատառով',
    explanation: 'Իսպաներենում շաբաթվա օրերը սովորաբար գրվում են փոքրատառով` lunes, martes և այլն:'
  },
  {
    id: 3,
    questionArm: 'Իսպաներենում շաբաթվա բոլոր օրերը ո՞ր քերականական սեռին են պատկանում:',
    questionEsp: '¿Qué género gramatical tienen los días de la semana?',
    options: ['Իգական', 'Անորոշ', 'Արական', 'Չեզոք'],
    correctAnswer: 'Արական',
    explanation: 'Շաբաթվա բոլոր օրերը արական սեռի են, օրինակ` «el lunes», «un sábado»:'
  },
  {
    id: 4,
    questionArm: 'Ո՞րն է իգական սեռի հոգնակի թվի որոշյալ հոդը (Definite Article / Plural Feminine):',
    questionEsp: '¿Cuál es el artículo definido femenino plural?',
    options: ['la', 'las', 'unas', 'los'],
    correctAnswer: 'las',
    explanation: 'Իգական հոգնակիի որոշյալ հոդը «las»-ն է (օր.` las mesas):'
  },
  {
    id: 5,
    questionArm: 'Ի՞նչ է նշանակում «un libro» արտահայտությունը:',
    questionEsp: '¿Qué significa "un libro"?',
    options: ['գիրքը (որոշյալ)', 'գրքերը', 'մի գիրք (անորոշ)', 'գրչատուփը'],
    correctAnswer: 'մի գիրք (անորոշ)',
    explanation: '«un»-ը արական եզակի անորոշ հոդն է, իսկ «libro»-ն` գիրք: Նշանակում է «մի գիրք»:'
  },
  {
    id: 6,
    questionArm: '«Domingo»-ն շաբաթվա ո՞ր օրն է:',
    questionEsp: '¿Qué día de la semana es "domingo"?',
    options: ['Շաբաթ', 'Կիրակի', 'Չորեքշաբթի', 'Երկուշաբթի'],
    correctAnswer: 'Կիրակի',
    explanation: '«Domingo» նշանակում է Կիրակի:'
  },
  {
    id: 7,
    questionArm: 'Ո՞րն է «unas flores» թարգմանությունը:',
    questionEsp: '¿Qué significa "unas flores"?',
    options: ['ծաղիկը (որոշյալ)', 'մի քանի ծաղիկներ (անորոշ)', 'ծաղիկները (որոշյալ)', 'սեղաններ'],
    correctAnswer: 'մի քանի ծաղիկներ (անորոշ)',
    explanation: '«unas»-ը իգական հոգնակի անորոշ հոդն է, իսկ «flores»-ը` ծաղիկներ: Միասին` «մի քանի ծաղիկներ»:'
  }
];
