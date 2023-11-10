import React, { useState, useEffect, useRef } from "react";
import {
  FileSearchOutlined,
  SyncOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { Image, Table, Avatar, Tag, Input, Space, Button } from "antd";
import axios from "axios";
import Highlighter from "react-highlight-words";

import { SearchOutlined } from "@ant-design/icons";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as XLSX from "xlsx"; //Xử lý file Excel

import LoadingOverlayComponent from "../../../../../Components/LoadingOverlayComponent";
import { Toast } from "../../../../../Components/ToastColor";

function CustomerSearch() {
  const [fullname, setFullName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [dataCustomer, setDataCustomer] = useState([]);

  const [showTable, setShowTable] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const findData = async () => {
    //Kiểm tra xem đã nhập 1 trong 3 ô chưa
    if (phonenumber == "" && fullname == "" && address == "") {
      await Toast.fire({
        icon: "warning",
        title: "Vui lòng nhập ít nhất 1 ô dữ liệu tìm kiếm !",
      });
    } else {
      setIsActive(true);
      setShowTable(true);

      const api_call = await axios.post("/v1/customer/findCustomerAdvanced", {
        phonenumber,
        fullname,
        address,
      });

      const data_get = api_call.data;



      const data_get_new = data_get.map((item, index) => {
        const ob = {
          key: index,
          fullname: item.fullname,
          phonenumber: item.phonenumber,
          address: item.address,
          avatar: item.avatar,
          gender: item.gender,
          totalCommentBlog: item.totalCommentBlog,
          totalOrderComplete: item.totalOrderComplete,
          totalOrderCancel: item.totalOrderCancel,
          totalPayment: item.totalPayment,
          createdAt: item.createdAt
        };

        return ob;
      });

      // console.log(data_get);
      setIsActive(false);
      setDataCustomer(data_get_new);
      // setShowTable(true);
    }
  };

  // Khi nhấn vào nút tìm tất cả
  const findDataAll = async () => {
    setIsActive(true);
    setShowTable(true);

    // setShowTable(false);
    const api_call = await axios.post("/v1/customer/findCustomerAdvanced", {
      phonenumber,
      fullname,
      address,
    });

    const data_get = api_call.data;

    const data_get_new = data_get.map((item, index) => {
      const ob = {
        key: index,
        fullname: item.fullname,
        phonenumber: item.phonenumber,
        address: item.address,
        avatar: item.avatar,
        gender: item.gender,
        totalCommentBlog: item.totalCommentBlog,
        totalOrderComplete: item.totalOrderComplete,
        totalOrderCancel: item.totalOrderCancel,
        totalPayment: item.totalPayment,
        createdAt: item.createdAt
      };

      return ob;
    });

    // console.log(data_get);
    setIsActive(false);
    setDataCustomer(data_get_new);
    // setShowTable(true);
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
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
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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

  const columnCustomer = [
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
      title: "Số điện thoại",
      dataIndex: "phonenumber",
      key: "phonenumber",
      ...getColumnSearchProps("phonenumber"),
      render: (phonenumber) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {phonenumber}
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
              color: address == null ? "grey" : "black",
            }}
          >
            {address == null ? "Chưa cập nhật" : address}
          </td>
        );
      },
    },
    {
      title: "Ngày tạo tài khoản",
      dataIndex: "createdAt",
      key: "createdAt",
      ...getColumnSearchProps("createdAt"),
      render: (createdAt) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {createdAt}
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
            <Tag
              color={
                gender === "Nam"
                  ? "green"
                  : gender === "Nữ"
                  ? "volcano"
                  : "grey"
              }
              key={gender}
            >
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
      title: "Lượt bình luận",
      dataIndex: "totalCommentBlog",
      key: "totalCommentBlog",
      sorter: (a, b) => a.totalCommentBlog - b.totalCommentBlog,
      render: (totalCommentBlog) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "orange",
            }}
          >
            {totalCommentBlog}
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
              color: "orange",
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
              color: "orange",
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
      sorter: (a, b) => a.totalOrder - b.totalOrder,
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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const onChange = (pagination, filters, sorter, extra) => {
    if (
      filters.fullname == null &&
      filters.address == null &&
      filters.avatar == null &&
      filters.gender == null
    ) {
      //Gọi API
      findDataAll();
    } else {
      setDataCustomer(extra.currentDataSource);
    }
  };

  //Xử lý xuất ra file Excel
  //Download Excel
  const download_data_xslx = () => {
    Swal.fire({
      title: "Bạn muốn tải xuống dữ liệu ?",
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
          //Lấy từ mảng đã chọn ra
          const arrSolve = selectedRowKeys.map((item, index) => {
            return dataCustomer[item];
          });

          let count = 0;
          const rows =
            arrSolve &&
            arrSolve.map((item, index) => {
              count++;
              return {
                STT: count,
                fullname: item.fullname,
                phonenumber: item.phonenumber,
                address: item.address,
                avatar: item.avatar,
                gender: item.gender,
                totalCommentBlog: item.totalCommentBlog,
                totalOrderComplete: item.totalOrderComplete,
                totalOrderCancel: item.totalOrderCancel,
                totalPayment: item.totalPayment.toLocaleString() + 'đ',
              };
            });

          // create workbook and worksheet
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(rows);

          XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

          // customize header names
          XLSX.utils.sheet_add_aoa(worksheet, [
            [
              "Số thứ tự",
              "Tên khách hàng",
              "Số điện thoại",
              "Địa chỉ",
              "Ảnh đại diện",
              "Giới tính",
              "Lượt bình luận",
              "Tổng đơn hàng giao thành công",
              "Tổng đơn hàng đã hủy",
              "Tổng thanh toán",
            ],
          ]);

          XLSX.writeFile(workbook, "TimKiemKhachHang.xlsx", {
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
          icon: "warning",
          confirmButtonText: "Xác nhận",
        });
        console.log(e);
      });
  };

  return (
    <>
      <p
        style={{
          backgroundColor: "rgb(37, 196, 196)",
          color: "white",
          width: "fitContent",
          fontWeight: "bold",
          display: "block",
          textAlign: "center",
          padding: "5px",
          margin: "0 auto",
          border: "1px solid rgb(37, 196, 196)",
          borderRadius: "7px",
        }}
      >
        KHÁCH HÀNG
      </p>
      {/* Các hạng mục tìm kiếm */}
      <div
        className="d-flex mt-5"
        style={{
          margin: "0 auto",
          marginBottom: "18px",
          border: "1px solid  rgb(37, 196, 196)",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
          }}
        >
          <label>Họ và tên</label>
          <input
            placeholder="Nhập vào tên khách hàng"
            style={{
              width: "200px",
              borderRadius: "7px",
              padding: "5px",
              marginTop: "3px",
              border: "1px solid #ccc",
            }}
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
          }}
        >
          <label>Số điện thoại</label>
          <input
            placeholder="Nhập vào số điện thoại"
            style={{
              width: "fit-content",
              borderRadius: "7px",
              padding: "5px",
              marginTop: "3px",
              border: "1px solid #ccc",
            }}
            value={phonenumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
          }}
        >
          <label>Địa chỉ</label>
          <input
            placeholder="Nhập vào địa chỉ"
            style={{
              width: "fit-content",
              borderRadius: "7px",
              padding: "5px",
              marginTop: "3px",
              border: "1px solid #ccc",
            }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              backgroundColor: "rgb(37, 196, 196)",
              padding: "5px",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer",
              border: "1px solid rgb(37, 196, 196)",
            }}
            onClick={() => findData()}
          >
            TÌM KIẾM
          </button>
        </div>

        {/* Nút liệt kê tất cả */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              backgroundColor: "red",
              padding: "5px",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer",
              border: "1px solid red",
            }}
            onClick={() => findDataAll()}
          >
            TẤT CẢ
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <LoadingOverlayComponent status={isActive}>
        {showTable ? (
          <div>
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                marginTop: 16,
              }}
            >
              <Button
                type="primary"
                onClick={start}
                disabled={!hasSelected}
                loading={loading}
              >
                Bỏ tất cả lựa chọn
              </Button>
              <span
                style={{
                  marginLeft: 10,
                  fontWeight: 500,
                }}
              >
                {hasSelected
                  ? `- Đã chọn ${selectedRowKeys.length} hàng dữ liệu`
                  : ""}
              </span>
            </div>
            <div className="d-flex">
              <Tag
                icon={<SyncOutlined spin />}
                color="#ff671d"
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                  marginBottom: 7,
                }}
              >
                Kết quả : {dataCustomer.length} hàng dữ liệu
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
              rowSelection={rowSelection}
              columns={columnCustomer}
              dataSource={dataCustomer}
              onChange={onChange}
            />
          </div>
        ) : (
          ""
        )}
      </LoadingOverlayComponent>
    </>
  );
}

export default CustomerSearch;
