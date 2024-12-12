import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InterviewQuestionsContext from "../../contexts/InterviewQuestionsContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state || {};
  const interviewQuestions = useContext(InterviewQuestionsContext);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isReadyToRecord, setIsReadyToRecord] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const recorderRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  // セッションIDがない場合の処理
  useEffect(() => {
    if (!sessionId) {
      console.error("セッションIDがありません。アンケートを完了してください。");
      alert("セッションIDがありません。アンケートを完了してください。");
      navigate("/");
    }
  }, [sessionId, navigate]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        console.log("生成されたBlob:", blob);

        const downloadURL = await uploadVideoWithFetch(
          blob,
          currentQuestionIndex
        );
        if (downloadURL) {
          setUploadedVideos((prev) => [
            ...prev,
            {
              question: interviewQuestions[currentQuestionIndex],
              url: downloadURL,
            },
          ]);
        }
        // ストリームを停止
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      recorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("録画開始エラー:", error);
    }
  };

  // 録画を停止する関数
  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    setIsRecording(false);
  };

  // Firebase Storage に動画をアップロードする関数
  const uploadVideoWithFetch = async (fileBlob, questionIndex) => {
    try {
      const fileName = `${sessionId}/question_${questionIndex}_${Date.now()}.webm`; // 一意のファイル名
      const encodedFileName = encodeURIComponent(fileName); // ファイル名をURLエンコード

      // 正しいバケット名を使用したアップロード URL
      const storageUrl = `https://firebasestorage.googleapis.com/v0/b/ai-interview-project-5e220.firebasestorage.app/o/${encodedFileName}?uploadType=media`;

      console.log("手動生成したアップロードURL:", storageUrl);

      const response = await fetch(storageUrl, {
        method: "POST",
        headers: {
          "Content-Type": "video/webm",
        },
        body: fileBlob,
      });

      if (!response.ok) {
        throw new Error(
          `アップロード失敗: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("アップロード成功:", result);
      return result.mediaLink; // ダウンロードURLを返す
    } catch (error) {
      console.error("アップロード中のエラー:", error);
      return null;
    }
  };

  // 次の質問へ進む
  const handleNextQuestion = () => {
    stopRecording();
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      navigate("/interview-end", { state: { uploadedVideos } });
    }
  };

  // 録画準備を設定
  const handlePrepareRecording = () => {
    setIsReadyToRecord(true);
  };

  // コンポーネントがアンマウントされたら録画を停止
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return sessionId ? (
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
            面接を開始
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
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              質問 {currentQuestionIndex + 1} / {interviewQuestions.length}
            </h1>
            <p className="mb-4 text-lg">
              {interviewQuestions[currentQuestionIndex]}
            </p>
          </div>
          <div className="w-full bg-gray-300 h-2 rounded mb-4">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / interviewQuestions.length) * 100
                }%`,
              }}
            ></div>
          </div>
          <button
            onClick={isRecording ? handleNextQuestion : startRecording}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
          >
            {isRecording
              ? currentQuestionIndex === interviewQuestions.length - 1
                ? "面接を終了する"
                : "次の質問へ"
              : "録画を開始"}
          </button>
        </>
      )}
    </div>
  ) : null;
};

export default Interview;
