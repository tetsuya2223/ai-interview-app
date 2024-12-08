import { createContext } from "react";

const InterviewQuestionsContext = createContext();

const interviewQuestions = [
  "自己紹介をしてください。",
  "これまでの経験で困難を乗り越えたエピソードを教えてください。",
  "当社で実現したいことは何ですか？",
  "最後に何か質問はありますか？",
];

export const InterviewQuestionsProvider = ({ children }) => {
  return (
    <InterviewQuestionsContext.Provider value={interviewQuestions}>
      {children}
    </InterviewQuestionsContext.Provider>
  );
};

export default InterviewQuestionsContext;
