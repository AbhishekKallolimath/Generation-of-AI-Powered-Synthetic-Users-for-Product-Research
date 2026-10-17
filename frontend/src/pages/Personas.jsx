
import { useEffect, useState } from "react";
import api from "../services/api";

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Restore previously generated personas when the page opens
  useEffect(() => {
    try {
      const savedPersonas = localStorage.getItem("finwise_personas");

      if (savedPersonas) {
        const parsedPersonas = JSON.parse(savedPersonas);

        if (Array.isArray(parsedPersonas)) {
          setPersonas(parsedPersonas);
        }
      }
    } catch (err) {
      console.error("Unable to read saved personas:", err);
      setError("Unable to load saved personas.");
    }
  }, []);

  async function generatePersonas() {
    setLoading(true);
    setError("");

    try {
      const generated = [];

      // Generate three synthetic personas
      for (let i = 0; i < 3; i++) {
        const response = await api.post("/api/v1/personas/generate", {
          product:
            "FinWise - AI Financial Copilot for Irregular-Income Workers",
          target_audience:
            "Freelancers, creators, gig workers and independent professionals aged 22-40",
          research_objectives:
            "Understand financial challenges and desired features",
        });

        generated.push(response.data);
      }

      // Save personas so Survey Mode can access them
      localStorage.setItem(
        "finwise_personas",
        JSON.stringify(generated)
      );

      // Update the displayed persona cards
      setPersonas(generated);
    } catch (err) {
      console.error("Persona generation failed:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to generate personas. Please try again."
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
        <div
          role="alert"
          className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700"
        >
          {error}
        </div>
      )}

      {personas.length > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          {personas.length} personas available for research.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {personas.map((persona, index) => (
          <div
            key={persona.id ?? index}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900">
              {persona.name || `Persona ${index + 1}`}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {persona.age != null ? `${persona.age} years old` : "Age not specified"}
              {" · "}
              {persona.occupation || "Occupation not specified"}
            </p>

            <div className="mt-5">
              <h3 className="font-semibold text-gray-900">
                Personality
              </h3>
              <p className="mt-1 text-gray-600">
                {persona.personality || "Not available"}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">
                Behavioral Patterns
              </h3>
              <p className="mt-1 text-gray-600">
                {persona.behavioral_patterns || "Not available"}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">
                Psychological Profile
              </h3>
              <p className="mt-1 text-gray-600">
                {persona.psychological_profile || "Not available"}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">
                Goals
              </h3>
              <p className="mt-1 text-gray-600">
                {persona.goals || "Not available"}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-900">
                Pain Points
              </h3>
              <p className="mt-1 text-gray-600">
                {persona.pain_points || "Not available"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && personas.length === 0 && (
        <p className="mt-6 text-gray-500">
          No saved personas found. Click Generate Personas to create them.
        </p>
      )}
    </div>
  );
}

export default Personas;
