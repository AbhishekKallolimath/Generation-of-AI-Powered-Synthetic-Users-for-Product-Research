import { useEffect, useState } from "react";
import api from "../services/api";

const scenarios = [
  {
    name: "FinWise",
    product:
      "FinWise - AI Financial Copilot for Irregular-Income Workers",
    target_audience:
      "Freelancers, creators, gig workers and independent professionals aged 22-40",
    objective:
      "Understand financial challenges and desired features",
    defaultQuestion:
      "What is your biggest financial challenge?",
  },
  {
    name: "StudyMate",
    product:
      "StudyMate - AI Study Assistant for College Students",
    target_audience:
      "College students aged 18-25",
    objective:
      "Understand study habits and challenges faced by students",
    defaultQuestion:
      "What is your biggest challenge while studying?",
  },
  {
    name: "FitTrack",
    product:
      "FitTrack - AI Fitness and Workout Assistant",
    target_audience:
      "Young adults aged 18-35 interested in fitness",
    objective:
      "Understand workout habits and fitness goals",
    defaultQuestion:
      "What is your biggest challenge in maintaining fitness?",
  },
];

function Surveys() {
  const [personas, setPersonas] = useState([]);
  const [question, setQuestion] = useState(
    scenarios[0].defaultQuestion
  );
  const [responses, setResponses] = useState([]);
  const [validationResults, setValidationResults] = useState([]);
  const [validating, setValidating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedScenario, setSelectedScenario] = useState(
    scenarios[0]
  );

  useEffect(() => {
    const savedPersonas = localStorage.getItem("finwise_personas");

    if (savedPersonas) {
      try {
        setPersonas(JSON.parse(savedPersonas));
      } catch (err) {
        console.error("Unable to read saved personas:", err);
      }
    }
  }, []);

  function handleScenarioChange(event) {
    const scenario = scenarios.find(
      (item) => item.name === event.target.value
    );

    if (!scenario) return;

    setSelectedScenario(scenario);
    setQuestion(scenario.defaultQuestion);
    setResponses([]);
    setValidationResults([]);
    setError("");
  }

  async function runSurvey(event) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Please enter a survey question.");
      return;
    }

    if (personas.length === 0) {
      setError(
        "Please generate personas from the Personas page first."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResponses([]);
    setValidationResults([]);

    try {
      const response = await api.post("/surveys/run", {
        product: selectedScenario.product,
        question,
        personas,
      });

      setResponses(response.data.responses);

localStorage.setItem(
  "survey_responses",
  JSON.stringify(response.data.responses)
);

localStorage.setItem(
  "survey_product",
  selectedScenario.product
);


    } catch (err) {
      console.error("Survey failed:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to generate survey responses."
      );
    } finally {
      setLoading(false);
    }
  }

  async function validateResponses() {
    if (responses.length === 0) {
      return;
    }

    setValidating(true);
    setError("");
    setValidationResults([]);

    try {
      const results = await Promise.all(
        responses.map(async (item) => {
          const persona = personas.find(
            (p) => p.name === item.persona_name
          );

          if (!persona) {
            throw new Error(
              `Persona not found: ${item.persona_name}`
            );
          }

          const response = await api.post(
            "/validation/validate",
            {
              product: selectedScenario.product,
              persona,
              question,
              response_text: item.response,
            }
          );

          return {
            ...response.data,
            persona_name: item.persona_name,
          };
        })
      );

      setValidationResults(results);
    } catch (err) {
      console.error("Validation failed:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to validate responses."
      );
    } finally {
      setValidating(false);
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Survey Mode
        </h1>

        <p className="mt-2 text-gray-600">
          Ask a question and compare responses from multiple
          synthetic personas.
        </p>
      </div>

      {/* Survey Form */}
      <form
        onSubmit={runSurvey}
        className="bg-white border border-gray-200 rounded-xl p-6 mb-8"
      >
        {/* Scenario */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Research Scenario
          </label>

          <select
            value={selectedScenario.name}
            onChange={handleScenarioChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {scenarios.map((scenario) => (
              <option
                key={scenario.name}
                value={scenario.name}
              >
                {scenario.name}
              </option>
            ))}
          </select>
        </div>

        {/* Scenario Information */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            Product
          </p>

          <p className="font-medium text-gray-900">
            {selectedScenario.product}
          </p>

          <p className="text-sm text-gray-500 mt-3">
            Target Audience
          </p>

          <p className="text-gray-700">
            {selectedScenario.target_audience}
          </p>

          <p className="text-sm text-gray-500 mt-3">
            Research Objective
          </p>

          <p className="text-gray-700">
            {selectedScenario.objective}
          </p>
        </div>

        {/* Question */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Survey Question
        </label>

        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows="3"
          placeholder="Enter your research question..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading
            ? "Generating Responses..."
            : "Run Survey"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* Ready Message */}
      {personas.length > 0 &&
        responses.length === 0 && (
          <div className="mb-6 text-sm text-gray-500">
            {personas.length} synthetic personas are ready
            for this survey.
          </div>
        )}

      {/* Responses */}
      {responses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Persona Responses
            </h2>

            <button
              onClick={validateResponses}
              disabled={validating}
              className="px-5 py-3 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 disabled:opacity-50"
            >
              {validating
                ? "Validating..."
                : "Validate Responses"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {responses.map((item, index) => {
              const validation = validationResults.find(
                (result) =>
                  result.persona_name === item.persona_name
              );

              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  {/* Persona */}
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.persona_name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.occupation}
                  </p>

                  {/* Response */}
                  <div className="mt-5">
                    <p className="text-sm font-medium text-gray-500">
                      Response
                    </p>

                    <p className="mt-2 text-gray-700 leading-relaxed">
                      {item.response}
                    </p>
                  </div>

                  {/* Validation */}
                  {validation && (
                    <div className="mt-6 pt-5 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900">
                        Validation
                      </h4>

                      <div className="mt-3 space-y-2 text-sm">
                        <p>
                          Consistency:{" "}
                          <span className="font-semibold">
                            {validation.consistency}
                          </span>
                        </p>

                        <p>
                          Realism:{" "}
                          <span className="font-semibold">
                            {validation.realism}
                          </span>
                        </p>
                      </div>

                      <div className="mt-4 space-y-3 text-sm text-gray-600">
                        <p>
                          <span className="font-medium text-gray-900">
                            Consistency reason:
                          </span>{" "}
                          {validation.consistency_reason}
                        </p>

                        <p>
                          <span className="font-medium text-gray-900">
                            Realism reason:
                          </span>{" "}
                          {validation.realism_reason}
                        </p>
                      </div>

                      {validation.issues?.length > 0 && (
                        <div className="mt-4 p-3 rounded-lg bg-red-50 text-sm text-red-700">
                          <span className="font-medium">
                            Issues:
                          </span>{" "}
                          {validation.issues.join(", ")}
                        </div>
                      )}

                      {validation.issues?.length === 0 && (
                        <div className="mt-4 p-3 rounded-lg bg-green-50 text-sm text-green-700">
                          No consistency or realism issues found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Personas */}
      {personas.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-yellow-800">
          Generate personas from the Personas page before
          running a survey.
        </div>
      )}
    </div>
  );
}

export default Surveys;