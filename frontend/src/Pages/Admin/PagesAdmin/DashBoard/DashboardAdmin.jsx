import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";
import TopCssContent from "../TopCssContent";

import axios from "axios";

import {
  FaMoneyCheckDollar,
  FaTruckFront,
  FaUserTie,
  FaBuildingUser,
} from "react-icons/fa6";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import faker from "faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: 500,
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

function DashBoardAdmin() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCountOrder, setTotalCountOrder] = useState(0);
  const [totalCountDriver, setTotalCountDriver] = useState(0);
  const [totalCountCustomer, setTotalCountCustomer] = useState(0);

  //Gọi hàm gọi API khởi tạo dữ liệu
  const get_dashboard_data = async () => {
    //Tính tổng doanh thu
    let call_api_order = await axios.get(`/v1/order/viewAllOrder`);
    let arr_order = call_api_order.data;

    // Tỉnh tổng doanh thu
    let sum_all_order = arr_order.reduce((sum, a) => {
      if ((a.status = "Đã hoàn thành")) return Number(sum + a.totalOrder);
      return sum;
    }, 0);

    setTotalRevenue(sum_all_order);

    //Tính tổng số đơn hàng
    setTotalCountOrder(arr_order.length);

    //Tính tổng số tài xế
    let call_api_driver = await axios.get(`/v1/driver/show_all_driver`);
    let arr_driver = call_api_driver.data;
    setTotalCountDriver(arr_driver.length);

    //Tính tổng số khách hàng
    let call_api_customer = await axios.get(`/v1/customer/get_all_customer`);
    let arr_customer = call_api_customer.data;
    setTotalCountCustomer(arr_customer.length);
  };

  //Khởi tạo khi chạy lại Web
  useEffect(() => {
    get_dashboard_data();
  });
  return (
    <>
      <LayoutAdmin>
        <div className="dash_board_admin">
          <TopCssContent>
            <div
              className="top_dashboard d-flex row"
              style={{
                justifyContent: "space-between",
              }}
            >
              <div
                className="item_top_dashboard d-flex col"
                style={{
                  justifyContent: "space-between",
                }}
              >
                <div className="icon_top_dashboard">
                  <FaMoneyCheckDollar></FaMoneyCheckDollar>
                </div>

                <div
                  className="content_top_dashboard"
                  style={{ padding: "10px" }}
                >
                  {/* Tính tổng doanh thu */}
                  <p>{totalRevenue.toLocaleString()} đ</p>
                  <p>Tổng doanh thu</p>
                </div>
              </div>

              <div
                className="item_top_dashboard d-flex col"
                style={{
                  justifyContent: "space-between",
                  backgroundColor: "#4ab89f",
                }}
              >
                <div className="icon_top_dashboard">
                  <FaTruckFront></FaTruckFront>
                </div>
                <div
                  className="content_top_dashboard"
                  style={{ padding: "10px" }}
                >
                  <p style={{ textAlign: "right" }}>{totalCountOrder}</p>
                  <p>Tổng số đơn hàng</p>
                </div>
              </div>

              <div
                className="item_top_dashboard d-flex col"
                style={{
                  justifyContent: "space-between",
                  backgroundColor: "#3396c5",
                }}
              >
                <div className="icon_top_dashboard">
                  <FaUserTie></FaUserTie>
                </div>
                <div
                  className="content_top_dashboard"
                  style={{ padding: "10px" }}
                >
                  <p style={{ textAlign: "right" }}>{totalCountDriver}</p>
                  <p>Tài xế</p>
                </div>
              </div>

              <div
                className="item_top_dashboard d-flex col"
                style={{
                  justifyContent: "space-between",
                  backgroundColor: "#dbd956",
                }}
              >
                <div className="icon_top_dashboard">
                  <FaBuildingUser></FaBuildingUser>
                </div>
                <div
                  className="content_top_dashboard"
                  style={{ padding: "10px" }}
                >
                  <p style={{ textAlign: "right" }}>{totalCountCustomer}</p>
                  <p>Khách hàng</p>
                </div>
              </div>
            </div>

            <div className="chart_dashboard">
              <Bar options={options} data={data} />;
            </div>
          </TopCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default DashBoardAdmin;
