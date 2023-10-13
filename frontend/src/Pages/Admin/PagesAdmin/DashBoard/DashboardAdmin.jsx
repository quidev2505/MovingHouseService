import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";
import TopCssContent from "../TopCssContent";
import { Pie } from "react-chartjs-2";

import { EyeFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { StarFilled } from "@ant-design/icons";

import axios from "axios";
import { Image, Table, Avatar } from "antd";
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
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

export const options_pie = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "",
    },
  },
};

function DashBoardAdmin() {
  const [isActive, setIsActive] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCountOrder, setTotalCountOrder] = useState(0);
  const [totalCountDriver, setTotalCountDriver] = useState(0);
  const [totalCountCustomer, setTotalCountCustomer] = useState(0);

  const nav = useNavigate();

  const [filterDashBoard, setFilterDashBoard] = useState(
    "THỐNG KÊ DOANH THU THEO THÁNG"
  );

  const [yearFilter, setYearFilter] = useState("2023");

  //Lọc theo tên tài xế
  const [driverNameFilter, setDriverNameFilter] = useState("Tất cả");

  const [driverNameDropDown, setDriverNameDropDown] = useState([]);

  //Lọc theo tên khách hàng
  const [customerNameFilter, setCustomerNameFilter] = useState("Tất cả");

  const [customerNameDropDown, setCustomerNameDropDown] = useState([]);

  //Lọc theo loại dịch vụ
  const [serviceNameFilter, setServiceNameFilter] = useState("Tất cả");
  const [serviceNameDropDown, setServiceNameDropDown] = useState([]);

  //DỮ LIỆU THỐNG KÊ THEO THÁNG
  const labels =
    filterDashBoard === "THỐNG KÊ DOANH THU THEO THÁNG"
      ? [
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
        ]
      : ["Năm 2021", "Năm 2022", "Năm 2023"];

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

  //DỮ LIỆU THỐNG KÊ THEO NĂM
  const labels_year = ["Năm 2021", "Năm 2022", "Năm 2023"];

  //Lưu trữ mảng chứa doanh thu
  const [arrTotalOrderYear, setArrTotalOrderYear] = useState([0, 0, 0]);

  //Dữ liệu biểu đồ năm
  const dataChartYear = {
    labels,
    datasets: [
      {
        label: "Tổng doanh thu năm",
        data: arrTotalOrderYear,
        backgroundColor: "rgba(227,186,133,0.5)",
      },
    ],
  };

  const [arrayOrderType, setArrOrderType] = useState([0, 0, 0, 0, 0]);
  //Thống kê đơn hàng
  const dataPieOrder = {
    labels: [
      "ĐÃ HỦY",
      "ĐANG TÌM TÀI XẾ",
      "ĐANG THỰC HIỆN",
      "THANH TOÁN HÓA ĐƠN",
      "ĐÃ HOÀN THÀNH",
    ],
    datasets: [
      {
        label: "Thống kê số đơn hàng theo trạng thái",
        data: arrayOrderType,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  //Mảng tên tài xế
  const [labelDriver, setLabelDriver] = useState([]);

  //Tổng số đơn hàng đã giao
  const [sumTotalDelivery, setSumTotalDelivery] = useState([]);

  //Tổng số lượt đánh giá
  const [sumTotalRating, setSumTotalRating] = useState([]);

  //Dữ liệu biểu đồ tài xế
  const dataDriver = {
    labels: labelDriver,
    datasets: [
      {
        label: "Tổng số đơn hàng đã giao",
        data: sumTotalDelivery,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Tổng số lượt đánh giá",
        data: sumTotalRating,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  //Mảng tên khách hàng
  const [labelCustomer, setLabelCustomer] = useState([]);

  //Tổng số đơn hàng đã giao
  const [sumOrderComplete, setsumOrderComplete] = useState([]);

  //Tổng số đơn đã hủy
  const [sumOrderCancel, setsumOrderCancel] = useState([]);

  //Dữ liệu biểu đồ khách hàng
  const dataCustomer = {
    labels: labelCustomer,
    datasets: [
      {
        label: "Số đơn giao thành công",
        data: sumOrderComplete,
        backgroundColor: "green",
      },
      {
        label: "Số đơn đã hủy",
        data: sumOrderCancel,
        backgroundColor: "red",
      },
    ],
  };

  //Gọi hàm gọi API khởi tạo dữ liệu
  const get_dashboard_data = async () => {
    setIsActive(true);
    //Lấy dữ liệu dịch vụ
    var call_api_service = await axios.get(`/v1/service//list_service`);
    var name_service = call_api_service.data;
    const arr_service = name_service.map((item, index) => {
      return item.name;
    });

    setServiceNameDropDown(arr_service);

    //Tính tổng doanh thu
    var call_api_order = await axios.get(`/v1/order/viewAllOrder`);
    var arr_order = call_api_order.data;

    //Tính tổng số tài xế
    let call_api_driver = await axios.get(`/v1/driver/show_all_driver`);
    let arr_driver = call_api_driver.data;
    setTotalCountDriver(arr_driver.length);

    //Tính tổng số khách hàng
    let call_api_customer = await axios.get(`/v1/customer/get_all_customer`);
    let arr_customer = call_api_customer.data;
    setTotalCountCustomer(arr_customer.length);

    //Xét xem chọn lọc theo gì
    switch (filterDashBoard) {
      case "THỐNG KÊ DOANH THU THEO THÁNG": {
        //Mảng chứa dữ liệu các tháng
        const arr_monthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        //Tính doanh thu theo từng tháng
        arr_order.forEach((item, index) => {
          if (item.status === "Đã hoàn thành" && item.date_end !== null) {
            let year_split = item.date_end.split(",")[0].split("/")[2];
            if (year_split === yearFilter) {
              let split_month = item.date_end.split(",")[0].split("/")[1];
              arr_monthly[split_month - 1] += item.totalOrder;
            }
          }
        });

        setArrTotalOrder(arr_monthly); //Đưa dữ liệu tháng vô biểu đồ
        break;
      }
      case "THỐNG KÊ DOANH THU THEO NĂM": {
        //Mảng chứa dữ liệu các năm (3 năm)
        const arr_year = [0, 0, 0];

        //Tính doanh thu theo từng năm
        arr_order.forEach((item, index) => {
          if (item.status === "Đã hoàn thành" && item.date_end !== null) {
            let split_year = item.date_end.split(",")[0].split("/")[2];
            console.log(split_year);
            arr_year[split_year.split("")[3] - 1] += item.totalOrder;
          }
        });

        setArrTotalOrderYear(arr_year); //Đưa dữ liệu năm vô biểu đồ
        break;
      }
      case "THỐNG KÊ ĐƠN HÀNG": {
        //Mảng chứa dữ liệu các năm (3 năm)
        const arr_sum_order_type = [0, 0, 0, 0, 0];

        //Tính doanh thu theo từng năm
        arr_order.forEach((item, index) => {
          if (serviceNameFilter === "Tất cả") {
            let status_order = item.status;
            let index_check = 0;
            switch (status_order) {
              case "Đã hủy": {
                index_check = 0;
                break;
              }
              case "Đang tìm tài xế": {
                index_check = 1;
                break;
              }
              case "Đang thực hiện": {
                index_check = 2;
                break;
              }
              case "Thanh toán hóa đơn": {
                index_check = 3;
                break;
              }
              case "Đã hoàn thành": {
                index_check = 4;
                break;
              }
              default: {
                alert("no case for this !");
                break;
              }
            }
            arr_sum_order_type[index_check] += 1;
          } else if (item.service_name === serviceNameFilter) {
            let status_order = item.status;
            let index_check = 0;
            switch (status_order) {
              case "Đã hủy": {
                index_check = 0;
                break;
              }
              case "Đang tìm tài xế": {
                index_check = 1;
                break;
              }
              case "Đang thực hiện": {
                index_check = 2;
                break;
              }
              case "Thanh toán hóa đơn": {
                index_check = 3;
                break;
              }
              case "Đã hoàn thành": {
                index_check = 4;
                break;
              }
              default: {
                alert("no case for this !");
                break;
              }
            }
            arr_sum_order_type[index_check] += 1;
          }
        });

        //Bỏ vô biểu đồ tròn
        setArrOrderType(arr_sum_order_type);
        break;
      }
      case "THỐNG KÊ TÀI XẾ": {
        //Tổng số đơn hàng đã vận chuyển
        const sumTotalDelivery = [];
        //Tổng số lượt đánh giá
        const sumTotalRating = [];
        //Tên tài xế
        const driverName = [];

        //Tên tài xếp dropdown
        const drivernameDropdown = [];
        arr_driver.forEach((item, index) => {
          drivernameDropdown.push(item.fullname);
        });

        setDriverNameDropDown(drivernameDropdown);

        arr_driver.forEach((item, index) => {
          if (driverNameFilter === "Tất cả") {
            driverName.push(item.fullname);
            sumTotalDelivery.push(item.id_rating.length);
            sumTotalRating.push(item.id_delivery.length);
          } else if (driverNameFilter === item.fullname) {
            driverName.push(item.fullname);
            sumTotalDelivery.push(item.id_rating.length);
            sumTotalRating.push(item.id_delivery.length);
          }
        });

        setLabelDriver(driverName);
        setSumTotalDelivery(sumTotalDelivery);
        setSumTotalRating(sumTotalRating);

        break;
      }
      case "THỐNG KÊ KHÁCH HÀNG": {
        //Tổng số đơn hàng đã giao thành công
        const sumOrderComplete = [];
        //Tổng số đơn hàng đã hủy
        const sumOrderCancel = [];
        //Tên khách hàng
        const customerName = [];

        //Tên khách hàng dropdown
        const customerNameDropDown = [];
        arr_customer.forEach((item, index) => {
          customerNameDropDown.push(item.fullname);
        });

        setCustomerNameDropDown(customerNameDropDown);

        const arr_id_customer = [];
        //Liệt kê tên khách hàng
        arr_customer.forEach((item, index) => {
          if (customerNameFilter === "Tất cả") {
            customerName.push(item.fullname);
            arr_id_customer.push(item._id);
          } else if (customerNameFilter === item.fullname) {
            customerName.push(item.fullname);
            arr_id_customer.push(item._id);
          }
        });

        setLabelCustomer(customerName);

        //Xử lí tính tổng số đơn theo từng khách hàng
        arr_id_customer.forEach((item, index) => {
          let id_customer = item;
          let sum_order_complete = 0;
          let sum_order_cancel = 0;
          arr_order.forEach((item1, index) => {
            //Tính tổng đơn giao hoàn thành
            if (item1.status === "Đã hoàn thành") {
              if (item1.customer_id === id_customer) {
                sum_order_complete++;
              }
            } else if (item1.status === "Đã hủy") {
              //Tổng số đơn đã hủy
              if (item1.customer_id === id_customer) {
                sum_order_cancel++;
              }
            }
          });

          sumOrderComplete.push(sum_order_complete);
          sumOrderCancel.push(sum_order_cancel);
        });

        setsumOrderComplete(sumOrderComplete);
        setsumOrderCancel(sumOrderCancel);

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

    setIsActive(false);
  };

  const [arrServiceRank, setArrServiceRank] = useState([]);
  //Bảng xếp hàng doanh thu dịch vụ
  const service_total_rank = async () => {
    const api_get_order = await axios.get(`/v1/order/viewAllOrder`);
    const dataOrder = api_get_order.data;

    //Lấy ra tất cả dịch vụ
    //Lấy dữ liệu dịch vụ
    var call_api_service = await axios.get(`/v1/service/list_service`);
    var name_service = call_api_service.data;
    const arr_service = name_service.map((item, index) => {
      return item.name;
    });

    //Xử dụng mảng dịch vụ chạy ra tổng doanh thu theo từng loại dịch vụ
    let arr_sum_service_totalOrder = [];
    arr_service.forEach((item, index) => {
      let sum = 0;
      dataOrder.forEach((item1, index) => {
        if (item1.status === "Đã hoàn thành" && item1.service_name === item) {
          sum += item1.totalOrder;
        }
      });
      arr_sum_service_totalOrder.push(sum);
    });

    //Đưa Object vào mảng
    const arr_total_order_service = arr_sum_service_totalOrder.map(
      (item, index) => {
        const ob = {
          image: name_service[index].image,
          name: name_service[index].name,
          total: item,
        };

        return ob;
      }
    );

    // Sắp xếp mảng theo giá giảm dần
    arr_total_order_service.sort((a, b) => b.total - a.total);

    const arr_final = arr_total_order_service.map((item, index) => {
      item.stt = index + 1;
      return item;
    });

    setArrServiceRank(arr_final);
  };

  //Bảng xếp hạng doanh thu dịch vụ
  const columns_Service = [
    {
      title: "Xếp hạng",
      dataIndex: "stt",
      key: "stt",
      render: (stt) => (
        <td
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              backgroundColor:
                stt == 1
                  ? "green"
                  : stt == 2
                  ? "red"
                  : stt == 3
                  ? "#7bd6e5"
                  : "grey",
              color: "white",
              borderRadius: "50%",
              height: "50px",
              width: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {stt}
          </p>
        </td>
      ),
      align: "center",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <td>
          <p style={{ color: "#1e95ff", fontWeight: "bold" }}>{name}</p>
        </td>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <td>
          <Image width={80} src={image} />
        </td>
      ),
    },
    {
      title: "Doanh thu",
      dataIndex: "total",
      key: "total",
      render: (total) => (
        <td>
          <p style={{ color: "#f1c82d" }}>{total.toLocaleString()} đ</p>
        </td>
      ),
    },
  ];

  const [arrDriverRank, setArrDriverRank] = useState([]);

  //Bảng xếp hạng đánh giá tài xế
  const driver_rating_rank = async () => {
    const api_get_driver = await axios.get(`/v1/driver/show_all_driver`);
    const dataDriver = api_get_driver.data;

    //Đưa Object vào mảng
    const arr_total_order_service = dataDriver.map((item, index) => {
      const ob = {
        profile_code: item.profile_code,
        avatar: item.avatar,
        fullname: item.fullname,
        rating: item.id_rating.length,
        star_average: item.star_average,
      };

      return ob;
    });

    // Sắp xếp mảng theo giá giảm dần
    arr_total_order_service.sort((a, b) => b.star_average - a.star_average);

    const arr_final = arr_total_order_service.map((item, index) => {
      item.stt = index + 1;
      return item;
    });

    console.log(arr_final);
    setArrDriverRank(arr_final);
  };

  //Bảng xếp hạng đánh giá tài xế
  const columns_Driver = [
    {
      title: "Xếp hạng",
      dataIndex: "stt",
      key: "stt",
      render: (stt) => (
        <td
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              backgroundColor:
                stt == 1
                  ? "green"
                  : stt == 2
                  ? "red"
                  : stt == 3
                  ? "#7bd6e5"
                  : "grey",
              color: "white",
              borderRadius: "50%",
              height: "50px",
              width: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {stt}
          </p>
        </td>
      ),
      align: "center",
    },
    {
      title: "Mã hồ sơ",
      dataIndex: "profile_code",
      key: "profile_code",
    },
    {
      title: "Tài xế",
      dataIndex: "fullname",
      key: "fullname",
      render: (fullname, avatar) => (
        <td className="d-flex">
          <Avatar src={<img src={avatar.avatar} alt="avatar" />} />
          <p style={{ color: "#559aff", marginLeft: "10px" }}>{fullname}</p>
        </td>
      ),
    },
    {
      title: "Lượt đánh giá",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Sao trung bình",
      dataIndex: "star_average",
      key: "star_average",
      render: (star_average) => (
        <td className="d-flex" style={{ alignItems: "center" }}>
          {star_average}&nbsp;
          <StarFilled style={{ color: "#f1a062" }} />
        </td>
      ),
    },
  ];

  const [arrCustomerRank, setArrCustomerRank] = useState([]);

  //Bảng xếp hạng thanh toán khách hàng
  const customer_payment_rank = async () => {
    //Lấy ra dữ liệu toàn bộ đơn hàng "đã thanh toán"
    const api_get_order = await axios.get(`/v1/order/viewAllOrder`);
    const dataOrder = api_get_order.data;

    const arr_customerID = [];
    dataOrder.map((item, index) => {
      if (item.status === "Đã hoàn thành") {
        arr_customerID.push(item.customer_id);
      }
    });

    const arr_not_duplicated = arr_customerID.filter(
      (el, i) => arr_customerID.indexOf(el, i + 1) === -1
    );

    // //Lấy ra dữ liệu khách hàng
    const customer_data = await Promise.all(
      arr_not_duplicated.map(async (item, index) => {
        const customer_data_get = await axios.get(
          `/v1/customer/get_customer_with_id/${item}`
        );
        const data_customer = customer_data_get.data;
        const ob = {
          fullname: data_customer.fullname,
          avatar: data_customer.avatar,
          address: data_customer.address,
        };

        return ob;
      })
    );

    //Tính tổng đơn hàng đã bỏ ra của khách hàng
    const totalOrder_item = arr_not_duplicated.map((item, index) => {
      let sum = 0;
      dataOrder.forEach((item1, index) => {
        if (item1.customer_id === item && item1.status === "Đã hoàn thành") {
          sum += item1.totalOrder;
        }
      });

      return sum;
    });

    //Đưa Object vào mảng
    const arr_total_customer = customer_data.map((item, index) => {
      const ob = {
        fullname: item.fullname,
        avatar: item.avatar,
        address: item.address,
        totalOrder: totalOrder_item[index],
      };

      return ob;
    });

    // Sắp xếp mảng theo giá giảm dần
    arr_total_customer.sort((a, b) => b.totalOrder - a.totalOrder);

    const arr_final = arr_total_customer.map((item, index) => {
      item.stt = index + 1;
      return item;
    });

    setArrCustomerRank(arr_final);
  };

  //Bảng xếp hạng đánh giá khách hàng
  const columns_Customer = [
    {
      title: "Xếp hạng",
      dataIndex: "stt",
      key: "stt",
      render: (stt) => (
        <td
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              backgroundColor:
                stt == 1
                  ? "green"
                  : stt == 2
                  ? "red"
                  : stt == 3
                  ? "#7bd6e5"
                  : "grey",
              color: "white",
              borderRadius: "50%",
              height: "50px",
              width: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {stt}
          </p>
        </td>
      ),
      align: "center",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "fullname",
      key: "fullname",
      render: (fullname) => <td style={{ color: "#559aff" }}>{fullname}</td>
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <td className="d-flex">
          <Avatar src={<img src={avatar} alt="avatar" />} />
        </td>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "totalOrder",
      key: "totalOrder",
      render: (totalOrder) => (
        <td className="d-flex" style={{ alignItems: "center", color:"orange" }}>
          {totalOrder.toLocaleString()} đ
        </td>
      ),
    },
  ];

  //Khởi tạo khi chạy lại Web
  useEffect(() => {
    get_dashboard_data();
    //Bảng xếp hạng doanh thu dịch vụ
    service_total_rank();
    //Bảng xếp hạng đánh giá tài xế
    driver_rating_rank();
    //Bảng xếp hạng thanh toán khách hàng
    customer_payment_rank();
  }, [
    filterDashBoard,
    yearFilter,
    driverNameFilter,
    customerNameFilter,
    serviceNameFilter,
  ]);

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
                  flexDirection: "column",
                }}
              >
                <div
                  className="d-flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <div className="icon_top_dashboard">
                    <FaMoneyCheckDollar></FaMoneyCheckDollar>
                  </div>

                  <div
                    className="content_top_dashboard"
                    style={{
                      padding: "20px",
                      marginBottom: "-25px",
                      textAlign: "right",
                    }}
                  >
                    {/* Tính tổng doanh thu */}
                    <p>{totalRevenue.toLocaleString()} đ</p>
                    <p>Tổng doanh thu</p>
                  </div>
                </div>

                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    padding: "10px",
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "5px",
                    border: "1px solid red",
                    boxShadow: "0px 1px 2px 0px red",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => nav("/admin/order")}
                >
                  <span>Xem chi tiết</span>
                  <EyeFilled />
                </div>
              </div>

              <div
                className="item_top_dashboard d-flex col"
                style={{
                  backgroundColor: "#4ab89f",
                  flexDirection: "column",
                }}
              >
                <div
                  className="d-flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <div className="icon_top_dashboard">
                    <FaTruckFront></FaTruckFront>
                  </div>
                  <div
                    className="content_top_dashboard"
                    style={{
                      padding: "20px",
                      marginBottom: "-25px",
                      textAlign: "right",
                    }}
                  >
                    <p style={{ textAlign: "right" }}>{totalCountOrder}</p>
                    <p>Tổng số đơn hàng</p>
                  </div>
                </div>
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    padding: "10px",
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "5px",
                    border: "1px solid #4ab89f",
                    boxShadow: "0px 1px 2px 0px #4ab89f",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => nav("/admin/order")}
                >
                  <span>Xem chi tiết</span>
                  <EyeFilled />
                </div>
              </div>

              <div
                className="item_top_dashboard d-flex col"
                style={{
                  flexDirection: "column",
                  backgroundColor: "#3396c5",
                }}
              >
                <div
                  className="d-flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <div className="icon_top_dashboard">
                    <FaUserTie></FaUserTie>
                  </div>
                  <div
                    className="content_top_dashboard"
                    style={{
                      padding: "20px",
                      marginBottom: "-25px",
                      textAlign: "right",
                    }}
                  >
                    <p style={{ textAlign: "right" }}>{totalCountDriver}</p>
                    <p>Tài xế</p>
                  </div>
                </div>
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    padding: "10px",
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "5px",
                    border: "1px solid #3396c5",
                    boxShadow: "0px 1px 2px 0px #3396c5",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => nav("/admin/driver")}
                >
                  <span>Xem chi tiết</span>
                  <EyeFilled />
                </div>
              </div>

              <div
                className="item_top_dashboard d-flex col"
                style={{
                  flexDirection: "column",
                  backgroundColor: "#dbd956",
                }}
              >
                <div
                  className="d-flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <div className="icon_top_dashboard">
                    <FaBuildingUser></FaBuildingUser>
                  </div>
                  <div
                    className="content_top_dashboard"
                    style={{
                      padding: "20px",
                      marginBottom: "-25px",
                      textAlign: "right",
                    }}
                  >
                    <p style={{ textAlign: "right" }}>{totalCountCustomer}</p>
                    <p>Khách hàng</p>
                  </div>
                </div>
                <div
                  className="d-flex"
                  style={{
                    justifyContent: "space-between",
                    padding: "10px",
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "5px",
                    border: "1px solid #dbd956",
                    boxShadow: "0px 1px 2px 0px #dbd956",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => nav("/admin/administrator")}
                >
                  <span>Xem chi tiết</span>
                  <EyeFilled />
                </div>
              </div>
            </div>

            <LoadingOverlayComponent status={isActive}>
              <div
                className="chart_dashboard"
                style={{
                  backgroundColor: "white",
                  padding: "25px",
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
                    <option value="THỐNG KÊ ĐƠN HÀNG">THỐNG KÊ ĐƠN HÀNG</option>
                    <option value="THỐNG KÊ TÀI XẾ">THỐNG KÊ TÀI XẾ</option>
                    <option value="THỐNG KÊ KHÁCH HÀNG">
                      THỐNG KÊ KHÁCH HÀNG
                    </option>
                  </select>
                </div>

                {/* Phân loại thống kế */}
                {filterDashBoard === "THỐNG KÊ DOANH THU THEO THÁNG" ? (
                  <>
                    <select
                      style={{
                        borderRadius: "5px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        color: "black",
                        float: "right",
                      }}
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                    >
                      <option value="2021">Năm 2021</option>
                      <option value="2022">Năm 2022</option>
                      <option value="2023">Năm 2023</option>
                    </select>
                    <p
                      style={{
                        float: "left",
                        fontWeight: "bold",
                        color: "orange",
                      }}
                    >
                      ( Đơn vị: VNĐ)
                    </p>
                    <Bar options={options} data={dataChart} />
                  </>
                ) : filterDashBoard === "THỐNG KÊ DOANH THU THEO NĂM" ? (
                  <>
                    <p
                      style={{
                        float: "right",
                        fontWeight: "bold",
                        color: "orange",
                      }}
                    >
                      ( Đơn vị: VNĐ)
                    </p>
                    <Bar options={options} data={dataChartYear} />
                  </>
                ) : filterDashBoard === "THỐNG KÊ ĐƠN HÀNG" ? (
                  <>
                    <select
                      style={{
                        borderRadius: "5px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        color: "black",
                        float: "right",
                      }}
                      value={serviceNameFilter}
                      onChange={(e) => setServiceNameFilter(e.target.value)}
                    >
                      <option value="Tất cả">Tất cả</option>
                      {serviceNameDropDown &&
                        serviceNameDropDown.map((item, index) => {
                          return <option value={item}>{item}</option>;
                        })}
                    </select>
                    <div
                      style={{
                        width: "700px",
                        height: "700px",
                        margin: "0 auto",
                        paddingTop: "-200px",
                      }}
                    >
                      <p
                        style={{
                          float: "right",
                          fontWeight: "bold",
                          color: "orange",
                        }}
                      >
                        ( Đơn vị: đơn)
                      </p>

                      <Pie data={dataPieOrder} options={options_pie} />
                    </div>
                  </>
                ) : filterDashBoard === "THỐNG KÊ TÀI XẾ" ? (
                  <>
                    <select
                      style={{
                        borderRadius: "5px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        color: "black",
                        float: "right",
                      }}
                      value={driverNameFilter}
                      onChange={(e) => setDriverNameFilter(e.target.value)}
                    >
                      <option value="Tất cả">Tất cả</option>
                      {driverNameDropDown &&
                        driverNameDropDown.map((item, index) => {
                          return <option value={item}>{item}</option>;
                        })}
                    </select>
                    <p
                      style={{
                        float: "left",
                        fontWeight: "bold",
                        color: "orange",
                      }}
                    >
                      ( Đơn vị: đơn)
                    </p>
                    <Bar options={options} data={dataDriver} />
                  </>
                ) : filterDashBoard === "THỐNG KÊ KHÁCH HÀNG" ? (
                  <>
                    <select
                      style={{
                        borderRadius: "5px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        color: "black",
                        float: "right",
                      }}
                      value={customerNameFilter}
                      onChange={(e) => setCustomerNameFilter(e.target.value)}
                    >
                      <option value="Tất cả">Tất cả</option>
                      {customerNameDropDown &&
                        customerNameDropDown.map((item, index) => {
                          return <option value={item}>{item}</option>;
                        })}
                    </select>
                    <p
                      style={{
                        float: "left",
                        fontWeight: "bold",
                        color: "orange",
                      }}
                    >
                      ( Đơn vị: đơn)
                    </p>

                    <Bar options={options} data={dataCustomer} />
                  </>
                ) : (
                  ""
                )}
              </div>

              {/* Xếp hạng doanh thu dịch vụ */}
              <div
                style={{
                  backgroundColor: "white",
                  marginTop: "20px",
                  height: "fit-content",
                  padding: "10px",
                  padding: "25px",
                  marginTop: "50px",
                  borderRadius: "5px",
                  boxShadow: "2px 2px 6px #ccc",
                }}
              >
                <h5
                  style={{
                    display: "block",
                    backgroundColor: "#f1a062",
                    color: "white",
                    padding: "10px",
                    borderRadius: "20px",
                    margin: "0 auto",
                    width: "fit-content",
                    marginBottom: "20px",
                  }}
                >
                  BẢNG XẾP HẠNG DOANH THU DỊCH VỤ
                </h5>

                <div
                  style={{
                    border: "1px solid orange",
                    paddingBottom: "8px",
                    borderRadius: "10px",
                  }}
                >
                  <Table
                    style={{
                      borderRadius: "10px",
                      borderColor: "orange",
                    }}
                    dataSource={arrServiceRank}
                    columns={columns_Service}
                    pagination={{
                      position: ["none", "none"],
                    }}
                  />
                </div>
              </div>

              {/* Xếp hạng tài xế*/}
              <div
                style={{
                  backgroundColor: "white",
                  marginTop: "20px",
                  height: "fit-content",
                  padding: "10px",
                  padding: "25px",
                  marginTop: "50px",
                  borderRadius: "5px",
                  boxShadow: "2px 2px 6px #ccc",
                }}
              >
                <h5
                  style={{
                    display: "block",
                    backgroundColor: "#f1a062",
                    color: "white",
                    padding: "10px",
                    borderRadius: "20px",
                    margin: "0 auto",
                    width: "fit-content",
                    marginBottom: "20px",
                  }}
                >
                  BẢNG XẾP HẠNG ĐÁNH GIÁ TÀI XẾ
                </h5>

                <div
                  style={{
                    border: "1px solid orange",
                    paddingBottom: "8px",
                    borderRadius: "10px",
                  }}
                >
                  <Table
                    style={{
                      borderRadius: "10px",
                      borderColor: "orange",
                    }}
                    dataSource={arrDriverRank}
                    columns={columns_Driver}
                    pagination={{
                      position: ["none", "none"],
                    }}
                  />
                </div>
              </div>

              {/* Xếp hạng khách hàng */}
              <div
                style={{
                  backgroundColor: "white",
                  marginTop: "20px",
                  height: "fit-content",
                  padding: "10px",
                  padding: "25px",
                  marginTop: "50px",
                  borderRadius: "5px",
                  boxShadow: "2px 2px 6px #ccc",
                }}
              >
                <h5
                  style={{
                    display: "block",
                    backgroundColor: "#f1a062",
                    color: "white",
                    padding: "10px",
                    borderRadius: "20px",
                    margin: "0 auto",
                    width: "fit-content",
                    marginBottom: "20px",
                  }}
                >
                  BẢNG XẾP HẠNG KHÁCH HÀNG
                </h5>

                <div
                  style={{
                    border: "1px solid orange",
                    paddingBottom: "8px",
                    borderRadius: "10px",
                  }}
                >
                  <Table
                    style={{
                      borderRadius: "10px",
                      borderColor: "orange",
                    }}
                    dataSource={arrCustomerRank}
                    columns={columns_Customer}
                    pagination={{
                      position: ["none", "none"],
                    }}
                  />
                </div>
              </div>
            </LoadingOverlayComponent>
          </TopCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default DashBoardAdmin;
