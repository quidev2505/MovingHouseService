import React, { useState, useEffect, useRef } from "react";
import {
  FileSearchOutlined,
  SyncOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import {
  Image,
  Table,
  Avatar,
  Tag,
  Input,
  Space,
  Button,
  DatePicker,
} from "antd";
import axios from "axios";
import Highlighter from "react-highlight-words";

import { SearchOutlined } from "@ant-design/icons";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as XLSX from "xlsx"; //Xử lý file Excel

import LoadingOverlayComponent from "../../../../../Components/LoadingOverlayComponent";
import { Toast } from "../../../../../Components/ToastColor";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

function RatingDriver() {
  const [fullnameDriver, setFullNameDriver] = useState("");
  const [fullnameCustomer, setFullNameCustomer] = useState("");

  const [dataRatingDriver, setDataRatingDriver] = useState([]);

  const [showTable, setShowTable] = useState(false);

  const [isActive, setIsActive] = useState(false);

  //Khoảng thời gian
  const [startRange, setStartRange] = useState("01/01/2021"); //Thời gian bắt đầu
  const [endRange, setEndRange] = useState("31/12/2023"); //Thời gian cuối

  //Thiết lập lọc theo khoảng thời gian
  const changeRangeTime = (a, b, c) => {
    //b là range thời gian
    setStartRange(b[0]);
    setEndRange(b[1]);
  };

  const isDateInRange = (date, startDate, endDate) => {
    // Lấy ngày, tháng, năm của ngày cần kiểm tra
    const [day, month, year] = date.split("/");

    // Lấy ngày, tháng, năm của ngày bắt đầu và ngày kết thúc
    const [startDay, startMonth, startYear] = startDate.split("/");
    const [endDay, endMonth, endYear] = endDate.split("/");

    // console.log(date)
    // console.log(startDate)
    // console.log(endDate)

    //Trường hợp chỉ đưa về 1 giá trị đúng và các trường hợp còn lại sai hết

    // So sánh ngày, tháng, năm của ngày cần kiểm tra với ngày bắt đầu và ngày kết thúc
    //So sánh năm trước
    if (year >= startYear && year <= endYear) {
      if (day >= startDay && day <= endDay) {
        // Nếu ngày cần kiểm tra lớn hơn hoặc bằng ngày bắt đầu
        if (month >= startMonth || (month === startMonth && day >= startDay)) {
          // Nếu tháng cần kiểm tra lớn hơn hoặc bằng tháng bắt đầu, hoặc tháng bằng tháng bắt đầu và ngày cần kiểm tra lớn hơn hoặc bằng ngày bắt đầu
          if (month <= endMonth || (month === endMonth && day <= endDay)) {
            // Nếu tháng cần kiểm tra nhỏ hơn hoặc bằng tháng kết thúc, hoặc tháng bằng tháng kết thúc và ngày cần kiểm tra nhỏ hơn hoặc bằng ngày kết thúc
            if (year <= endYear && year >= startYear) {
              // Nếu năm cần kiểm tra nằm trong khoảng năm của ngày bắt đầu và ngày kết thúc
              return true;
            }
          }
        } else {
          // Nếu tháng cần kiểm tra nhỏ hơn tháng bắt đầu
          return false;
        }
      } else {
        //Nếu ngày bắt đầu và ngày kết thúc đều nhỏ hơn ngày hiện tại và tháng bắng nhau
        if (
          day > startDay &&
          day > endDay &&
          month == startMonth &&
          month == endMonth
        ) {
          return false;
        }

        //Nếu tháng bằng nhau
        if (day < startDay && month == startMonth) {
          return false;
        } else {
          // Nếu ngày cần kiểm tra nhỏ hơn ngày bắt đầu
          if (month >= startMonth && month <= endMonth) {
            // Nếu tháng cần kiểm tra lớn hơn tháng bắt đầu
            return true;
          } else {
            // Nếu tháng cần kiểm tra nhỏ hơn hoặc bằng tháng bắt đầu
            return false;
          }
        }
      }
    }

    return false;
  };

  //Tìm dữ liệu theo khoảng thời gian cho trước
  const findDataRange = () => {
    setIsActive(true);
    setShowTable(true);

    const arr_result = [];
    dataRatingDriver.forEach((item, index) => {
      if (isDateInRange(item.rating_date.split(",")[1], startRange, endRange)) {
        arr_result.push(item);
      }
    });

    setIsActive(false);
    setDataRatingDriver(arr_result);
  };

  const findData = async () => {
    //Kiểm tra xem đã nhập 1 trong 3 ô chưa
    if (fullnameDriver == "" && fullnameCustomer == "") {
      await Toast.fire({
        icon: "warning",
        title: "Vui lòng nhập ít nhất 1 ô dữ liệu tìm kiếm !",
      });
    } else {
      setIsActive(true);
      setShowTable(true);

      const api_call = await axios.post("/v1/ratingDriver/findRatingDriver", {
        fullnameDriver,
        fullnameCustomer,
      });

      const data_get = api_call.data;

      const data_get_new = data_get.map((item, index) => {
        const ob = {
          key: index,
          rating_date: item.rating_date,
          star: item.star,
          comment: item.comment,
          customer_name: item.customer_name,
          driver_name: item.driver_name,
        };

        return ob;
      });

      // console.log(data_get);
      setIsActive(false);
      setDataRatingDriver(data_get_new);
      // setShowTable(true);
    }
  };

  // Khi nhấn vào nút tìm tất cả
  const findDataAll = async () => {
    setIsActive(true);
    setShowTable(true);

    // setShowTable(false);
    const api_call = await axios.post("/v1/ratingDriver/findRatingDriver", {
      fullnameDriver,
      fullnameCustomer,
    });

    const data_get = api_call.data;

    const data_get_new = data_get.map((item, index) => {
      const ob = {
        key: index,
        rating_date: item.rating_date,
        star: item.star,
        comment: item.comment,
        customer_name: item.customer_name,
        driver_name: item.driver_name,
      };

      return ob;
    });

    // console.log(data_get);
    setIsActive(false);
    setDataRatingDriver(data_get_new);
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

  const columnRatingDriver = [
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
      title: "Tên tài xế",
      dataIndex: "driver_name",
      key: "driver_name",
      ...getColumnSearchProps("driver_name"),
      render: (driver_name) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {driver_name}
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
      filters.rating_date == null &&
      filters.star == null &&
      filters.comment == null &&
      filters.customer_name == null &&
      filters.driver_name == null
    ) {
      //Gọi API
      findDataAll();
    } else {
      setDataRatingDriver(extra.currentDataSource);
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
            return dataRatingDriver[item];
          });

          let count = 0;
          const rows =
            arrSolve &&
            arrSolve.map((item, index) => {
              count++;
              return {
                STT: count,
                customer_name: item.customer_name,
                driver_name: item.driver_name,
                comment: item.comment,
                star: item.star,
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
              "Tên tài xế",
              "Bình luận",
              "Số sao đánh giá",
              "Ngày đánh giá",
            ],
          ]);

          XLSX.writeFile(workbook, "DanhGiaTaiXe.xlsx", {
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
        ĐÁNH GIÁ TÀI XẾ
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
            value={fullnameCustomer}
            onChange={(e) => setFullNameCustomer(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
          }}
        >
          <label>Họ và tên tài xế</label>
          <input
            placeholder="Nhập vào họ tên tài xế"
            style={{
              width: "fit-content",
              borderRadius: "7px",
              padding: "5px",
              marginTop: "3px",
              border: "1px solid #ccc",
            }}
            value={fullnameDriver}
            onChange={(e) => setFullNameDriver(e.target.value)}
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
        {/* Nút liệt kê tất cả */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              padding: "5px",
              border: "1px solid #ccc",
              boxShadow: "1px 1px 2px #ccc",
              borderRadius: "5px",
              display: "flex",
              height: "fit-content",
              display: "200px",
              alignItems: "center",
            }}
          >
            <div>
              <h6 className="text-center fw-bold">Thời gian đánh giá</h6>
              <div className="d-flex">
                <RangePicker
                  defaultValue={[
                    dayjs("01/01/2019", dateFormat),
                    dayjs("31/12/2023", dateFormat),
                  ]}
                  format={dateFormat}
                  onCalendarChange={(a, b, c) => changeRangeTime(a, b, c)}
                />
              </div>
            </div>
          </div>
          <button
            style={{
              backgroundColor: "rgb(75, 192, 192)",
              padding: "5px",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer",
              border: "1px solid rgb(75, 192, 192)",
              marginTop: "10px",
            }}
            onClick={() => findDataRange()}
          >
            TÌM KIẾM
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
                Kết quả : {dataRatingDriver.length} hàng dữ liệu
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
              columns={columnRatingDriver}
              dataSource={dataRatingDriver}
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

export default RatingDriver;
