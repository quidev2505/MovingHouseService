import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image, Table, Avatar } from "antd";

function ReportVenueMonth() {
  const [reportVenueMonthData, setReportVenueMonthData] = useState([]);
  const getDataVenueMonth = async () => {
    var call_api_order = await axios.get(`/v1/order/viewAllOrder`);
    var arr_order = call_api_order.data;

    //Xử lý những đơn đã hoàn thành và date_end != null
    //Tính doanh thu theo từng tháng
    let arr_solve = [];
    let count = 0;
    arr_order.forEach((item, index) => {
      if (item.status === "Đã hoàn thành" && item.date_end !== null) {
        count++;
        const ob = {
          stt: count,
          order_id: item.order_id,
          date_start: item.date_start,
          date_end: item.date_end,
          totalOrder: item.totalOrder,
        };

        arr_solve.push(ob);
      }
    });
    console.log(arr_solve)
    setReportVenueMonthData(arr_solve);
  };

  //Bảng xếp hạng đánh giá tài xế
  const columnVenueMonthData = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (stt) => {
        return <td style={{ fontWeight: "500", color: "black" }}>{stt}</td>;
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "order_id",
      render: (order_id) => {
        return (
          <td style={{ fontWeight: "500", color: "black" }}>{order_id}</td>
        );
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "date_start",
      key: "date_start",
      render: (date_start) => {
        return (
          <td style={{ fontWeight: "500", color: "black" }}>{date_start}</td>
        );
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "date_end",
      key: "date_end",
      render: (date_end) => {
        return (
          <td style={{ fontWeight: "500", color: "black" }}>{date_end}</td>
        );
      },
    },
    {
      title: "Tổng đơn hàng",
      dataIndex: "totalOrder",
      key: "totalOrder",
      render: (totalOrder) => (
        <td style={{ fontWeight: "600", color: "#f2c92d" }}>
          {totalOrder.toLocaleString()} đ
        </td>
      ),
    },
  ];

  useEffect(() => {
    //Gọi API
    getDataVenueMonth();
  }, []);

  return (
    <>
      {/* KHU VỰC DỮ LIỆU THỐNG KÊ DẠNG BẢNG */}
      <div
        style={{
          border: "1px solid orange",
          paddingBottom: "8px",
          borderRadius: "10px",
          marginTop: "50px",
        }}
      >
        <Table
          style={{
            borderRadius: "10px",
            borderColor: "orange",
          }}
          dataSource={reportVenueMonthData}
          columns={columnVenueMonthData}
          // pagination={{
          //   position: ["none", "none"],
          // }}
        />
      </div>
    </>
  );
}

export default ReportVenueMonth;
