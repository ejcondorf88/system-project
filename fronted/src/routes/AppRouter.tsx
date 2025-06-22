import { Chat } from "@/components/Chat";
import Login from "@/components/Login";
import { Profile } from "@/components/Profile";
import { Register } from "@/components/Register";
import { Routines } from "@/components/Routines";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element= {<Chat/>}/>
        <Route path="/profile" element= {<Profile/>}/>
        <Route path="/routines" element= {<Routines/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
