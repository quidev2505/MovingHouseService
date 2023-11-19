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
  Select,
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

function OrderSearch() {
  const [order_id, setOrderId] = useState("");

  const [customerName, setCustomerName] = useState("");

  const [dataOrder, setDataOrder] = useState([]);

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

  //Tìm dữ liệu theo khoảng thời gian cho trước
  const findDataRange = () => {
    setIsActive(true);
    setShowTable(true);

    const arr_result = [];
    dataOrder.forEach((item, index) => {
      if (isDateInRange(item.date_start, startRange, endRange)) {
        arr_result.push(item);
      }
    });

    setIsActive(false);
    setDataOrder(arr_result);
  };

  const findData = async () => {
    //Kiểm tra xem đã nhập 1 trong 3 ô chưa
    if (order_id == "" && customerName == "") {
      await Toast.fire({
        icon: "warning",
        title: "Vui lòng nhập vào ít nhất 1 ô dữ liệu tìm kiếm !",
      });
    } else {
      setIsActive(true);
      setShowTable(true);
      const typeFilter = "Theo id đơn hàng";

      try {
        const api_call = await axios.post("/v1/order/findDataOrder", {
          order_id,
          customerName,
          typeFilter,
        });

        const data_get = api_call.data;
        console.log(data_get);

        const data_get_new = data_get.map((item, index) => {
          const ob = {
            key: index,
            order_id: item.order_id,
            date_created: item.date_created,
            service_name: item.service_name,
            date_start: item.date_start,
            date_end: item.date_end,
            fromLocation: item.fromLocation,
            toLocation: item.toLocation,
            vehicle_name: item.vehicle_name,
            driver_name: item.driver_name,
            totalOrder: item.totalOrder,
            status: item.status,
            distance: item.distance,
            duration: item.duration,
            payment_status: item.payment_status,
            customer_name: item.customer_name,
          };

          return ob;
        });

        //Kiểm tra nếu dữ liệu trả về là rỗng
        if (data_get_new.length == 0) {
          await Toast.fire({
            icon: "warning",
            title: "Không có dữ liệu cần tìm !",
          });
          setIsActive(false);
          setDataOrder([]);
        } else {
          setIsActive(false);
          setDataOrder(data_get_new);
        }

        // console.log(data_get);

        // setShowTable(true);
      } catch (e) {
        console.log(e);
        // if (e.response.data == "Not Found") {
        //   await Toast.fire({
        //     icon: "warning",
        //     title: "Không có mã đơn hàng cần tìm !",
        //   });
        // }
        setIsActive(false);
        setDataOrder([]);
      }
    }
  };

  // Khi nhấn vào nút tìm tất cả
  const findDataAll = async () => {
    setIsActive(true);
    setShowTable(true);

    const typeFilter = "Tất cả";

    setOrderId("");
    setCustomerName("");

    const api_call = await axios.post("/v1/order/findDataOrder", {
      order_id,
      typeFilter,
    });

    const data_get = api_call.data;

    let arr_CI = [];
    data_get.forEach((item, index) => {
      arr_CI.push(item.customer_id);
    });

    if (arr_CI) {
      let arr_data_get = await axios.post(
        `/v1/customer/getArrFullName`,
        arr_CI
      );

      const arr_customer_name = arr_data_get.data;

      const data_get_new = data_get.map((item, index) => {
        const ob = {
          key: index,
          order_id: item.order_id,
          date_created: item.date_created,
          service_name: item.service_name,
          date_start: item.date_start,
          date_end: item.date_end,
          fromLocation: item.fromLocation,
          toLocation: item.toLocation,
          vehicle_name: item.vehicle_name,
          driver_name: item.driver_name,
          totalOrder: item.totalOrder,
          status: item.status,
          distance: item.distance,
          duration: item.duration,
          payment_status: item.payment_status,
          customer_name: arr_customer_name[index],
        };

        return ob;
      });

      // console.log(data_get);
      setIsActive(false);
      setDataOrder(data_get_new);
      // setShowTable(true);
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

  const columnOrder = [
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
      title: "Tên phương tiện",
      dataIndex: "vehicle_name",
      key: "vehicle_name",
      ...getColumnSearchProps("vehicle_name"),

      render: (vehicle_name) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {vehicle_name}
          </td>
        );
      },
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customer_name",
      key: "customer_name",
      ...getColumnSearchProps("customer_name"),
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
            {driver_name.map((item, index) => {
              return (
                <p>
                  {index + 1}. {item}
                </p>
              );
            })}
          </td>
        );
        // driver_name.map((item, index) => {
        //   return (
        //     <td>
        //       {index + 1}. {item} <br />
        //     </td>
        //   );
        // });
      },
    },
    {
      title: "Tổng đơn hàng",
      dataIndex: "totalOrder",
      key: "totalOrder",
      sorter: (a, b) => a.totalOrder - b.totalOrder,
      render: (totalOrder) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {totalOrder.toLocaleString()} đ
          </td>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, reason_cancel) => (
        <>
          <div className="d-flex">
            <Tag
              color={
                status === "Đang tìm tài xế"
                  ? "blue"
                  : status === "Đã hủy"
                  ? "volcano"
                  : status === "Đang thực hiện"
                  ? "gold"
                  : status === "Thanh toán hóa đơn"
                  ? "magenta"
                  : "#87d068"
              }
              key={status}
            >
              {status === "Đang tìm tài xế"
                ? "Đang tìm tài xế"
                : status === "Đã hủy"
                ? "Đã hủy"
                : status === "Đang thực hiện"
                ? "Đang thực hiện"
                : status === "Thanh toán hóa đơn"
                ? "Thanh toán hóa đơn"
                : "Đã hoàn thành"}
            </Tag>
          </div>
        </>
      ),
    },
    {
      title: "Khoảng cách vận chuyển",
      dataIndex: "distance",
      key: "distance",
      ...getColumnSearchProps("distance"),

      render: (distance) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {distance}
          </td>
        );
      },
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      ...getColumnSearchProps("duration"),

      render: (duration) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {duration}
          </td>
        );
      },
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "payment_status",
      key: "payment_status",
      ...getColumnSearchProps("payment_status"),

      render: (payment_status) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: payment_status == "Chưa thanh toán" ? "red" : "green",
            }}
          >
            {payment_status}
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
      setDataOrder(extra.currentDataSource);
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
            return dataOrder[item];
          });

          let count = 0;
          const rows =
            arrSolve &&
            arrSolve.map((item, index) => {
              count++;
              return {
                STT: count,
                order_id: item.order_id,
                date_created: item.date_created,
                service_name: item.service_name,
                date_start: item.date_start,
                date_end: item.date_end,
                fromLocation: item.fromLocation,
                toLocation: item.toLocation,
                vehicle_name: item.vehicle_name,
                driver_name: item.driver_name,
                totalOrder: item.totalOrder,
                status: item.status,
                distance: item.distance,
                duration: item.duration,
                payment_status: item.payment_status,
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
              "Mã đơn hàng",
              "Tên dịch vụ",
              "Ngày vận chuyển",
              "Ngày kết thúc",
              "Điểm bắt đầu",
              "Điểm kết thúc",
              "Loại phương tiện",
              "Tên tài xế",
              "Tổng đơn hàng",
              "Trạng thái",
              "Khoảng cách",
              "Thời lượng",
              "Trạng thái thanh toán",
            ],
          ]);

          XLSX.writeFile(workbook, "TimKiemDonHang.xlsx", {
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
        ĐƠN HÀNG
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
            value={order_id}
            onChange={(e) => setOrderId(e.target.value.trim())}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
          }}
        >
          <label>Tên khách hàng</label>
          <input
            placeholder="Nhập vào tên khách hàng"
            style={{
              width: "fit-content",
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
              <h6 className="text-center fw-bold">Thời gian lấy hàng</h6>
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
                Kết quả : {dataOrder.length} hàng dữ liệu
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
              columns={columnOrder}
              dataSource={dataOrder}
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

export default OrderSearch;
