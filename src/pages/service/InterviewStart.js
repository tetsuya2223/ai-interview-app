import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const InterviewStart = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // state を取得
  const { sessionId } = state || {}; // state が null の場合を考慮

  const handleStartInterview = () => {
    if (!sessionId) {
      console.error(
        "セッションIDがありません。アンケート画面からやり直してください。"
      );
      alert("セッションIDがありません。アンケート画面からやり直してください。");
      navigate("/questions"); // アンケート画面に戻る
      return;
    }

    navigate("/interview", { state: { sessionId } }); // sessionId を次に渡す
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">
        アンケートの回答ありがとうございました。
      </h1>
      <p className="text-center mb-4">次にAIとの面接を実施していただきます。</p>
      <p className="text-center mb-4">
        AIが質問を読み上げましたら、それに回答をしてください。
      </p>
      <p className="text-center mb-4">
        回答が終わりましたら、「次の質問へ」ボタンを押して次の質問へ進んでください。
      </p>
      <p className="text-center mb-4">
        面接画面は録画していますが、合否判定以外で使用することはありませんのでご安心ください。
      </p>
      <p className="text-center mb-6">
        それでは下記のボタンを押して面接を始めてください。
      </p>
      <button
        onClick={handleStartInterview}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
      >
        面接を始める
      </button>
    </div>
  );
};

export default InterviewStart;
