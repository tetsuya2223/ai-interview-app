import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const SurveyDetails = () => {
  const { id } = useParams(); // URLパラメータからIDを取得
  const [survey, setSurvey] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  // const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">回答の詳細</h1>
      {survey ? (
        <div>
          <p>
            <strong>回答ID:</strong> {survey.id}
          </p>
          <p>
            <strong>Session ID:</strong> {survey.sessionId}{" "}
          </p>
          <div className="mt-4">
            {survey.answers ? (
              Object.entries(survey.answers).map(
                ([questionId, { question, answer }], index) => {
                  return (
                    <div key={index} className="mb-2">
                      <strong>{index + 1}&nbsp;&nbsp;</strong>
                      {question ? question : "質問がありません"} :{" "}
                      {typeof answer === "object"
                        ? Object.entries(answer)
                            .filter(([option, isChecked]) => isChecked)
                            .map(([option]) => option)
                            .join(",")
                        : answer}
                    </div>
                  );
                }
              )
            ) : (
              <p>回答データがありません。</p>
            )}
          </div>

          {videoUrls && videoUrls.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-bold">動画</h3>
              {videoUrls.map((url, index) => (
                <div key={index} className="mb-2">
                  <a href={url} taget="_blank" rel="noopener noreferrer">
                    動画 {index + 1}を見る
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>動画データがありません。</p>
          )}

          <p className="mt-4">
            <strong>送信日時:</strong>{" "}
            {survey.createdAt
              ? survey.createdAt.toDate().toLocaleString()
              : "N/A"}
          </p>
          <button
            onClick={() => navigate("/admin")}
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
