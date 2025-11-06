import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home.jsx';
import Signup from './pages/signup.jsx';
import Login from './pages/login.jsx';
import Verifyemail from './pages/verifyemail.jsx';
import Forgotpassword from './pages/forgotpassword.jsx';
import Resetpassword from './pages/resetpassword.jsx';
import Dashboard from './pages/dashboard.jsx';
import Changepassword from './pages/changepassword.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<Verifyemail />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change-password" element={<Changepassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
