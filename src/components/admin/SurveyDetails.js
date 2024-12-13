import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import InterviewQuestionsContext from "../../contexts/InterviewQuestionsContext";
const SurveyDetails = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const [survey, setSurvey] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  // const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const interviewQuestions = useContext(InterviewQuestionsContext);

  useEffect(() => {
    const fetchSurvey = async () => {
      // setLoding(true);
      try {
        const docRef = doc(db, "surveys", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSurvey({ id: docSnap.id, ...docSnap.data() });

          const sessionId = docSnap.data().sessionId;
          console.log("SessionID:", sessionId);

          if (!sessionId) {
            console.error("SessionIdが存在しません");
          }

          const storage = getStorage();
          const videoRef = ref(storage, `${sessionId}/`);
          // パスをコンソールに表示
          console.log("取得するStorageのパス:", `${sessionId}/`);

          const res = await listAll(videoRef);
          const fileUrls = await Promise.all(
            res.items.map(async (itemRef) => {
              const url = await getDownloadURL(itemRef);
              return url; // それぞれの動画のURLを返す
            })
          );
          setVideoUrls(fileUrls); // すべての動画のURLをstateに設定
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded shadow">
      <h1 className="text-3xl font-bold mb-8 text-center">回答の詳細</h1>
      {survey ? (
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <p>
              <strong>回答ID:</strong> {survey.id}
            </p>
            <p>
              <strong>Session ID:</strong> {survey.sessionId}
            </p>
          </div>

          {survey.answers ? (
            <div className="bg-white p-6 rounded shadow mb-6">
              <h2 className="text-xl font-bold mb-4">アンケート結果</h2>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100">
                      No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100">
                      質問
                    </th>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100">
                      回答
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(survey.answers).map(
                    ([questionId, { question, answer }], index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {question || "質問がありません"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {typeof answer === "object"
                            ? Object.entries(answer)
                                .filter(([option, isChecked]) => isChecked)
                                .map(([option]) => option)
                                .join(", ")
                            : answer || "回答がありません"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">回答データがありません。</p>
          )}

          {videoUrls && videoUrls.length > 0 && (
            <div className="bg-white p-6 rounded shadow mb-6">
              <h2 className="text-xl font-bold mb-4">面接動画</h2>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100">
                      質問番号
                    </th>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100">
                      質問
                    </th>
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100">
                      動画リンク
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {videoUrls.map((url, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {interviewQuestions[index] || "質問が見つかりません"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          動画を見る
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="bg-white p-4 rounded shadow">
            <p>
              <strong>面接日時:</strong>{" "}
              {survey.createdAt
                ? survey.createdAt.toDate().toLocaleDateString()
                : "日時が取得できませんでした"}
            </p>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className="w-full bg-blue-500 text-white py-2 mt-6 rounded hover:bg-blue-600 transition"
          >
            戻る
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">読み込み中...</p>
      )}
    </div>
  );
};

export default SurveyDetails;
