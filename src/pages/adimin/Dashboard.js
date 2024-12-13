import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, listAll } from "firebase/storage";

import { useNavigate } from "react-router-dom";
import DeleteButton from "../../components/DeleteButton";

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "surveys"));
        const data = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const survey = { id: doc.id, ...doc.data() };

            // ストレージで動画をチェック
            const storagePath = `${survey.id}/`;
            const storageRef = ref(storage, storagePath);
            const hasVideos = await listAll(storageRef)
              .then((res) => res.items.length > 0)
              .catch(() => false);

            // ステータスを決定
            if (!survey.answers) {
              survey.status = "未実施";
            } else if (hasVideos) {
              survey.status = "面接未実施";
            } else {
              survey.status = "完了";
            }

            return survey;
          })
        );

        setSurveys(data);
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    fetchSurveys();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("ja-JP", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const sortSurveys = (data) => {
    return [...data].sort((a, b) => {
      const keyA = a[sortKey];
      const keyB = b[sortKey];

      const valueA = keyA?.toDate ? keyA.toDate() : keyA;
      const valueB = keyB?.toDate ? keyB.toDate() : keyB;

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const docRef = doc(db, "surveys", id);
      await updateDoc(docRef, { status: newStatus });
      setSurveys((prevSurveys) =>
        prevSurveys.map((survey) =>
          survey.id === id ? { ...survey, status: newStatus } : survey
        )
      );
      console.log(
        `ドキュメント ${id} のステータスを ${newStatus} に更新しました`
      );
    } catch (error) {
      console.error("ステータス更新中にエラーが発生しました:", error);
    }
  };

  const deleteSurvey = async (id, videoPaths = []) => {
    try {
      const docRef = doc(db, "surveys", id);
      await deleteDoc(docRef);

      for (const path of videoPaths) {
        const encodedPath = encodeURIComponent(path);
        const storageUrl = `https://firebasestorage.googleapis.com/v0/b/ai-interview-project-5e220.appspot.com/o/${encodedPath}`;

        await fetch(storageUrl, {
          method: "DELETE",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `動画 ${path} の削除に失敗しました: ${response.statusText}`
              );
            }
            console.log(`動画 ${path} を削除しました`);
          })
          .catch((error) => console.error(error));
      }

      setSurveys((prevSurveys) =>
        prevSurveys.filter((survey) => survey.id !== id)
      );
      console.log(`ドキュメント ${id} を削除しました`);
    } catch (error) {
      console.error("削除中にエラーが発生しました:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">アンケート管理</h1>

      {surveys.length > 0 ? (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                名前
              </th>
              <th
                className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
                onClick={() => {
                  setSortKey("status");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                ステータス
                {sortKey === "status" && (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
              <th
                className="border border-gray-300 px-4 py-2 text-left cursor-pointer"
                onClick={() => {
                  setSortKey("createdAt");
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                }}
              >
                面接日時
                {sortKey === "createdAt" && (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                採用
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {sortSurveys(surveys).map((survey) => (
              <tr
                key={survey.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/details/${survey.id}`)}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {survey.answers?.["1"].answer || "匿名"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {survey.status || "未選考"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatDate(survey.createdAt)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(survey.id, "不採用");
                      }}
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      不採用
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(survey.id, "採用");
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      採用
                    </button>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <DeleteButton
                    onDelete={() => {
                      deleteSurvey(survey.id);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>アンケートデータがありません。</p>
      )}
    </div>
  );
};

export default Dashboard;
