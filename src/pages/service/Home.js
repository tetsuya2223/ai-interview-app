import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGoToQuestions = () => {
    navigate("/questions");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">
        Welcome to the Home Page
      </h1>
      <button
        onClick={handleGoToQuestions}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
      >
        面接前アンケートに進む
      </button>
    </div>
  );
};

export default Home;
