import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Image,
  Table,
  Avatar,
  Input,
  Space,
  Button,
  Tag,
  DatePicker,
} from "antd";
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

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";
function ReportOrder({ orderPass }) {
  const [reportOrder, setReportOrder] = useState([]);
  // /Khoảng thời gian
  const [startRange, setStartRange] = useState("01/01/2021"); //Thời gian bắt đầu
  const [endRange, setEndRange] = useState("31/12/2023"); //Thời gian cuối
  //Tổng đơn theo thống kê
  const [totalReport, setTotalReport] = useState(0);

  //Giới hạn chọn ngày thống kê trong phạm vi cho trước (năm hiện tại)
  // eslint-disable-next-line arrow-body-style
  const disabledDate = (current) => {
    try {
      return (
        current.year() != 2023 &&
        current.year() != 2022 &&
        current.year() != 2021
      );
    } catch (e) {
      Swal.fire({
        title: "Vui lòng chọn lại khoảng thời gian !",
        icon: "warning",
        confirmButtonText: "Xác nhận",
      });
    }
  };

  var totalReportCal = 0;
  var orderFilterNew = "";
  switch (orderPass) {
    case 1:
      orderFilterNew = "Đã hủy";
      break;
    case 2:
      orderFilterNew = "Đang xử lý";
      break;
    case 3:
      orderFilterNew = "Đang tìm tài xế";
      break;
    case 4:
      orderFilterNew = "Đang thực hiện";
      break;
    case 5:
      orderFilterNew = "Thanh toán hóa đơn";
      break;
    case 6:
      orderFilterNew = "Đã hoàn thành";
      break;
    case 7:
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
            //Tổng doanh thu
            totalOrder: item.totalOrder,
            status: item.status,
          };

          totalReportCal += item.totalOrder;
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

          totalReportCal += item.totalOrder;
          arr_solve.push(ob);
        }
      });

      setTotalReport(totalReportCal);

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
          text: "Đang xử lý",
          value: "Đang xử lý",
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
                  : status === "Đang xử lý"
                  ? "#722CFF"
                  : "#FF7D2C",
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

  //Thiết lập lọc theo khoảng thời gian
  const changeRangeTime = (a, b, c) => {
    //b là range thời gian
    setStartRange(b[0]);
    setEndRange(b[1]);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (
      filters.status == null &&
      filters.service_name == null &&
      filters.date_created == null &&
      filters.date_start == null &&
      filters.date_end == null
    ) {
      //Gọi API
      getDataOrder();
    } else {
      setReportOrder(extra.currentDataSource);
    }
  };

  //Xử lý xuất ra file Excel
  //Download Excel
  const download_data_xslx = () => {
    Swal.fire({
      title: "Bạn muốn tải báo cáo thống kê đơn hàng ?",
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
            reportOrder &&
            reportOrder.map((item, index) => ({
              STT: index + 1,
              order_id: item.order_id,
              date_created: item.date_created,
              date_start: item.date_start,
              date_end: item.date_end,
              service_name: item.service_name,
              status: item.status,
              totalOrder: item.totalOrder,
            }));

          // create workbook and worksheet
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(rows);

          XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

          // customize header names
          XLSX.utils.sheet_add_aoa(worksheet, [
            [
              "Số thứ tự",
              "Mã đơn hàng",
              "Ngày tạo đơn",
              "Ngày bắt đầu",
              "Ngày kết thúc",
              "Tên dịch vụ",
              "Trạng thái đơn hàng",
              "Tổng đơn hàng",
            ],
          ]);

          XLSX.writeFile(workbook, "ThongKeDonHang.xlsx", {
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

    return false;
  };

  //Lọc theo khoảng thời gian
  const filterRangeDate = () => {
    // console.log(reportVenueMonthData);
    // console.log(startRange)
    // console.log(endRange);
    if (startRange == "" && endRange == "") {
      getDataOrder();
    }
    let total = 0;
    let arr_result = [];
    reportOrder.forEach((item, index) => {
      if (isDateInRange(item.date_end.split(",")[0], startRange, endRange)) {
        total += item.totalOrder;
        arr_result.push(item);
      }
    });

    setTotalReport(total);

    setReportOrder(arr_result);
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
            justifyContent: "space-between",
          }}
        >
          <div
            className="d-flex"
            style={{
              alignItems: "center",
              padding: "10px",
              flexDirection: "column",
              alignItems: "flex-start",
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
              Số lượng đơn hàng: {reportOrder.length}
            </Tag>
            <Tag
              icon={<SyncOutlined spin />}
              color="#4bc0c0"
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              Tổng tất cả đơn hàng:&nbsp;
              {totalReport.toLocaleString()} đ
            </Tag>
          </div>
          {/* Thống kê theo khoảng thời gian từ đâu đến đâu. */}
          <div>
            <div
              style={{
                border: "1px solid orange",
                borderRadius: "10px",
                margin: "10px",
                padding: "10px",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <FilterOutlined />
                &nbsp; Khoảng thời gian{" "}
                <SearchOutlined
                  style={{
                    borderRadius: "50%",
                    backgroundColor: "orange",
                    color: "white",
                    padding: "10px",
                    marginLeft: "10px",
                  }}
                  onClick={() => filterRangeDate()}
                />
              </p>
              <p
                style={{
                  fontSize: "10px",
                  display: "flex",
                  fontWeight: "400",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "-10px",
                }}
              >
                (Ngày tạo đơn)
              </p>
              <div className="d-flex">
                <RangePicker
                  defaultValue={[
                    dayjs("01/01/2021", dateFormat),
                    dayjs("31/12/2023", dateFormat),
                  ]}
                  disabledDate={disabledDate}
                  format={dateFormat}
                  onCalendarChange={(a, b, c) => changeRangeTime(a, b, c)}
                />
              </div>
            </div>
          </div>
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
          columns={columnOrder}
          dataSource={reportOrder}
          onChange={onChange}
        />
      </div>
    </>
  );
}

export default ReportOrder;
