import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function NewProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    product_description: "",
    target_audience: "",
    research_objectives: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/projects/", formData);

      console.log("Project created:", response.data);

      navigate("/projects");
    } catch (err) {
      console.error("Project creation failed:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to create the project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create Research Project
        </h1>

        <p className="mt-2 text-gray-600">
          Define your product, target audience, and research objectives
          before generating synthetic users.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-8"
      >
        <div className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. FinWise User Research"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>

            <textarea
              name="product_description"
              value={formData.product_description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe the product, its purpose, and the problem it solves..."
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>

            <textarea
              name="target_audience"
              value={formData.target_audience}
              onChange={handleChange}
              rows="4"
              placeholder="Describe your target users..."
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Objectives
            </label>

            <textarea
              name="research_objectives"
              value={formData.research_objectives}
              onChange={handleChange}
              rows="4"
              placeholder="What do you want to learn from the synthetic users?"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Project..." : "Create Research Project"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

export default NewProject;