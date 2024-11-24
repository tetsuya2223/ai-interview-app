import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  "自己紹介をしてください。",
  "これまでの経験で困難を乗り越えたエピソードを教えてください。",
  "当社で実現したいことは何ですか？",
  "最後に何か質問はありますか？",
];

const Interview = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isReadyToRecord, setIsReadyToRecord] = useState(false);
  const recorderRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null); // ストリームを管理
  const navigate = useNavigate();

  // 録画を開始する関数
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream; // ストリームを保存
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        console.log("録画ファイルのURL:", url); // URLを保存またはサーバーにアップロード
        stream.getTracks().forEach((track) => track.stop()); // カメラ/マイクを解放
        streamRef.current = null; // ストリームをリセット
      };

      mediaRecorder.start();
      recorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("録画の開始に失敗しました:", error);
    }
  };

  // 録画を停止する関数
  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null; // Recorderをリセット
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      stopRecording();
      navigate("/interview-end"); // 面接終了画面へ遷移
    }
  };

  // 録画を開始する前の準備
  const handlePrepareRecording = () => {
    setIsReadyToRecord(true);
  };

  // URL遷移時またはコンポーネントのアンマウント時に録画を停止
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {!isReadyToRecord ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">
            面接を開始する準備ができました。
          </h1>
          <button
            onClick={handlePrepareRecording}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
          >
            画面録画を開始します
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full max-w-screen-md aspect-video border mb-4"
          />
          {isRecording ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">
                {currentQuestionIndex === questions.length - 1
                  ? "これが最後の質問です"
                  : `質問 ${currentQuestionIndex + 1} / ${questions.length}`}
              </h1>
              <p className="mb-4 text-lg">{questions[currentQuestionIndex]}</p>
            </div>
          ) : (
            <h1 className="text-2xl font-bold mb-6">録画を開始しています...</h1>
          )}
          <div className="w-full bg-gray-300 h-2 rounded mb-4">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            ></div>
          </div>
          <button
            onClick={isRecording ? handleNextQuestion : startRecording}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
          >
            {isRecording
              ? currentQuestionIndex === questions.length - 1
                ? "面接を終了する"
                : "次の質問へ"
              : "録画を開始する"}
          </button>
        </>
      )}
    </div>
  );
};

export default Interview;
