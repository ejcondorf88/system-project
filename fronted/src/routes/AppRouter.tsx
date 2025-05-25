import { Login } from "@/components/Login";
import { Register } from "@/components/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
