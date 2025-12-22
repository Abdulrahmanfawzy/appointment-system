import { Routes, Route } from "react-router-dom";
import Home from "./features/home/pages/Home";
import ContactUs from "./features/contact-us/components/pages/ContactUs";
import Chat from "./features/chat/components/pages/chat";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="contact-us" element={<ContactUs />} />
      <Route path="chat" element={<Chat />} /> {/* Removed the leading slash */}
    </Routes>
  );
};

export default AppRoutes;