import { useState } from "react";
import api from "../services/api";

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generatePersonas() {
    setLoading(true);
    setError("");

    try {
      const generated = [];

      for (let i = 0; i < 3; i++) {
        const response = await api.post("/personas/generate", {
          product: "FinWise - AI Financial Copilot for Irregular-Income Workers",
          target_audience:
            "Freelancers, creators, gig workers and independent professionals aged 22-40",
          research_objectives:
            "Understand financial challenges and desired features",
        });

        generated.push(response.data);
      }

      setPersonas(generated);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to generate personas."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Synthetic Personas
        </h1>

        <p className="mt-2 text-gray-600">
          Generate AI-powered synthetic users for FinWise research.
        </p>

        <button
          onClick={generatePersonas}
          disabled={loading}
          className="mt-5 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Generating Personas..." : "Generate Personas"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {personas.map((persona, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900">
              {persona.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {persona.age} years old · {persona.occupation}
            </p>

            <div className="mt-5">
              <h3 className="font-semibold text-gray-900">
                Personality
              </h3>
              <p className="mt-1 text-gray-600">
                {persona.personality}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">
                Behavioral Patterns
              </h3>
              <p className="mt-1 text-gray-600">
                {persona.behavioral_patterns}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">
                Psychological Profile
              </h3>
              <p className="mt-1 text-gray-600">
                {persona.psychological_profile}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">
                Goals
              </h3>
              <p className="mt-1 text-gray-600">
                {persona.goals}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">
                Pain Points
              </h3>
              <p className="mt-1 text-gray-600">
                {persona.pain_points}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Personas;