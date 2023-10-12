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
      text: "",
    },
  },
};

function DashBoardAdmin() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCountOrder, setTotalCountOrder] = useState(0);
  const [totalCountDriver, setTotalCountDriver] = useState(0);
  const [totalCountCustomer, setTotalCountCustomer] = useState(0);

  const [filterDashBoard, setFilterDashBoard] = useState(
    "THỐNG KÊ DOANH THU THEO THÁNG"
  );

  const labels = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  //Lưu trữ mảng chứa doanh thu
  const [arrTotalOrder, setArrTotalOrder] = useState([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);

  //Dữ liệu biểu đồ
  const dataChart = {
    labels,
    datasets: [
      {
        label: "Tổng doanh thu tháng",
        data: arrTotalOrder,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  //Gọi hàm gọi API khởi tạo dữ liệu
  const get_dashboard_data = async () => {
    //Tính tổng doanh thu
    let call_api_order = await axios.get(`/v1/order/viewAllOrder`);
    let arr_order = call_api_order.data;

    //Xét xem chọn lọc theo gì
    switch (filterDashBoard) {
      case "THỐNG KÊ DOANH THU THEO THÁNG": {
        //Mảng chứa dữ liệu các tháng
        const arr_monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        //Tính doanh thu theo từng tháng
        arr_order.forEach((item, index) => {
          if (item.status === "Đã hoàn thành" && item.date_end !== null) {
            let split_month = item.date_end.split(",")[0].split("/")[1];
            arr_monthly[split_month - 1] += item.totalOrder;
          }
        });

        setArrTotalOrder(arr_monthly); //Đưa dữ liệu tháng vô biểu đồ
        break;
      }
      case "THỐNG KÊ DOANH THU THEO NĂM": {
        //Mảng chứa dữ liệu các tháng
        const arr_monthly = [1,23,455555];

        // //Tính doanh thu theo từng tháng
        // arr_order.forEach((item, index) => {
        //   if (item.status === "Đã hoàn thành" && item.date_end !== null) {
        //     let split_month = item.date_end.split(",")[0].split("/")[1];
        //     arr_monthly[split_month - 1] += item.totalOrder;
        //   }
        // });

        setArrTotalOrder(arr_monthly); //Đưa dữ liệu tháng vô biểu đồ
        break;
      }

      default: {
        alert("Không có loại lọc này");
      }
    }

    // Tỉnh tổng doanh thu
    let sum_all_order = arr_order.reduce((sum, a) => {
      if ((a.status = "Đã hoàn thành" && a.date_end !== null))
        return Number(sum + a.totalOrder);
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
  }, [filterDashBoard]);

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

            <div
              className="chart_dashboard"
              style={{
                backgroundColor: "white",
                padding: "10px",
                marginTop: "50px",
                borderRadius: "5px",
                boxShadow: "2px 2px 6px #ccc",
              }}
            >
              <h2
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#f16622",
                  marginTop: "10px",
                }}
              >
                {filterDashBoard}
              </h2>

              <div>
                <select
                  style={{
                    borderRadius: "5px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    color: "black",
                  }}
                  value={filterDashBoard}
                  onChange={(e) => setFilterDashBoard(e.target.value)}
                >
                  <option value="THỐNG KÊ DOANH THU THEO THÁNG">
                    THỐNG KÊ DOANH THU THEO THÁNG
                  </option>
                  <option value="THỐNG KÊ DOANH THU THEO NĂM">
                    THỐNG KÊ DOANH THU THEO NĂM
                  </option>
                </select>
              </div>
              <Bar options={options} data={dataChart} />
            </div>
          </TopCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default DashBoardAdmin;
