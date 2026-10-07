import { useState } from "react";
import api from "../services/api";

function Insights() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);

  const analyzeInsights = async () => {
    setLoading(true);

    try {
      const responses = JSON.parse(
        localStorage.getItem("survey_responses") || "[]"
      );

      if (responses.length === 0) {
        alert("Please run a survey first.");
        setLoading(false);
        return;
      }

      const response = await api.post("/insights/analyze", {
        product:
  localStorage.getItem("survey_product") ||
  "FinWise - AI Financial Copilot",
        responses: responses,
      });

      setInsights(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        Insight Extraction
      </h1>

      <p className="text-gray-600 mb-6">
        Analyze research responses and identify important product insights.
      </p>

      <button
        onClick={analyzeInsights}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-3 rounded-lg mb-6"
      >
        {loading ? "Analyzing..." : "Generate Insights"}
      </button>

      {insights && (
        <div className="space-y-6">

          <div className="border rounded-lg p-5">
            <h2 className="text-xl font-bold mb-3">
              Recurring Themes
            </h2>

            <ul className="list-disc ml-5">
              {insights.themes.map((theme, index) => (
                <li key={index}>{theme}</li>
              ))}
            </ul>
          </div>

          <div className="border rounded-lg p-5">
            <h2 className="text-xl font-bold mb-3">
              Sentiment Breakdown
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-100 rounded-lg">
                <p className="font-semibold">Positive</p>
                <p className="text-2xl font-bold">
                  {insights.sentiment.positive}
                </p>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="font-semibold">Neutral</p>
                <p className="text-2xl font-bold">
                  {insights.sentiment.neutral}
                </p>
              </div>

              <div className="p-4 bg-red-100 rounded-lg">
                <p className="font-semibold">Negative</p>
                <p className="text-2xl font-bold">
                  {insights.sentiment.negative}
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-5">
            <h2 className="text-xl font-bold mb-3">
              Agreement Patterns
            </h2>

            <ul className="list-disc ml-5">
              {insights.agreement_patterns.map((pattern, index) => (
                <li key={index}>{pattern}</li>
              ))}
            </ul>
          </div>

          <div className="border rounded-lg p-5">
            <h2 className="text-xl font-bold mb-3">
              Behavioral Trends
            </h2>

            <ul className="list-disc ml-5">
              {insights.behavioral_trends.map((trend, index) => (
                <li key={index}>{trend}</li>
              ))}
            </ul>
          </div>

          <div className="border rounded-lg p-5">
            <h2 className="text-xl font-bold mb-3">
              Would Use This Product?
            </h2>

            <p className="text-4xl font-bold text-blue-600 mb-3">
              {insights.would_use_score}%
            </p>

            <h3 className="font-semibold mb-2">
              Reasoning
            </h3>

            <ul className="list-disc ml-5">
              {insights.would_use_reasoning.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}

export default Insights;