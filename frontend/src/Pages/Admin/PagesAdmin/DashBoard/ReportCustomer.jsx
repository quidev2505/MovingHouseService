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

// import { StarFilled } from "@ant-design/icons";

function ReportCustomer({ customerPass }) {
  const [reportCustomer, setReportCustomer] = useState([]);
  var filterNew = "";
  if (customerPass == "Tất cả") {
    filterNew = "Tất cả";
  } else {
    filterNew = customerPass;
  }
  const getDataCustomer = async () => {
    console.log(customerPass);
    // console.log(orderPass);
    // console.log(orderFilterNew);
    try {
      //Tổng số đơn hàng đã giao thành công
      const sumOrderComplete = [];
      //Tổng số đơn hàng đã hủy
      const sumOrderCancel = [];
      //Tổng thanh toán
      const sumPayment = [];
      //Gọi dữ liệu khách hàng
      var call_api_customer = await axios.get(`/v1/customer/get_all_customer`);
      var arr_customer = call_api_customer.data;

      //Xử lý lấy mảng id_customer
      const arr_id_customer = arr_customer.map((item, index) => {
        return item._id;
      });

      //Gọi dữ liệu đơn hàng
      var call_api_order = await axios.get(`/v1/order/viewAllOrder`);
      var arr_order = call_api_order.data;

      //Xử lí tính tổng số đơn theo từng khách hàng
      arr_id_customer.forEach((item, index) => {
        let id_customer = item;
        var sum_order_complete = 0;
        var sum_order_cancel = 0;
        var sum_init_payment = 0;
        arr_order.forEach((item1, index) => {
          //Tính tổng đơn giao hoàn thành
          if (item1.status === "Đã hoàn thành") {
            if (item1.customer_id === id_customer) {
              sum_order_complete++;
              sum_init_payment += item1.totalOrder;
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
        sumPayment.push(sum_init_payment);
      });

      //Xử lý những đơn đã hoàn thành và date_end != null
      //Tính doanh thu theo từng tháng
      let arr_solve = [];
      let count = 0;
      arr_customer.forEach((item, index) => {
        if (filterNew == item.fullname) {
          count++;
          const ob = {
            stt: count,
            fullname: item.fullname,
            address: item.address,
            avatar: item.avatar,
            gender: item.gender,
            totalOrderComplete: sumOrderComplete[index],
            totalOrderCancel: sumOrderCancel[index],
            totalPayment: sumPayment[index],
          };

          arr_solve.push(ob);
        } else if (filterNew == "Tất cả") {
          count++;
          const ob = {
            stt: count,
            fullname: item.fullname,
            address: item.address,
            avatar: item.avatar,
            gender: item.gender,
            totalOrderComplete: sumOrderComplete[index],
            totalOrderCancel: sumOrderCancel[index],
            totalPayment: sumPayment[index],
          };

          arr_solve.push(ob);
        }
      });

      console.log(arr_solve);
      setReportCustomer(arr_solve);
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
  const columnCustomer = [
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
      title: "Tên khách hàng",
      dataIndex: "fullname",
      key: "fullname",
      ...getColumnSearchProps("fullname"),
      render: (fullname) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {fullname}
          </td>
        );
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      render: (address) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {address}
          </td>
        );
      },
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            <Avatar src={<img src={avatar} alt="avatar" />} />
          </td>
        );
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      filters: [
        {
          text: "Nam",
          value: "Nam",
        },
        {
          text: "Nữ",
          value: "Nữ",
        },
        {
          text: "Chưa cập nhật",
          value: "null",
        },
      ],
      onFilter: (value, record) => String(record.gender).indexOf(value) == 0,
      render: (gender) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            <Tag color={gender === "Nam" ? "green" : gender === "Nữ" ? "volcano" : "grey"} key={gender}>
              {gender === "Nam"
                ? "Nam"
                : gender === "Nữ"
                ? "Nữ"
                : "Chưa cập nhật"}
            </Tag>
          </td>
        );
      },
    },
    {
      title: "Đơn giao thành công",
      dataIndex: "totalOrderComplete",
      key: "totalOrderComplete",
      sorter: (a, b) => a.totalOrderComplete - b.totalOrderComplete,
      render: (totalOrderComplete) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {totalOrderComplete}
          </td>
        );
      },
    },
    {
      title: "Đơn đã hủy",
      dataIndex: "totalOrderCancel",
      key: "totalOrderCancel",
      sorter: (a, b) => a.totalOrderCancel - b.totalOrderCancel,
      render: (totalOrderCancel) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {totalOrderCancel}
          </td>
        );
      },
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "totalPayment",
      key: "totalPayment",
      sorter: (a, b) => a.totalPayment - b.totalPayment,
      render: (totalPayment) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "orange",
            }}
          >
            {totalPayment.toLocaleString()} đ
          </td>
        );
      },
    },
  ];

  useEffect(() => {
    //Gọi API
    getDataCustomer();
  }, [customerPass]);

  const onChange = (pagination, filters, sorter, extra) => {
    if (filters.status == null && filters.service_name == null) {
      //Gọi API
      getDataCustomer();
    } else {
      setReportCustomer(extra.currentDataSource);
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
            Số lượng khách hàng: {reportCustomer.length}
          </Tag>
        </div>
        <Table
          columns={columnCustomer}
          dataSource={reportCustomer}
          onChange={onChange}
        />
      </div>
    </>
  );
}

export default ReportCustomer;
