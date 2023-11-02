import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Image, Table, Avatar, Input, Space, Button, Tag } from "antd";
import Highlighter from "react-highlight-words";
import {
  EditOutlined,
  FolderViewOutlined,
  DeleteOutlined,
  SwapOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  ColumnWidthOutlined,
  ditOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  FilterOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import * as XLSX from "xlsx"; //Xử lý file Excel
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
function ReportDeliveryArea({ deliveryAreaPass }) {
  const [reportDeliveryArea, setReportDeliveryArea] = useState([]);

  var deliveryAreaFilterNew = "";
  switch (deliveryAreaPass) {
    case 1:
      deliveryAreaFilterNew = "TPHCM và các tỉnh lân cận";
      break;
    case 2:
      deliveryAreaFilterNew = "Hà Nội và các tỉnh lân cận";
      break;
    case 3:
      deliveryAreaFilterNew = "Tất cả";
      break;
    default:
      break;
  }

  const getDataDeliveryArea = async () => {
    try {
      var call_api_order = await axios.get(`/v1/order/viewDeliveryArea`);
      var arr_order = call_api_order.data;

      //Xử lý những đơn đã hoàn thành và date_end != null
      //Tính doanh thu theo từng tháng
      let arr_solve = [];
      let count = 0;

      arr_order.forEach((item, index) => {
        if (deliveryAreaFilterNew == item.deliveryArea) {
          count++;
          const ob = {
            stt: count,
            order_id: item.order_id,
            date_created: item.date_created,
            service_name: item.service_name,
            date_start: item.date_start,
            date_end: item.date_end,
            deliveryArea: item.deliveryArea,
            fromLocation: item.fromLocation,
            toLocation: item.toLocation,
            totalOrder: item.totalOrder,
            status: item.status,
          };

          arr_solve.push(ob);
					console.log(arr_solve)
        } else if (deliveryAreaFilterNew == "Tất cả") {
          count++;
          const ob = {
            stt: count,
            order_id: item.order_id,
            date_created: item.date_created,
            service_name: item.service_name,
            date_start: item.date_start,
            deliveryArea: item.deliveryArea,
            fromLocation: item.fromLocation,
            toLocation: item.toLocation,
            date_end: item.date_end,
            totalOrder: item.totalOrder,
            status: item.status,
          };

          arr_solve.push(ob);
        }
      });

			console.log(arr_solve)
      setReportDeliveryArea(arr_solve);
    } catch (e) {
      console.log(e);
    }
  };

  //Tính năng lọc theo Search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Làm mới
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  //Bảng xếp hạng đánh giá tài xế
  const columnDeliveryArea = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (stt) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {stt}
          </td>
        );
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "order_id",
      key: "order_id",
      ...getColumnSearchProps("order_id"),
      render: (order_id) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {order_id}
          </td>
        );
      },
    },
    {
      title: "Ngày tạo đơn",
      dataIndex: "date_created",
      key: "date_created",
      ...getColumnSearchProps("date_created"),
      render: (date_created) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {date_created}
          </td>
        );
      },
    },
    {
      title: "Điểm bắt đầu",
      dataIndex: "fromLocation",
      key: "fromLocation",
      ...getColumnSearchProps("fromLocation"),
      render: (fromLocation) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {fromLocation}
          </td>
        );
      },
    },
    {
      title: "Điểm kết thúc",
      dataIndex: "toLocation",
      key: "toLocation",
      ...getColumnSearchProps("toLocation"),
      render: (toLocation) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {toLocation}
          </td>
        );
      },
    },
    {
      title: "Thuộc khu vực",
      dataIndex: "deliveryArea",
      key: "deliveryArea",
      ...getColumnSearchProps("deliveryArea"),
      render: (deliveryArea) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {deliveryArea}
          </td>
        );
      },
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "service_name",
      key: "service_name",
      filters: [
        {
          text: "Chuyển nhà theo yêu cầu",
          value: "Chuyển nhà theo yêu cầu",
        },
        {
          text: "Chuyển nhà tự đóng gói",
          value: "Chuyển nhà tự đóng gói",
        },
        {
          text: "Chuyển nhà trọn gói",
          value: "Chuyển nhà trọn gói",
        },
      ],
      onFilter: (value, record) =>
        String(record.service_name).indexOf(value) == 0,
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Đã hủy",
          value: "Đã hủy",
        },
        {
          text: "Đang tìm tài xế",
          value: "Đang tìm tài xế",
        },
        {
          text: "Đang thực hiện",
          value: "Đang thực hiện",
        },
        {
          text: "Thanh toán hóa đơn",
          value: "Thanh toán hóa đơn",
        },
        {
          text: "Đã hoàn thành",
          value: "Đã hoàn thành",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) == 0,
      render: (status) => {
        return (
          <td
            style={{
              fontWeight: "bold",
              color:
                status === "Đang tìm tài xế"
                  ? "#36A2EB"
                  : status === "Đã hủy"
                  ? "#FF4069"
                  : status === "Đang thực hiện"
                  ? "#FFCE56"
                  : status === "Thanh toán hóa đơn"
                  ? "#4BC0C0"
                  : "#8142FF",
            }}
          >
            {status}
          </td>
        );
      },
    },
    {
      title: "Tổng đơn hàng",
      dataIndex: "totalOrder",
      key: "totalOrder",
      // defaultSortOrder: "ascend",
      sorter: (a, b) => a.totalOrder - b.totalOrder,
      render: (totalOrder) => (
        <td
          style={{
            fontWeight: "600",
            color: "#f2c92d",
          }}
        >
          {totalOrder.toLocaleString()} đ
        </td>
      ),
    },
  ];

  useEffect(() => {
    //Gọi API
    getDataDeliveryArea();
  }, [deliveryAreaPass]);

  const onChange = (pagination, filters, sorter, extra) => {
    if (
      filters.status == null &&
      filters.service_name == null &&
      filters.date_created == null &&
      filters.date_start == null &&
      filters.date_end == null
    ) {
      //Gọi API
      getDataDeliveryArea();
    } else {
      setReportDeliveryArea(extra.currentDataSource);
    }
  };

  //Xử lý xuất ra file Excel
  //Download Excel
  const download_data_xslx = () => {
    Swal.fire({
      title: "Bạn muốn tải báo cáo thống kê khu vực giao hàng ?",
      text: "Hãy nhấn vào xác nhận để tải xuống !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          //Create file xsls Excel
          // flatten object like this {id: 1, title:'', category: ''};
          const rows =
            reportDeliveryArea &&
            reportDeliveryArea.map((item, index) => ({
              STT: index + 1,
              order_id: item.order_id,
              date_created: item.date_created,
              fromLocation: item.fromLocation,
              toLocation: item.toLocation,
              deliveryArea: item.deliveryArea,
              service_name: item.service_name,
              status: item.status,
              totalOrder: item.totalOrder,
            }));

          // create workbook and worksheet
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(rows);

          XLSX.utils.book_append_sheet(workbook, worksheet, "DeliveryArea");

          // customize header names
          XLSX.utils.sheet_add_aoa(worksheet, [
            [
              "Số thứ tự",
              "Mã đơn hàng",
              "Ngày tạo đơn",
              "Điểm bắt đầu",
              "Điểm kết thúc",
              "Thuộc khu vực",
              "Tên dịch vụ",
              "Trạng thái đơn hàng",
              "Tổng đơn hàng",
            ],
          ]);

          XLSX.writeFile(workbook, "ThongKeKhuVucGiaoHang.xlsx", {
            compression: true,
          });
          Swal.fire({
            title: "Tải xuống thành công !",
            text: "Hoàn thành !",
            icon: "success",
            confirmButtonText: "Xác nhận",
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          title: "Tải xuống thất bại!",
          text: "Đơn hàng !",
          icon: "fail",
          confirmButtonText: "Xác nhận",
        });
        console.log(e);
      });
  };

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
        <div
          className="d-flex"
          style={{
            alignItems: "center",
            padding: "10px",
            justifyContent: "space-between",
          }}
        >
          <Tag
            icon={<SyncOutlined spin />}
            color="#ff671d"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            Số lượng đơn hàng: {reportDeliveryArea.length}
          </Tag>
          {/* Nút xuất ra file excel */}
          <div
            onClick={() => download_data_xslx()}
            style={{
              cursor: "pointer",
              width: "40px",
              height: "40px",
              backgroundColor: "green",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              borderRadius: "5px",
              marginBottom: "10px",
              marginRight: "20px",
              marginTop: "10px",
            }}
          >
            <FileExcelOutlined />
          </div>
        </div>
        <Table
          columns={columnDeliveryArea}
          dataSource={reportDeliveryArea}
          onChange={onChange}
        />
      </div>
    </>
  );
}

export default ReportDeliveryArea;