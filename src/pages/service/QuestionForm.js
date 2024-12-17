import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import FormQuestionsContext from "../../contexts/FormQuestionsContext";
import { v4 as uuidv4 } from "uuid";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

const QuestionForm = () => {
  const navigate = useNavigate();
  const formQuestions = useContext(FormQuestionsContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const sessionId = uuidv4();

    const filteredAnswers = Object.keys(data).reduce((acc, key) => {
      const value = data[key];
      const question = formQuestions.find((q) => q.id === parseInt(key));

      if (typeof value === "object") {
        acc[key] = {
          question: question?.question,
          answer: Object.fromEntries(
            Object.entries(value).filter(([option, isChecked]) => isChecked)
          ),
        };
      } else {
        acc[key] = {
          question: question?.question,
          answer: value,
        };
      }

      return acc;
    }, {});

    try {
      await addDoc(collection(db, "surveys"), {
        sessionId,
        answers: filteredAnswers, // true のみのチェックボックスデータが格納される
        createdAt: Timestamp.now(),
      });

      toast.success("回答を送信しました");

      console.log("送信されたデータ:", filteredAnswers);

      navigate("/interview-start", { state: { sessionId } });
    } catch (error) {
      console.error("送信エラー:", error);
      toast.error("送信に失敗しました。もう一度試してみてください。");
    }
  };

  const renderInputField = (question) => {
    switch (question.type) {
      case "text":
        return (
          <Controller
            name={String(question.id)}
            control={control}
            defaultValue=""
            rules={{
              required: question.required && "回答を記入してください。",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full p-2 border rounded"
              />
            )}
          />
        );
      case "radio":
        return question.options.map((option, index) => (
          <div key={index}>
            <Controller
              name={String(question.id)}
              control={control}
              rules={{
                required: question.required && "1つ選択してください。",
              }}
              render={({ field }) => (
                <div>
                  <input
                    {...field}
                    type="radio"
                    value={option}
                    className="mr-2"
                  />
                  {option}
                </div>
              )}
            />
          </div>
        ));
      case "checkbox":
        return question.options.map((option, index) => (
          <div key={index}>
            <Controller
              name={`${String(question.id)}.${option}`}
              control={control}
              defaultValue={false}
              rules={
                { required: question.required } && "１つ以上選択してください。"
              }
              render={({ field }) => (
                <label className="inline-flex items-center">
                  <input {...field} type="checkbox" className="mr-2" />
                  {option}
                </label>
              )}
            />
          </div>
        ));
      case "number":
        return (
          <Controller
            name={String(question.id)}
            control={control}
            defaultValue=""
            rules={{ required: "数字を入力してください" }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                className="w-full p-2 border rounded"
              />
            )}
          />
        );
      default:
        return <div>未対応の質問タイプ: {question.type}</div>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">面接前質問</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {formQuestions.map((q) => (
          <div key={q.id} className="space-y-2">
            <label className="block text-lg font-medium">
              {q.question}
              {q.required && <span className="text-red-500"> *</span>}
            </label>
            {renderInputField(q)}
            {errors[q.id] && (
              <div className="text-red-500">{errors[q.id]?.message}</div>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          提出
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
