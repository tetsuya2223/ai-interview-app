import { createContext } from "react";

const FormQuestionsContext = createContext([
  {
    id: 1,
    question: "お名前を教えてください。",
    type: "text",
    required: true,
  },
  {
    id: 2,
    question: "性別を選択してください。",
    type: "radio",
    options: ["男性", "女性", "回答しない"],
    required: true,
  },
  {
    id: 3,
    question: "年齢を教えてください。",
    type: "number",
    required: true,
  },
  {
    id: 4,
    question: "希望する職種を選択してください。",
    type: "radio",
    options: ["ホールスタッフ", "キッチンスタッフ", "どちらでも良い"],
    required: true,
  },
  {
    id: 5,
    question: "勤務可能な曜日を選択してください。（複数選択可）",
    type: "checkbox",
    options: ["月", "火", "水", "木", "金", "土", "日"],
    required: false,
  },
  {
    id: 6,
    question: "現在の最終学歴を選択してください。",
    type: "radio",
    options: [
      "中学校卒業",
      "高等学校卒業",
      "専門学校卒業",
      "大学卒業",
      "大学院卒業",
    ],
    required: true,
  },
  {
    id: 7,
    question: "これまでに接客業の経験はありますか？",
    type: "radio",
    options: ["はい", "いいえ"],
    required: true,
  },
  {
    id: 8,
    question: "希望する勤務時間帯を選択してください（複数選択可）。",
    type: "checkbox",
    options: [
      "朝 (8:00-12:00)",
      "昼 (12:00-16:00)",
      "夕方 (16:00-20:00)",
      "夜 (20:00-24:00)",
    ],
    required: false,
  },
  {
    id: 9,
    question: "現在の住所を教えてください。",
    type: "text",
    required: true,
  },
  {
    id: 10,
    question: "あなたの長所を教えてください。",
    type: "text",
    required: true,
  },
  {
    id: 11,
    question: "これまでの職務経験を簡単に教えてください。",
    type: "text",
    required: false,
  },
  {
    id: 12,
    question: "当社で働く上で期待することや目標があれば教えてください。",
    type: "text",
    required: false,
  },
]);

export default FormQuestionsContext;
