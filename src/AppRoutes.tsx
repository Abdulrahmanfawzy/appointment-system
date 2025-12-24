import { Routes, Route } from "react-router-dom";
import Home from "./features/home/pages/Home";
import ContactUs from "./features/contact-us/components/pages/ContactUs";
import Chat from "./features/chat/components/pages/chat";
import Reviews from "./features/reviews/pages/Reviews";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="contact-us" element={<ContactUs />} />
      <Route path="chat" element={<Chat />} />
      <Route path="reviews" element={<Reviews />} />
    
    </Routes>
  );
};

export default AppRoutes;
