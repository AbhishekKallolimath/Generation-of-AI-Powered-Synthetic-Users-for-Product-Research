import { useState } from "react";
import api from "../services/api";




function Insights() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);

  const downloadReport = async () => {
    setReportLoading(true);

    try {
      const responses = JSON.parse(
        localStorage.getItem("survey_responses") || "[]"
      );

      const product =
        localStorage.getItem("survey_product") ||
        "FinWise - AI Financial Copilot";

      if (responses.length === 0) {
        alert("Please run a survey before generating the report.");
        return;
      }

      // Generate insights if they are not already available.
      let reportInsights = insights;

      if (!reportInsights) {
        const insightResponse = await api.post("/insights/analyze", {
          product,
          responses,
        });

        reportInsights = insightResponse.data;
        setInsights(reportInsights);
      }

      const reportResponse = await api.post(
        "/reports/generate",
        {
          product,
          personas: [],
          responses,
          insights: reportInsights,
        },
        {
          responseType: "blob",
        }
      );

      const pdfUrl = window.URL.createObjectURL(
        new Blob([reportResponse.data], {
          type: "application/pdf",
        })
      );

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "research_report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Failed to generate the report. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

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


      <button
        onClick={downloadReport}
        disabled={reportLoading || loading}
        className="bg-green-600 text-white px-5 py-3 rounded-lg mb-6 ml-3 disabled:opacity-50"
      >
        {reportLoading ? "Generating PDF..." : "Download Research Report"}
      </button>


      {insights && (
        <div className="space-y-6">

          
          <div className="border rounded-lg p-5">
            <h2 className="text-xl font-bold mb-3">
              Recurring Themes
            </h2>

            <div className="space-y-4">
              {insights.themes.map((theme, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-semibold">
                      {theme.name}
                    </h3>

                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full whitespace-nowrap">
                      {theme.mentions} mentions
                    </span>
                  </div>

                  <p className="text-gray-600 mt-2">
                    {theme.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-5">
            <h2 className="text-xl font-bold mb-3">
              Key Persona Quotes
            </h2>

            <div className="space-y-4">
              {(insights.key_quotes || []).map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <p className="italic text-gray-700">
                    "{item.quote}"
                  </p>

                  <p className="font-semibold mt-2">
                    {item.persona_name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Theme: {item.theme}
                  </p>
                </div>
              ))}

              {(!insights.key_quotes ||
                insights.key_quotes.length === 0) && (
                <p className="text-gray-500">
                  No key quotes available.
                </p>
              )}
            </div>
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
            <h2 className="text-xl font-bold mb-2">
              Product Validation Score
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              AI-estimated interest based on the supplied research responses.
              This is not a measure of actual market demand.
            </p>

            <div className="flex items-center gap-5 mb-5">
              <div className="relative w-28 h-28 shrink-0">
                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full -rotate-90"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />

                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(Math.max(0, Math.min(100, insights.would_use_score || 0)) / 100) * 301.59} 301.59`}
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {insights.would_use_score}%
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Estimated Interest
                </h3>

                <p className="text-gray-600 text-sm">
                  Based on the responses analyzed by the AI insight agent.
                </p>
              </div>
            </div>

            <h3 className="font-semibold mb-2">
              Supporting Reasoning
            </h3>

            <ul className="list-disc ml-5 space-y-2">
              {(insights.would_use_reasoning || []).map((reason, index) => (
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