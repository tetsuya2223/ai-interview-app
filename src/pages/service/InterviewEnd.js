import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const InterviewEnd = () => {
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("質問やフィードバック:", feedback);

    toast.success("面接を終了しました。ご協力ありがとうございました！", {
      position: "top-center",
      autoClose: 2000,
    });

    navigate("/thank-you");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">
        面接は以上になります。お疲れ様でした。
      </h1>
      <p className="text-lg mb-4 text-center">
        最後に質問等あればご記入し、「面接を終了する」ボタンを押してください。
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="質問やコメントがあればこちらに記入してください。"
          rows={5}
          className="w-full p-2 border rounded resize-none"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition w-full"
        >
          面接を終了する
        </button>
      </form>
    </div>
  );
};

export default InterviewEnd;
