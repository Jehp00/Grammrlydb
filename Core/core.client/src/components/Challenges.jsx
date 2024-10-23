import { useEffect, useState } from "react";
import { Question } from "../utils/questions/questions";

export default function Challenges() {
  const [questions, setQuestions] = useState([]);
  const [userStatus, setStatus] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // To store feedback about the answer

  useEffect(() => {
    const questionInstance = new Question();
    questionInstance.fetchQuestions().then(() => {
      setQuestions(questionInstance.getQuestions());
    });

    const user = localStorage.getItem("user");
    fetch("api/SecureWeb/user-info/" + user, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
      })
      .catch((err) => {
        console.log("error while getting the user info: " + err);
      });
  }, []);

  const handleQuestionClick = (idx) => {
    // Toggle the selected question
    setSelectedQuestion(selectedQuestion === idx ? null : idx);
    setSelectedOption(null); // Reset selected option
    setFeedback(null); // Reset feedback
  };

  const checkAnswer = async (correctAnswer) => {
    if (selectedOption === correctAnswer) {
      setFeedback("✅ Correct answer!");

      // Make a request to update the answered questions in the DB
      const userEmail = localStorage.getItem("user"); // Assuming you have the user's email stored
      try {
        const response = await fetch(`api/SecureWeb/update-answer/${userEmail}`, {
          method: "PUT",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to update total answered questions");
        }

        // Update the local userStatus to reflect the change
        setStatus((prevState) => ({
          ...prevState,
          totalAnsweredQuestions: prevState.totalAnsweredQuestions + 1,
        }));

      } catch (error) {
        console.error("Error updating total answered questions:", error);
        setFeedback("❌ Error updating your progress.");
      }
    } else {
      setFeedback("❌ Incorrect answer.");
    }
  };

  return (
    <div className="p-16">
      <h1>Retos</h1>
      <h2 className="font-bold">Retos A1</h2>
      {questions.map((question, idx) => {
        // Check if the question should be available based on userStatus
        const isAvailable = idx === 0 || userStatus.totalAnsweredQuestions > idx;

        return (
          <div key={idx}>
            <div
              onClick={isAvailable ? () => handleQuestionClick(idx) : null}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: '5px',
                margin: "10px 0",
                cursor: isAvailable ? "pointer" : "not-allowed",
                backgroundColor: selectedQuestion === idx ? "#f0f0f0" : "#fff",
                opacity: isAvailable ? 1 : 0.5, // Dim the blocked questions
              }}
            >
              <h3>Question {idx + 1}: {question.title}</h3>
            </div>

            {selectedQuestion === idx && (
              <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}>
                <p>{question.question}</p>
                {question.options && question.options.map((option, optionIdx) => (
                  <div key={optionIdx}>
                    <label>
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={option}
                        checked={selectedOption === option}
                        onChange={() => setSelectedOption(option)}
                      />
                      {option}
                    </label>
                  </div>
                ))}
                <button onClick={() => checkAnswer(question.correctAnswer)}>
                  Check Answer
                </button>
                {feedback && <p>{feedback}</p>} {/* Display feedback */}
              </div>
            )}
            {idx === 7 &&
              <h2 className="font-bold">Retos A2</h2>
            }
            {idx === 14 &&
              <h2 className="font-bold">Retos B1</h2>
            }
          </div>
        );
      })}
    </div>
  );
}
