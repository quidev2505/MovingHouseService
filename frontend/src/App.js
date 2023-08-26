import './App.scss';
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home';
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import UserManage from './Pages/UserManage';
import ForgotPassword from './Pages/ForgotPassword';
import ChangePassword from './Pages/ChangePassword';
import VerifyOTP from './Pages/VerifyOTP';
import ServicePrice from './Pages/ServicePrice';
import Contact from './Pages/Contact';


function App() {
  return (
    <>
      <Routes>
        Client_Navbar
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/verify_otp" element={<VerifyOTP />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/service_price" element={<ServicePrice />} />
        <Route path="/contact" element={<Contact />} />
        
        <Route path="/userManage" element={<UserManage />} />
      </Routes>
    </>
  );
}

export default App;
