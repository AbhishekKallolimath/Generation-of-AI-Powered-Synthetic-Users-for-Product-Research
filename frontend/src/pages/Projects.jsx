function Projects() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Research Projects
        </h1>

        <p className="mt-2 text-gray-600">
          Create and manage your product research projects.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900">
          No projects yet
        </h2>

        <p className="mt-2 text-gray-600">
          Create your first research project to start generating
          synthetic users.
        </p>

        <button className="mt-6 px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
          Create Project
        </button>
      </div>
    </div>
  );
}

export default Projects;