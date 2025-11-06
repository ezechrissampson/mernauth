import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Adminlogin from './pages/adminlogin';
import Dashboard from './pages/dashboard';
import Changepin from './pages/changepin';
import Profile from './pages/profile';


const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Adminlogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/change-pin" element={<Changepin />} />
        <Route path="/admin/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
