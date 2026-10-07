import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import Personas from "./pages/Personas";
import Surveys from "./pages/Surveys";
import Interviews from "./pages/Interviews";
import Insights from "./pages/Insights";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<DashboardLayout />}>

          <Route path="/" element={<Dashboard />} />

          <Route path="/projects" element={<Projects />} />

          <Route
            path="/projects/new"
            element={<NewProject />}
          />

          <Route
            path="/personas"
            element={<Personas />}
          />

          <Route
            path="/surveys"
            element={<Surveys />}
          />

          <Route
            path="/interviews"
            element={<Interviews />}
          />

          <Route
            path="/insights"
            element={<Insights />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;