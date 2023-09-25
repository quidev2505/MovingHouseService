import './App.scss';

import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home';
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import ForgotPassword from './Pages/ForgotPassword';
import ChangePassword from './Pages/ChangePassword';
import VerifyOTP from './Pages/VerifyOTP';
import ServicePrice from './Pages/ServicePrice';
import Contact from './Pages/Contact';
import Blog from './Pages/Blog';
import BlogDetail from './Pages/BlogDetail';


//Trang quản lý User
import BookingUser from './Pages/User/PagesUser/Booking/BookingUser'
import OrderUser from './Pages/User/PagesUser/Order/OrderUser'
import DriverUser from './Pages/User/PagesUser/Driver/DriverUser'
import InfoUser from './Pages/User/PagesUser/Info/InfoUser';


// Bảo vệ Route
import ProtectRoutes from './Pages/ProtectRoutes'
import PageNotFound from './Pages/PageNotFound';


//Import Trang Admin
import ProtectRoutesAdmin from './Pages/ProtectRoutesAdmin';

//Trang đăng nhập Admin
import LoginAdmin from "./Pages/Admin/PagesAdmin/LoginAdmin";

//Import danh mục Admin
import DashBoardAdmin from './Pages/Admin/PagesAdmin/DashboardAdmin';
// import GetquoteAdmin from './Pages/Admin/PagesAdmin/GetquoteAdmin';

import ServiceSupportAdmin from './Pages/Admin/PagesAdmin/ServiceSupportAdmin';
import AdministratorAdmin from './Pages/Admin/PagesAdmin/Administrator';

// ServiceAdmin
import ServiceAdmin from './Pages/Admin/PagesAdmin/Service/ServiceAdmin';
import AddService from './Pages/Admin/PagesAdmin/Service/AddService';
import ViewService from './Pages/Admin/PagesAdmin/Service/ViewService';
import EditService from './Pages/Admin/PagesAdmin/Service/EditService';

//ServiceFeeAdmin
import ServiceFeeAdmin from './Pages/Admin/PagesAdmin/Service/ServiceFeeAdmin';
import AddServiceFee from './Pages/Admin/PagesAdmin/Service/AddServiceFee';
import EditServiceFee from './Pages/Admin/PagesAdmin/Service/EditServiceFee';

//VehicleAdmin
import VehicleAdmin from './Pages/Admin/PagesAdmin/Vehicle/VehicleAdmin';
import AddVehicle from './Pages/Admin/PagesAdmin/Vehicle/AddVehicle';
import EditVehicle from './Pages/Admin/PagesAdmin/Vehicle/EditVehicle';

//Blog Admin
import BlogAdmin from './Pages/Admin/PagesAdmin/Blog/BlogAdmin';
import AddBlog from './Pages/Admin/PagesAdmin/Blog/AddBlog';
import EditBlog from './Pages/Admin/PagesAdmin/Blog/EditBlog';

//Item Admin
import ItemAdmin from './Pages/Admin/PagesAdmin/Item/ItemAdmin';
import AddItem from './Pages/Admin/PagesAdmin/Item/AddItem';
import EditItem from './Pages/Admin/PagesAdmin/Item/EditItem';

//Order Admin
import OrderAdmin from "./Pages/Admin/PagesAdmin/Order/OrderAdmin";


//Driver Admin
import DriverAdmin from './Pages/Admin/PagesAdmin/Driver/DriverAdmin';
import AddDriver from './Pages/Admin/PagesAdmin/Driver/AddDriver';



//Import trong Setting Admin
import ChangePasswordAdmin from './Pages/Admin/PagesAdmin/ChangePasswordAdmin';




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
        <Route path="/blog-detail/" element={<BlogDetail />} />

        {/* Bảo vệ Route Client */}
        <Route element={<ProtectRoutes />}>
          {/* Trang User  */}
          <Route path="/user/booking" element={<BookingUser />} />
          <Route path="/user/order" element={<OrderUser />} />
          <Route path="/user/driver" element={<DriverUser />} />
          <Route path="/user/info_user" element={<InfoUser />} />
        </Route>


        {/* Trang đăng nhập dành cho quản trị viên */}
        <Route path="/admin/login" element={<LoginAdmin />} />


        {/* Bảo vệ Route Admin - Quản trị viên*/}
        <Route element={<ProtectRoutesAdmin />}>
          {/* Trang Admin  */}
          {/* Route With Item ComponentAdmin */}
          <Route path="/admin/dashboard" element={<DashBoardAdmin />} />

          {/* Service Admin CRUD */}
          <Route path="/admin/service" element={<ServiceAdmin />} />
          <Route path="/admin/service/add" element={<AddService />} />
          <Route path="/admin/service/view/:id" element={<ViewService />} />
          <Route path="/admin/service/edit/:id" element={<EditService />} />

          {/* Service_Fee Admin CRUD */}
          <Route path="/admin/service_fee" element={<ServiceFeeAdmin />} />
          <Route path="/admin/service_fee/add" element={<AddServiceFee />} />
          <Route path="/admin/service_fee/edit/:id" element={<EditServiceFee />} />
          {/* End Service_Fee Admin CRUD */}

          {/* End Service Admin CRUD */}

          {/* Vehicle_Admin CRUD */}
          <Route path="/admin/vehicle" element={<VehicleAdmin />} />
          <Route path="/admin/vehicle/add" element={<AddVehicle />} />
          <Route path="/admin/vehicle/edit/:id" element={<EditVehicle />} />
          {/* End  Vehicle_Admin CRUD */}


          {/* Blog Admin CRUD */}
          <Route path="/admin/blog" element={<BlogAdmin />} />
          <Route path="/admin/blog/add" element={<AddBlog />} />
          <Route path="/admin/blog/edit/:id" element={<EditBlog />} />
          {/* End Blog_Admin CRUD */}


          {/* Item Admin CRUD */}
          <Route path="/admin/item" element={<ItemAdmin />} />
          <Route path="/admin/item/add" element={<AddItem />} />
          <Route path="/admin/item/edit/:id" element={<EditItem />} />
          {/* End Item_Admin CRUD */}


          {/* Order Admin CRUD */}
          <Route path="/admin/order" element={<OrderAdmin />} />
          {/* End order admin CRUD */}

          {/* <Route path="/admin/get_quote" element={<GetquoteAdmin />} /> */}
        

          {/* Driver Admin CRUD */}
          <Route path="/admin/driver" element={<DriverAdmin />} />
          <Route path="/admin/driver/add" element={<AddDriver />} />
          {/* Driver Admin CRUD */}


        
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
