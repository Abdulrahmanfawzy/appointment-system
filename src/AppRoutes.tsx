import { Routes, Route } from "react-router-dom";
import Home from "./features/home/pages/Home";
import ContactUs from "./features/contact-us/components/pages/ContactUs";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="contact-us" element={<ContactUs />} />
    </Routes>
  );
};

export default AppRoutes;
