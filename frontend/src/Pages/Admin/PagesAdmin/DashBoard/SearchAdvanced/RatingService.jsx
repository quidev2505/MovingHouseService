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

function RatingService() {
  const [customerName, setCustomerName] = useState("");
  const [orderId, setOrderId] = useState("");

  const [dataRatingService, setDataRatingService] = useState([]);

  const [showTable, setShowTable] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const findData = async () => {
    //Kiểm tra xem đã nhập 1 trong 3 ô chưa
    if (customerName == "" && orderId == "") {
      await Toast.fire({
        icon: "warning",
        title: "Vui lòng nhập ít nhất 1 ô dữ liệu tìm kiếm !",
      });
    } else {
      setIsActive(true);
      setShowTable(true);

      const api_call = await axios.post("/v1/ratingService/findRatingService", {
        customerName,
        orderId,
      });

      const data_get = api_call.data;

      const data_get_new = data_get.map((item, index) => {
        const ob = {
          key: index,
          customer_name: item.customer_name,
          order_id: item.order_id,
          star: item.star,
          comment: item.comment,
          service_name: item.service_name,
          rating_date: item.rating_date,
        };

        return ob;
      });

      // console.log(data_get);
      setIsActive(false);
      setDataRatingService(data_get_new);
      // setShowTable(true);
    }
  };

  // Khi nhấn vào nút tìm tất cả
  const findDataAll = async () => {
    setIsActive(true);
    setShowTable(true);

    // setShowTable(false);

    const api_call = await axios.post("/v1/ratingService/findRatingService", {
      customerName,
      orderId,
    });

    const data_get = api_call.data;

    const data_get_new = data_get.map((item, index) => {
      const ob = {
        key: index,
        customer_name: item.customer_name,
        order_id: item.order_id,
        star: item.star,
        comment: item.comment,
        service_name: item.service_name,
        rating_date: item.rating_date,
      };

      return ob;
    });

    // console.log(data_get);
    setIsActive(false);
    setDataRatingService(data_get_new);

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

  const columnRatingService = [
    {
      title: "Tên khách hàng",
      dataIndex: "customer_name",
      key: "customer_name",
      ...getColumnSearchProps("customer_name"),
      render: (customer_name) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {customer_name}
          </td>
        );
      },
    },
    {
      title: "Id đơn hàng",
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
      title: "Số sao đánh giá",
      dataIndex: "star",
      key: "star",
      sorter: (a, b) => a.star - b.star,
      render: (star) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {star} ⭐
          </td>
        );
      },
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      ...getColumnSearchProps("comment"),
      render: (comment) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {comment}
          </td>
        );
      },
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "service_name",
      key: "service_name",
      ...getColumnSearchProps("service_name"),
      render: (service_name) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {service_name}
          </td>
        );
      },
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "rating_date",
      key: "rating_date",
      ...getColumnSearchProps("rating_date"),
      render: (rating_date) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {rating_date}
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
      filters.customer_name == null &&
      filters.order_id == null &&
      filters.star == null &&
      filters.comment == null &&
      filters.service_name == null &&
      filters.rating_date == null
    ) {
      //Gọi API
      findDataAll();
    } else {
      setDataRatingService(extra.currentDataSource);
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
            return dataRatingService[item];
          });

          let count = 0;
          const rows =
            arrSolve &&
            arrSolve.map((item, index) => {
              count++;
              return {
                STT: count,
                customer_name: item.customer_name,
                order_id: item.order_id,
                star: item.star,
                comment: item.comment,
                service_name: item.service_name,
                rating_date: item.rating_date,
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
							"Mã đơn hàng",
							"Số sao đánh giá",
							"Bình luận",
							"Tên dịch vụ",
							"Ngày đánh giá"
            ],
          ]);

          XLSX.writeFile(workbook, "DanhGiaDichVu.xlsx", {
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
        ĐÁNH GIÁ DỊCH VỤ
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
          <label>Họ và tên khách hàng</label>
          <input
            placeholder="Nhập họ tên khách hàng"
            style={{
              width: "200px",
              borderRadius: "7px",
              padding: "5px",
              marginTop: "3px",
              border: "1px solid #ccc",
            }}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
          }}
        >
          <label>Mã đơn hàng</label>
          <input
            placeholder="Nhập vào mã đơn hàng"
            style={{
              width: "fit-content",
              borderRadius: "7px",
              padding: "5px",
              marginTop: "3px",
              border: "1px solid #ccc",
            }}
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
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
                Kết quả : {dataRatingService.length} hàng dữ liệu
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
              columns={columnRatingService}
              dataSource={dataRatingService}
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

export default RatingService;