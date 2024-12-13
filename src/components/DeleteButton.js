import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const DeleteButton = ({ onDelete }) => {
  const confirmDelete = () => {
    toast.warn(
      <div>
        <p>本当に削除してよろしいですか？</p>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            onClick={() => {
              onDelete(); // 親コンポーネントから渡された削除処理を実行
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            はい
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            いいえ
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        confirmDelete();
      }}
      className="text-red-500 hover:text-red-700"
    >
      <FaTrashAlt size={20} />
    </button>
  );
};

export default DeleteButton;
