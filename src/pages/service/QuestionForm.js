import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import questions from "../../data/question";
import { v4 as uuidv4 } from "uuid";

const QuestionForm = () => {
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  // 質問の回答を更新
  const handleChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // チェックボックスの回答を更新
  const handleCheckboxChange = (id, value, isChecked) => {
    setAnswers((prev) => {
      const currentValues = prev[id] || [];
      if (isChecked) {
        return {
          ...prev,
          [id]: [...currentValues, value],
        };
      } else {
        return {
          ...prev,
          [id]: currentValues.filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sessionId = uuidv4();

    try {
      await addDoc(collection(db, "surveys"), {
        sessionId,
        answers,
        createdAt: Timestamp.now(),
      });

      console.log("回答がFirestoreに保存されました:", answers);
      alert("回答が送信されました！");
      console.log("送信後の sessionId:", sessionId);
      navigate("/interview-start", { state: { sessionId } });

      navigate("/interview-start", { state: { sessionId } });
    } catch (error) {
      console.error("回答の送信中にエラーが発生しました:", error);
      alert("送信に失敗しました。もう一度試してください。");
    }
  };

  const renderInputField = (question) => {
    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            required={question.required}
            className="w-full p-2 border rounded"
            onChange={(e) => handleChange(question.id, e.target.value)}
          />
        );
      case "radio":
        return question.options.map((option, index) => (
          <div key={index}>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                required={question.required}
                onChange={(e) => handleChange(question.id, e.target.value)}
                className="mr-2"
              />
              {option}
            </label>
          </div>
        ));
      case "checkbox":
        return question.options.map((option, index) => (
          <div key={index}>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                value={option}
                onChange={(e) =>
                  handleCheckboxChange(question.id, option, e.target.checked)
                }
                className="mr-2"
              />
              {option}
            </label>
          </div>
        ));
      case "number": // 新しいnumber型の対応
        return (
          <input
            type="number"
            required={question.required}
            className="w-full p-2 border rounded"
            onChange={(e) => handleChange(question.id, e.target.value)}
          />
        );
      default:
        return <div>未対応の質問タイプ: {question.type}</div>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">面接前質問</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="space-y-2">
            <label className="block text-lg font-medium">
              {q.question}
              {q.required && <span className="text-red-500"> *</span>}
            </label>
            {renderInputField(q)}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          提出
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
