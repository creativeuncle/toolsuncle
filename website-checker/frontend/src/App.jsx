import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/report/:id" element={<Report />} />
    </Routes>
  );
}

export default App;
