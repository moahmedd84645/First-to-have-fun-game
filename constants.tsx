import { Question, QuestionType } from './types';

export const FEEDBACK_MESSAGES = [
  "أحسنت يا بطل! 🌟",
  "شاطر جداً! 👏",
  "هائل! 🚀",
  "ممتاز! 🏆",
  "رائع! 🌈",
  "ذكي جداً! 🧠",
  "إجابة مذهلة! ✨",
  "عمل رائع! 💪"
];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    type: QuestionType.MULTIPLE_CHOICE,
    text: "من كانت أول من رفعت يدها؟",
    options: ["أحمد", "يوسف", "إيمان", "سارة"],
    correctAnswer: "إيمان"
  },
  {
    id: 2,
    type: QuestionType.TRUE_FALSE,
    text: "المعلم كان غاضبًا عندما سأل السؤال.",
    correctAnswer: false // خطأ
  },
  {
    id: 3,
    type: QuestionType.MULTIPLE_CHOICE,
    text: "لماذا رفعت إيمان يدها؟",
    options: ["لتلعب", "لتجاوب سؤال المعلم", "لأن زملاءها طلبوا منها", "لأنها كانت زهقانة"],
    correctAnswer: "لتجاوب سؤال المعلم"
  },
  {
    id: 4,
    type: QuestionType.ORDERING,
    text: "رتب أحداث القصة:",
    correctOrder: ["المعلم يسأل", "إيمان ترفع يدها", "المعلم يختارها", "إيمان تجيب"]
  },
  {
    id: 5,
    type: QuestionType.MULTIPLE_CHOICE,
    text: "كيف شعرت إيمان بعد الإجابة؟",
    options: ["حزينة", "خائفة", "مبسوطة", "غاضبة"],
    correctAnswer: "مبسوطة"
  },
  {
    id: 6,
    type: QuestionType.MULTIPLE_CHOICE,
    text: "أكمل: إيمان كانت _____ عندما رفعت يدها.",
    options: ["مترددة", "حزينة", "شجاعة"],
    correctAnswer: "شجاعة"
  },
  {
    id: 7,
    type: QuestionType.MATCHING,
    text: "طابق بين الشخص والحدث:",
    matchingPairs: [
      { id: "m1", left: "المعلم", right: "يسأل" },
      { id: "m2", left: "يد مرفوعة", right: "تريد الإجابة" },
      { id: "m3", left: "طالبة تتكلم", right: "تشرح" },
      { id: "m4", left: "المعلم يبتسم", right: "يشجع" },
    ]
  },
  {
    id: 8,
    type: QuestionType.MULTIPLE_CHOICE,
    text: "ماذا نتعلم من القصة؟",
    options: ["الضوضاء", "النوم", "الشجاعة والمشاركة", "الكذب"],
    correctAnswer: "الشجاعة والمشاركة"
  },
  {
    id: 9,
    type: QuestionType.TRUE_FALSE,
    text: "إيمان رفضت الإجابة.",
    correctAnswer: false // خطأ
  },
  {
    id: 10,
    type: QuestionType.IMAGE_CHOICE,
    text: "اختر الرمز الذي يعبر عن 'رفع اليد':",
    options: ["hand", "sleep", "run"], // mapped to icons in component
    correctAnswer: "hand"
  }
];