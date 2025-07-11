import { Chat } from "@/components/Chat";
import Login from "@/components/Login";
import { Profile } from "@/components/Profile";
import { Register } from "@/components/Register";
import { Routines } from "@/components/Routines";
import { Store } from "@/components/Store";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SuperuserRoute } from "@/components/ProtectedRoute";
import CRMRouter from "./CRMRouter";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/routines" element={
          <ProtectedRoute>
            <Routines />
          </ProtectedRoute>
        } />
        <Route path="/store" element={
          <ProtectedRoute>
            <Store />
          </ProtectedRoute>
        } />
        <Route path="/crm/*" element={
            <SuperuserRoute>
              <CRMRouter />
            </SuperuserRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
