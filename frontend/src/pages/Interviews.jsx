import { useEffect, useState } from "react";
import api from "../services/api";

function Interviews() {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedPersonas = localStorage.getItem("finwise_personas");

    if (savedPersonas) {
      const parsed = JSON.parse(savedPersonas);
      setPersonas(parsed);

      if (parsed.length > 0) {
        setSelectedPersona(parsed[0]);
      }
    }
  }, []);

  const askQuestion = async () => {
    if (!question.trim() || !selectedPersona) return;

    setLoading(true);

    try {
      const response = await api.post("/interviews/chat", {
        product: "FinWise - AI Financial Copilot",
        persona: selectedPersona,
        question: question,
        history: messages,
      });

      setMessages(response.data.history);
      setQuestion("");
    } catch (error) {
      console.error(error);
      alert("Failed to get persona response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Interview Mode
      </h1>

      <div className="mb-6">
        <label className="block font-medium mb-2">
          Select Persona
        </label>

        <select
          value={selectedPersona?.name || ""}
          onChange={(e) => {
            const persona = personas.find(
              (p) => p.name === e.target.value
            );

            setSelectedPersona(persona);
            setMessages([]);
          }}
          className="border rounded-lg p-2 w-full"
        >
          {personas.map((persona, index) => (
            <option key={index} value={persona.name}>
              {persona.name} - {persona.occupation}
            </option>
          ))}
        </select>
      </div>

      {selectedPersona && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="font-bold text-lg">
            {selectedPersona.name}
          </h2>

          <p className="text-gray-600">
            {selectedPersona.occupation}
          </p>

          <p className="mt-2">
            {selectedPersona.personality}
          </p>
        </div>
      )}

      <div className="border rounded-lg p-4 mb-4 min-h-[300px]">
        {messages.length === 0 ? (
          <p className="text-gray-500">
            Start the interview by asking a question.
          </p>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">
                You:
              </p>

              <p className="mb-2">
                {message.question}
              </p>

              <p className="font-semibold">
                {selectedPersona.name}:
              </p>

              <p>
                {message.response}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              askQuestion();
            }
          }}
          placeholder="Ask the persona a question..."
          className="border rounded-lg p-3 flex-1"
        />

        <button
          onClick={askQuestion}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}

export default Interviews;