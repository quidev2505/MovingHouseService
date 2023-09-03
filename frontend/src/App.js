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

//Trang đăng nhập Admin
import LoginAdmin from "./Pages/Admin/PagesAdmin/LoginAdmin";

//Import danh mục Admin
import DashBoardAdmin from './Pages/Admin/PagesAdmin/DashboardAdmin';
import OrderAdmin from "./Pages/Admin/PagesAdmin/OrderAdmin";
import ItemContainerAdmin from './Pages/Admin/PagesAdmin/ItemContainerAdmin';
import GetquoteAdmin from './Pages/Admin/PagesAdmin/GetquoteAdmin';
import BlogAdmin from './Pages/Admin/PagesAdmin/BlogAdmin';
import DriverAdmin from './Pages/Admin/PagesAdmin/DriverAdmin';
import ServiceSupportAdmin from './Pages/Admin/PagesAdmin/ServiceSupportAdmin';
import AdministratorAdmin from './Pages/Admin/PagesAdmin/Administrator';
import ServiceAdmin from './Pages/Admin/PagesAdmin/ServiceAdmin';
import VehicleAdmin from './Pages/Admin/PagesAdmin/VehicleAdmin';

//Import trong Setting Admin
import ChangePasswordAdmin  from './Pages/Admin/PagesAdmin/ChangePasswordAdmin';

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


        {/* Trang đăng nhập dành cho quản trị viên */}
        <Route path="/admin/login" element={<LoginAdmin />} />


        {/* Bảo vệ Route Admin - Quản trị viên*/}
        <Route element={<ProtectRoutesAdmin />}>
          {/* Trang Admin  */}
          {/* Route With Item ComponentAdmin */}
          <Route path="/admin/dashboard" element={<DashBoardAdmin />} />
          <Route path="/admin/service" element={<ServiceAdmin />} />
          <Route path="/admin/vehicle" element={<VehicleAdmin />} />
          <Route path="/admin/blog" element={<BlogAdmin />} />
          <Route path="/admin/item_container" element={<ItemContainerAdmin />} />
          <Route path="/admin/get_quote" element={<GetquoteAdmin />} />
          <Route path="/admin/order" element={<OrderAdmin />} />
          <Route path="/admin/driver" element={<DriverAdmin />} />
          <Route path="/admin/service_support" element={<ServiceSupportAdmin />} />
          <Route path="/admin/administrator" element={<AdministratorAdmin />} />

          {/* In Setting Admin */}
          <Route path="/admin/change_password/:id" element={<ChangePasswordAdmin />} />

          {/* End of Route */}
        </Route>


        {/* Trang không tìm thấy */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </>
  );
}

export default App;
