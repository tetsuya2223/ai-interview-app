import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        面接は終了しました。
      </h1>
      <p className="text-lg text-center mb-8">
        ご協力いただきありがとうございました。
        <br />
        お忙しい中、貴重なお時間をいただき感謝申し上げます。
      </p>
      <button
        onClick={handleReturnHome}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
      >
        ホームへ戻る
      </button>
    </div>
  );
};

export default ThankYou;
