import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/*" element={<AppRoutes />} />
      </Route>
    </Routes>
  );
};

export default App;
