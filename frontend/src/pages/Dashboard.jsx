function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to FinWise
        </h1>

        <p className="mt-2 text-gray-600">
          Generate synthetic users and simulate product research with AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Projects</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Personas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Surveys</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Insights</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Start your research
        </h2>

        <p className="mt-2 text-gray-600">
          Create a project for FinWise, define your target market,
          and generate AI-powered synthetic personas.
        </p>

        <button className="mt-6 px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
          Create Research Project
        </button>
      </div>
    </div>
  );
}

export default Dashboard;