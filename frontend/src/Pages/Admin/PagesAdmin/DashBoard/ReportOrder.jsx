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

function ReportOrder({ orderPass }) {
  const [reportOrder, setReportOrder] = useState([]);

  var orderFilterNew = "";
  switch (orderPass) {
    case 1:
      orderFilterNew = "Đã hủy";
      break;
    case 2:
      orderFilterNew = "Đang tìm tài xế";
      break;
    case 3:
      orderFilterNew = "Đang thực hiện";
      break;
    case 4:
      orderFilterNew = "Thanh toán hóa đơn";
      break;
    case 5:
      orderFilterNew = "Đã hoàn thành";
      break;
    case 6:
      orderFilterNew = "Tất cả";
      break;
    default:
      break;
  }

  const getDataOrder = async () => {
    console.log(orderPass);
    console.log(orderFilterNew);
    try {
      var call_api_order = await axios.get(`/v1/order/viewAllOrder`);
      var arr_order = call_api_order.data;

      //Xử lý những đơn đã hoàn thành và date_end != null
      //Tính doanh thu theo từng tháng
      let arr_solve = [];
      let count = 0;
      arr_order.forEach((item, index) => {
        if (orderFilterNew == item.status) {
          count++;
          const ob = {
            stt: count,
            order_id: item.order_id,
            date_created: item.date_created,
            service_name: item.service_name,
            date_start: item.date_start,
            date_end: item.date_end,
            totalOrder: item.totalOrder,
            status: item.status,
          };

          arr_solve.push(ob);
        } else if (orderFilterNew == "Tất cả") {
          count++;
          const ob = {
            stt: count,
            order_id: item.order_id,
            date_created: item.date_created,
            service_name: item.service_name,
            date_start: item.date_start,
            date_end: item.date_end,
            totalOrder: item.totalOrder,
            status: item.status,
          };

          arr_solve.push(ob);
        }
      });

      setReportOrder(arr_solve);
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
  const columnOrder = [
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
      title: "Ngày bắt đầu",
      dataIndex: "date_start",
      key: "date_start",
      ...getColumnSearchProps("date_start"),
      render: (date_start) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {date_start}
          </td>
        );
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "date_end",
      key: "date_end",
      ...getColumnSearchProps("date_end"),
      render: (date_end) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {date_end === null ? "Chưa xác định" : date_end}
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
                  ? "blue"
                  : status === "Đã hủy"
                  ? "red"
                  : status === "Đang thực hiện"
                  ? "yellow"
                  : status === "Thanh toán hóa đơn"
                  ? "purple"
                  : "#87d068",
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
    getDataOrder();
  }, [orderPass]);

  const onChange = (pagination, filters, sorter, extra) => {
    if (filters.status == null && filters.service_name == null) {
      //Gọi API
      getDataOrder();
    } else {
      setReportOrder(extra.currentDataSource);
    }
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
          style={{ alignItems: "center", padding: "10px" }}
        >
          <Tag
            icon={<SyncOutlined spin />}
            color="#ff671d"
            style={{ display: "flex", alignItems: "center" }}
          >
            Số lượng đơn hàng: {reportOrder.length}
          </Tag>
        </div>
        <Table
          columns={columnOrder}
          dataSource={reportOrder}
          onChange={onChange}
        />
      </div>
    </>
  );
}

export default ReportOrder;
