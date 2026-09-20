function NewProject() {
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

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>

            <input
              type="text"
              placeholder="e.g. FinWise User Research"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>

            <textarea
              rows="5"
              placeholder="Describe the product, its purpose, and the problem it solves..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>

            <textarea
              rows="4"
              placeholder="Describe your target users, their age group, occupation, lifestyle, or other relevant characteristics..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Objectives
            </label>

            <textarea
              rows="4"
              placeholder="What do you want to learn from the synthetic users?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800"
            >
              Create Research Project
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default NewProject;