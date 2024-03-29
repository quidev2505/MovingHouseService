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

import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";
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

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

function ReportVenueMonth({ yearFilter, monthPass }) {
  const [reportVenueMonthData, setReportVenueMonthData] = useState([]);

  //Khoảng thời gian
  const [startRange, setStartRange] = useState(`01/01/${yearFilter}`); //Thời gian bắt đầu
  const [endRange, setEndRange] = useState(`31/12/${yearFilter}`); //Thời gian cuối

  //Thống kê doanh thu ngày
  const [dayFilter, setDayFilter] = useState("");

  //Tổng đơn theo thống kê
  const [totalReport, setTotalReport] = useState(0); //Tổng doanh thu
  const [totalReportProfit, setTotalReportProfit] = useState(0); //Tổng lợi nhuận
  const [totalReportFee, setTotalReportFee] = useState(0); //Tổng chi phí đền bù
  const [totalReportMoreFee, setTotalReportMoreFee] = useState(0); //Tổng chi phí phát sinh
  const monthPassFilter = monthPass < 10 ? "0" + monthPass : monthPass;

  //Giới hạn chọn ngày thống kê trong phạm vi cho trước (năm hiện tại)
  // eslint-disable-next-line arrow-body-style
  const disabledDate = (current) => {
    return current.year() != yearFilter;
  };

  const getDataVenueMonth = async () => {
    try {
      var call_api_order = await axios.get(`/v1/order/viewAllOrder`);
      var arr_order = call_api_order.data;

      //Tính tổng chi phí, lợi nhuận (lợi nhuận = doanh thu - chi phí)
      var call_api_order_detail = await axios.get(
        `/v1/order/viewAllOrderDetail`
      );
      var arr_order_detail = call_api_order_detail.data;

      //Xử lý những đơn đã hoàn thành và date_end != null
      //Tính doanh thu theo từng tháng
      let arr_solve = [];
      let count = 0;
      var totalReportCal = 0;
      var totalReportCalProfit = 0;
      var totalReportCalFee = 0;
      var totalReportCalMoreFee = 0;
      arr_order.forEach((item, index) => {
        if (
          item.status === "Đã hoàn thành" &&
          item.date_end !== null &&
          item.date_start.split("/")[1] == monthPassFilter &&
          item.date_start.split("/")[2] == yearFilter
        ) {
          count++;
          for (let i = 0; i < arr_order_detail.length; i++) {
            if (arr_order_detail[i]._id == item.order_detail_id) {
              const ob = {
                stt: count,
                order_id: item.order_id,
                date_start: item.date_start,
                date_end: item.date_end,
                month_show: item.date_start.split("/")[1],
                totalOrder: item.totalOrder,
                moreFeeName: arr_order_detail[i].more_fee_name,
                moreFeePrice: arr_order_detail[i].more_fee_price,
                offsetFeeName: arr_order_detail[i].offset_fee_name,
                offsetFeePrice: arr_order_detail[i].offset_fee_price,
                profit: arr_order_detail[i].totalOrderNew,
              };

              totalReportCal += item.totalOrder;
              totalReportCalProfit += Number(isNaN(ob.profit) ? 0 : ob.profit);
              totalReportCalFee += Number(
                isNaN(ob.offsetFeePrice) ? 0 : ob.offsetFeePrice
              );
              totalReportCalMoreFee += Number(
                isNaN(ob.moreFeePrice) ? 0 : ob.moreFeePrice
              );
              arr_solve.push(ob);
              break;
            }
          }
        } else if (
          monthPassFilter == "00" &&
          item.status === "Đã hoàn thành" &&
          item.date_end !== null &&
          item.date_start.split("/")[2] == yearFilter
        ) {
          count++;
          for (let i = 0; i < arr_order_detail.length; i++) {
            if (arr_order_detail[i]._id == item.order_detail_id) {
              const ob = {
                stt: count,
                order_id: item.order_id,
                date_start: item.date_start,
                date_end: item.date_end,
                month_show: item.date_start.split("/")[1],
                totalOrder: item.totalOrder,
                moreFeeName: arr_order_detail[i].more_fee_name,
                moreFeePrice: arr_order_detail[i].more_fee_price,
                offsetFeeName: arr_order_detail[i].offset_fee_name,
                offsetFeePrice: arr_order_detail[i].offset_fee_price,
                profit: arr_order_detail[i].totalOrderNew,
              };

              totalReportCal += item.totalOrder;
              totalReportCalProfit += Number(isNaN(ob.profit) ? 0 : ob.profit);
              totalReportCalFee += Number(
                isNaN(ob.offsetFeePrice) ? 0 : ob.offsetFeePrice
              );
              totalReportCalMoreFee += Number(
                isNaN(ob.moreFeePrice) ? 0 : ob.moreFeePrice
              );
              arr_solve.push(ob);
              break;
            }
          }
        }
      });

      setTotalReport(totalReportCal);
      setTotalReportProfit(totalReportCalProfit);
      setTotalReportFee(totalReportCalFee);
      setTotalReportMoreFee(totalReportCalMoreFee);

      setReportVenueMonthData(arr_solve);
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
    //Gọi API
    getDataVenueMonth();
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
  const columnVenueMonthData = [
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
            {date_end}
          </td>
        );
      },
    },
    {
      title: "Tháng thống kê",
      dataIndex: "month_show",
      key: "month_show",
      filters: [
        {
          text: "01",
          value: "01",
        },
        {
          text: "02",
          value: "02",
        },
        {
          text: "03",
          value: "03",
        },
        {
          text: "04",
          value: "04",
        },
        {
          text: "05",
          value: "05",
        },
        {
          text: "06",
          value: "06",
        },
        {
          text: "07",
          value: "07",
        },
        {
          text: "08",
          value: "08",
        },
        {
          text: "09",
          value: "09",
        },
        {
          text: "10",
          value: "10",
        },
        {
          text: "11",
          value: "11",
        },
        {
          text: "12",
          value: "12",
        },
      ],
      onFilter: (value, record) =>
        String(record.month_show).indexOf(value) == 0,
      render: (month_show) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {month_show}
          </td>
        );
      },
      align: "center",
    },
    {
      title: "Phí phát sinh",
      dataIndex: "moreFeeName",
      key: "moreFeeName",
      render: (moreFeeName) => (
        <td
          style={{
            fontWeight: "400",
          }}
        >
          {moreFeeName || "[Không có]"}
        </td>
      ),
    },
    {
      title: "Chi phí phát sinh",
      dataIndex: "moreFeePrice",
      key: "moreFeePrice",
      render: (moreFeePrice) => (
        <td
          style={{
            fontWeight: "600",
            color: "rgb(255, 201, 121)",
          }}
        >
          {moreFeePrice?.toLocaleString() || 0} đ
        </td>
      ),
    },
    {
      title: "Phí đền bù",
      dataIndex: "offsetFeeName",
      key: "offsetFeeName",
      render: (offsetFeeName) => (
        <td
          style={{
            fontWeight: "400",
          }}
        >
          {offsetFeeName || "[Không có]"}
        </td>
      ),
    },
    {
      title: "Chi phí đền bù",
      dataIndex: "offsetFeePrice",
      key: "offsetFeePrice",
      render: (offsetFeePrice) => (
        <td
          style={{
            fontWeight: "600",
            color: "#E64C00",
          }}
        >
          {offsetFeePrice?.toLocaleString() || 0} đ
        </td>
      ),
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
            color: "#49C1C1",
          }}
        >
          {totalOrder.toLocaleString()} đ
        </td>
      ),
    },
    {
      title: "Lợi nhuận",
      dataIndex: "profit",
      key: "profit",
      // defaultSortOrder: "ascend",
      sorter: (a, b) => a.totalOrder - b.totalOrder,
      render: (profit) => (
        <td
          style={{
            fontWeight: "600",
            color: "#FFA500",
          }}
        >
          {profit?.toLocaleString() || 0} đ
        </td>
      ),
    },
  ];

  useEffect(() => {
    //Gọi API
    getDataVenueMonth();
  }, [monthPass, yearFilter]);

  //Thiết lập lọc theo khoảng thời gian
  const changeRangeTime = (a, b, c) => {
    //b là range thời gian
    setStartRange(b[0]);
    setEndRange(b[1]);
  };

  //Thống kê doanh thu theo ngày
  const onChange = (date, dateString) => {
    setDayFilter(dateString);
  };

  //Khi nhấn nút search thống kê ngày
  const filterDate = async () => {
    try {
      if (dayFilter == "") {
        //Gọi API
        getDataVenueMonth();
      } else {
        var call_api_order = await axios.get(`/v1/order/viewAllOrder`);
        var arr_order = call_api_order.data;

        //Xử lý những đơn đã hoàn thành và date_end != null
        //Tính doanh thu theo từng tháng
        let arr_solve = [];
        let count = 0;
        var totalReportCal = 0;
        arr_order.forEach((item, index) => {
          if (
            item.status === "Đã hoàn thành" &&
            item.date_end !== null &&
            item.date_end.split(",")[0] === dayFilter
          ) {
            count++;
            const ob = {
              stt: count,
              order_id: item.order_id,
              date_start: item.date_start,
              date_end: item.date_end,
              month_show: item.date_start.split("/")[1],
              totalOrder: item.totalOrder,
            };

            totalReportCal += item.totalOrder;
            arr_solve.push(ob);
          }
        });

        setTotalReport(totalReportCal);

        setReportVenueMonthData(arr_solve);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onChangeTable = (pagination, filters, sorter, extra) => {
    if (
      filters.month_show == null &&
      filters.order_id &&
      filters.date_start == null &&
      filters.date_end == null
    ) {
      //Gọi API
      getDataVenueMonth();
    } else {
      let sumTotal = 0;
      extra.currentDataSource.forEach((item, index) => {
        sumTotal += item.totalOrder;
      });

      setTotalReport(sumTotal);
      setReportVenueMonthData(extra.currentDataSource);
    }
  };

  //Xử lý xuất ra file Excel
  //Download Excel
  const download_data_xslx = () => {
    Swal.fire({
      title: "Bạn muốn tải báo cáo thống kê doanh thu tháng ?",
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
            reportVenueMonthData &&
            reportVenueMonthData.map((item, index) => ({
              STT: index + 1,
              order_id: item.order_id,
              date_start: item.date_start,
              date_end: item.date_end,
              month_show: item.month_show,
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
              "Ngày bắt đầu",
              "Ngày kết thúc",
              "Tháng thống kê",
              "Tổng đơn hàng",
            ],
          ]);

          XLSX.writeFile(workbook, "ThongKeDoanhThuThang.xlsx", {
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

    // Chuyển đổi ngày thành mili giây
    const dateInMiliseconds = new Date(`${year}-${month}-${day}`).getTime();
    const startDateInMiliseconds = new Date(
      `${startYear}-${startMonth}-${startDay}`
    ).getTime();
    const endDateInMiliseconds = new Date(
      `${endYear}-${endMonth}-${endDay}`
    ).getTime();

    // Kiểm tra xem ngày nằm trong khoảng thời gian hay không
    return (
      dateInMiliseconds >= startDateInMiliseconds &&
      dateInMiliseconds <= endDateInMiliseconds
    );
  };

  //Lọc theo khoảng thời gian
  const filterRangeDate = () => {
    // console.log(reportVenueMonthData);
    // console.log(startRange)
    // console.log(endRange);
    if (startRange == "" && endRange == "") {
      getDataVenueMonth();
    }
    let total = 0;
    let arr_result = [];
    reportVenueMonthData.forEach((item, index) => {
      if (isDateInRange(item.date_end.split(",")[0], startRange, endRange)) {
        total += item.totalOrder;
        arr_result.push(item);
      }
    });

    setTotalReport(total);

    setReportVenueMonthData(arr_result);
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
        {/* Thống kê theo khoảng thời gian từ đâu đến đâu. */}
        <div
          style={{
            float: "right",
          }}
        >
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
              (Ngày bắt đầu)
            </p>
            <div className="d-flex">
              <RangePicker
                defaultValue={[
                  dayjs(`01/01/${yearFilter}`, dateFormat),
                  dayjs(`31/12/${yearFilter}`, dateFormat),
                ]}
                disabledDate={disabledDate}
                format={dateFormat}
                onCalendarChange={(a, b, c) => changeRangeTime(a, b, c)}
              />
            </div>
          </div>
        </div>
        {/* Thống kê theo ngày cụ thể. */}
        <div
          style={{
            float: "right",
          }}
        >
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
              &nbsp; Ngày thống kê
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
              (Ngày bắt đầu)
            </p>
            <DatePicker
              onChange={onChange}
              format="DD/MM/YYYY"
              disabledDate={disabledDate}
              placeholder="Chọn ngày thống kê"
              style={{
                width: "170px",
              }}
            />
            <SearchOutlined
              style={{
                borderRadius: "50%",
                backgroundColor: "orange",
                color: "white",
                padding: "10px",
                marginLeft: "10px",
              }}
              onClick={() => filterDate()}
            />
          </div>
        </div>
        <div
          className="d-flex"
          style={{
            alignItems: "flex-start",
            padding: "10px",
            flexDirection: "row",
            justifyContent: "space-between",
            border: "1px solid orange",
            borderRadius: "5px",
            margin: "5px",
            marginTop: "10px",
          }}
        >
          <div>
            <Tag
              icon={<SyncOutlined spin />}
              color="rgb(0, 144, 247)"
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                fontSize: "12px",
              }}
            >
              Số lượng đơn hàng: {reportVenueMonthData.length}
            </Tag>
          </div>
          <div
            className="col"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Tag
              icon={<SyncOutlined spin />}
              color="#22CFCF"
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "10px",
              }}
            >
              Tổng doanh thu:&nbsp;
              {totalReport.toLocaleString()} đ
            </Tag>

            <Tag
              icon={<SyncOutlined spin />}
              color="#FFBA53"
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 5,
                fontSize: "10px",
              }}
            >
              Tổng chi phí phát sinh:&nbsp;
              {totalReportMoreFee.toLocaleString()} đ
            </Tag>
          </div>

          <div
            className="col"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Tag
              icon={<SyncOutlined spin />}
              color="#E64C00"
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "10px",
              }}
            >
              Tổng chi phí đền bù:&nbsp;
              {totalReportFee.toLocaleString()} đ
            </Tag>
            <Tag
              icon={<SyncOutlined spin />}
              color="#FFA500"
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 5,
                fontSize: "10px",
              }}
            >
              Tổng lợi nhuận:&nbsp;
              {totalReportProfit.toLocaleString()} đ
            </Tag>
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
            float: "left",
            marginLeft: "10px",
          }}
        >
          <FileExcelOutlined />
        </div>
        <Table
          style={{ margin: "10px" }}
          columns={columnVenueMonthData}
          dataSource={reportVenueMonthData}
          onChange={onChangeTable}
        />
      </div>
    </>
  );
}

export default ReportVenueMonth;
