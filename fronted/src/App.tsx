import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  EnhancedGymLogin  from '@/components/Login';
import { Register } from '@/components/Register';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<EnhancedGymLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
