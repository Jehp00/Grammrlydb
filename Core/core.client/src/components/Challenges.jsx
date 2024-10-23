import { useEffect, useState } from "react";
import { Question } from "../utils/questions/questions";

export default function Challenges() {
  const [questions, setQuestions] = useState([]);
  const [userStatus, setStatus] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // Respuesta que se renderiza si la respuesta a la pregunta en buena o mala

  useEffect(() => {
    // Trae las preguntas del json
    const questionInstance = new Question();
    questionInstance.fetchQuestions().then(() => {
      setQuestions(questionInstance.getQuestions());
    });

    // Hace la peticion a la base de datos sobre el total de preguntas y cuantas preguntas lleva resueltas
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
    // Codigo que si le da click a la casilla se abre la pregunta
    setSelectedQuestion(selectedQuestion === idx ? null : idx);
    setSelectedOption(null); // Elimina el mensaje cuando se responde una pregunta
    setFeedback(null); // Elimina el mensaje cuando se responde una pregunta
  };

  // funcion que revisa si la respuesta es correcta
  const checkAnswer = async (correctAnswer) => {
    if (selectedOption === correctAnswer) {
      // Mensaje derespuesta correcta
      setFeedback("✅ Correct answer!");

      // Se hace una peticion a la base de datos para editar la fila del usuario y desde el back se suma 1 al numero de respuestas completadas
      const userEmail = localStorage.getItem("user"); // trae el email para identificar el usuario del ambiente locla del browser localStroge
      try {
        const response = await fetch(`api/SecureWeb/update-answer/${userEmail}`, {
          method: "PUT",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to update total answered questions");
        }

        // Actualiza el status del usuario desbloqueando la siguiente pregunta
        setStatus((prevState) => ({
          ...prevState,
          totalAnsweredQuestions: prevState.totalAnsweredQuestions + 1,
        }));
        // Si algo sale mal renderisa un mensaje de que algo mal pasa en el servidor back
      } catch (error) {
        console.error("Error updating total answered questions:", error);
        setFeedback("❌ Error updating your progress.");
      }
    } else {
      // Mensaje si la respuesta seleccionada es incorrecta
      setFeedback("❌ Incorrect answer.");
    }
  };

  // Mapea las preguntas del array de preguntas y pone la data correspondiente automaticamente del json
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
