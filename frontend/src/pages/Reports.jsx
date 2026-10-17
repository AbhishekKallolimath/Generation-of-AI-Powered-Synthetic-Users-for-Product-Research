
import { useState } from "react";
import api from "../services/api";

function Reports() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const downloadReport = async () => {
    setLoading(true);
    setMessage("");

    try {
      const responses = JSON.parse(
        localStorage.getItem("survey_responses") || "[]"
      );

      const product =
        localStorage.getItem("survey_product") ||
        "FinWise - AI Financial Copilot";

      if (responses.length === 0) {
        setMessage("Please run a survey first so the report has research responses.");
        return;
      }

      const insightResponse = await api.post("/insights/analyze", {
        product,
        responses,
      });

      const reportResponse = await api.post(
        "/reports/generate",
        {
          product,
          personas: [],
          responses,
          insights: insightResponse.data,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([reportResponse.data], {
          type: "application/pdf",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "research_report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      setMessage("Your research report has been generated and downloaded.");
    } catch (error) {
      console.error("Report generation failed:", error);
      setMessage("Failed to generate the report. Check the backend terminal for errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">
        Research Reports
      </h1>

      <p className="text-gray-600 mb-6">
        Generate and download a PDF containing research responses,
        recurring themes, sentiment analysis, key quotes, and product
        validation results.
      </p>

      <div className="border rounded-xl p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">
          Synthetic User Research Report
        </h2>

        <p className="text-gray-600 mb-5">
          Product: FinWise - AI Financial Copilot
        </p>

        <button
          onClick={downloadReport}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Generating Report..." : "Generate & Download PDF"}
        </button>

        {message && (
          <p className="mt-4 text-sm" role="status">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Reports;
