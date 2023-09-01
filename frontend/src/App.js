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
import Blog from './Pages/Blog';

// Bảo vệ Route
import ProtectRoutes from './Pages/ProtectRoutes'
import PageNotFound from './Pages/PageNotFound';


//Import Trang Admin
import ProtectRoutesAdmin from './Pages/ProtectRoutesAdmin';


import DashBoard from './Pages/Admin/PagesAdmin/Dashboard';
import Order from "./Pages/Admin/PagesAdmin/Order";


function App() {

  return (
    <>
      <Routes>
        {/* Client_Navbar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/verify_otp" element={<VerifyOTP />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/service_price" element={<ServicePrice />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />

        {/* Bảo vệ Route Client */}
        <Route element={<ProtectRoutes />}>
          {/* Trang User  */}
          <Route path="/userManage" element={<UserManage />} />
        </Route>


        {/* Bảo vệ Route Admin*/}
        <Route element={<ProtectRoutesAdmin />}>
          {/* Trang Admin  */}
            {/* Route With Item ComponentAdmin */}
              <Route path="/admin/dashboard" element={<DashBoard />}/>
              <Route path="/admin/order" element={<Order />}/>
            {/* End of Route */}
        </Route>
      
      
        {/* Trang không tìm thấy */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </>
  );
}

export default App;
