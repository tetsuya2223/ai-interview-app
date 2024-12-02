import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const SurveyDetails = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const [survey, setSurvey] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const docRef = doc(db, "surveys", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSurvey({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("データが見つかりません");
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    fetchSurvey();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">回答の詳細</h1>
      {survey ? (
        <div>
          <p>
            <strong>回答ID:</strong> {survey.id}
          </p>
          <div className="mt-4">
            <h2 className="text-lg font-bold">回答内容:</h2>
            {/* survey.answers が存在する場合にのみ Object.entries を実行 */}
            {survey.answers ? (
              Object.entries(survey.answers).map(
                ([questionId, answer], index) => (
                  <div key={index} className="mb-2">
                    <strong>Q{questionId}:</strong>{" "}
                    {typeof answer === "object"
                      ? Object.entries(answer)
                          .filter(([option, isChecked]) => isChecked)
                          .map(([option]) => option)
                          .join(",")
                      : answer}
                  </div>
                )
              )
            ) : (
              <p>回答データがありません。</p>
            )}
          </div>
          <p className="mt-4">
            <strong>送信日時:</strong>{" "}
            {survey.createdAt
              ? survey.createdAt.toDate().toLocaleString()
              : "N/A"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            戻る
          </button>
        </div>
      ) : (
        <p>読み込み中...</p>
      )}
    </div>
  );
};

export default SurveyDetails;
