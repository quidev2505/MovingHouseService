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

function ReportVenueMonth({ yearFilter, monthPass }) {
  const [reportVenueMonthData, setReportVenueMonthData] = useState([]);

  //Tổng đơn theo thống kê
  const [totalReport, setTotalReport] = useState(0);
  const monthPassFilter = monthPass < 10 ? "0" + monthPass : monthPass;

  const getDataVenueMonth = async () => {
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
        item.date_start.split("/")[1] == monthPassFilter &&
        item.date_start.split("/")[2] == yearFilter
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
      } else if (
        monthPassFilter == "00" &&
        item.status === "Đã hoàn thành" &&
        item.date_end !== null &&
        item.date_start.split("/")[2] == yearFilter
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
      title: "Tổng đơn hàng",
      dataIndex: "totalOrder",
      key: "totalOrder",
      defaultSortOrder: "ascend",
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
    getDataVenueMonth();
  }, [monthPass, yearFilter]);

  //Thống kê doanh thu theo ngày
  const onChange = (date, dateString) => {
    console.log(date, dateString);
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
        <div style={{ float: "right" }}>
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
              }}
            >
              {" "}
              <FilterOutlined />
              &nbsp; Ngày thống kê
            </p>
            <DatePicker onChange={onChange} />
            <SearchOutlined
              style={{
                borderRadius: "50%",
                backgroundColor: "orange",
                color: "white",
                padding: "10px",
                marginLeft: "10px",
              }}
            />
          </div>
        </div>
        <div
          className="d-flex"
          style={{ alignItems: "center", padding: "10px" }}
        >
          <Tag
            icon={<SyncOutlined spin />}
            color="#4bc0c0"
            style={{ display: "flex", alignItems: "center" }}
          >
            {reportVenueMonthData.length} đơn hàng
          </Tag>
          <Tag
            icon={<SyncOutlined spin />}
            color="#4bc0c0"
            style={{ display: "flex", alignItems: "center" }}
          >
            Tổng doanh thu:&nbsp;
            {totalReport.toLocaleString()} đ
          </Tag>
        </div>
        <Table
          columns={columnVenueMonthData}
          dataSource={reportVenueMonthData}
        />
      </div>
    </>
  );
}

export default ReportVenueMonth;
