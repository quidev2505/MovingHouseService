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

import { Toast } from "../../../../Components/ToastColor";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

function ReportDeliveryArea({ deliveryAreaPass }) {
  const [reportDeliveryArea, setReportDeliveryArea] = useState([]);
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
          totalReportCal += item.totalOrder;
          arr_solve.push(ob);
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
          totalReportCal += item.totalOrder;
          arr_solve.push(ob);
        }
      });

      setTotalReport(totalReportCal);
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
              color: "red",
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
              color: "rgb(37, 196, 196)",
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
      filters: [
        {
          text: "TPHCM và các tỉnh lân cận",
          value: "TPHCM và các tỉnh lân cận",
        },
        {
          text: "Hà Nội và các tỉnh lân cận",
          value: "Hà Nội và các tỉnh lân cận",
        },
      ],
      onFilter: (value, record) =>
        String(record.deliveryArea).indexOf(value) == 0,
      render: (deliveryArea) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color:
                deliveryArea == "TPHCM và các tỉnh lân cận"
                  ? "#FFC534"
                  : "#fc5400",
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
    getDataDeliveryArea();
  }, [deliveryAreaPass]);

  //Thiết lập lọc theo khoảng thời gian
  const changeRangeTime = (a, b, c) => {
    //b là range thời gian
    setStartRange(b[0]);
    setEndRange(b[1]);
  };

  useEffect(() => {
    //Hiển thị dữ liệu xã, huyện, tỉnh
    api_call_location();
  }, []);

  const [dataLocation, setDataLocation] = useState([]);
  const api_call_location = async () => {
    try {
      const data_map = await axios.get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      );

      setDataLocation(data_map.data);
      showLocationData(data_map.data);
    } catch (e) {
      console.log(e);
    }
  };

  const showLocationData = (data) => {
    var citis = document.getElementById("city"); //Tỉnh
    var districts = document.getElementById("district"); //Quận
    var wards = document.getElementById("ward"); //Phường

    for (const x of data) {
      citis.options[citis.options.length] = new Option(x.Name, x.Id);
    }

    citis.onchange = function() {
      districts.length = 1;
      wards.length = 1;
      if (this.value != "") {
        const result = data.filter((n) => n.Id === this.value);

        for (const k of result[0].Districts) {
          districts.options[districts.options.length] = new Option(
            k.Name,
            k.Id
          );
        }
      }
    };

    districts.onchange = function() {
      wards.length = 1;
      const dataCity = data.filter((n) => n.Id === citis.value);

      if (this.value != "") {
        const dataWards = dataCity[0].Districts.filter(
          (n) => n.Id === this.value
        )[0].Wards;

        for (const w of dataWards) {
          wards.options[wards.options.length] = new Option(w.Name, w.Id);
        }
      }
    };
  };

  //Tỉnh, quận, phường
  const [provinces, setProvinces] = useState("");
  const [districts, setDistricts] = useState("");
  const [wards, setWards] = useState("");

  const findLocation = () => {
    var citis_value = document.getElementById("city").value; //Tỉnh
    var districts_value = document.getElementById("district").value; //Quận
    var wards_value = document.getElementById("ward").value; //Phường

    if (citis_value == "" && districts_value == "" && wards_value == "") {
      getDataDeliveryArea();
    }

    var string_location = "";
    for (let i = 0; i < dataLocation.length; i++) {
      if (dataLocation[i].Id == citis_value) {
        //Bắt đầu là tỉnh
        string_location += dataLocation[i].Name + "-";
        //Bắt đầu tới quận
        let dataDistrict = dataLocation[i].Districts;

        for (let j = 0; j < dataDistrict.length; j++) {
          if (dataDistrict[j].Id == districts_value) {
            string_location += dataDistrict[j].Name + "-";
            //Bắt đầu tới phường
            let dataWards = dataDistrict[j].Wards;
            for (let z = 0; z < dataWards.length; z++) {
              if (dataWards[z].Id == wards_value) {
                string_location += dataWards[z].Name;
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }

    findLocationFinsh(string_location);
  };

  //Sau khi đã nhấn tìm kiếm
  const findLocationFinsh = async (stringLocation) => {
    try {
      //Xử lý phường, quận, tỉnh/thành phố
      const split_location = stringLocation.split("-");

      let complete_location = "";
      split_location.forEach((item, index) => {
        complete_location += item + ",";
      });

      console.log(complete_location);
      // const phuong = split_location[2];
      // const quan = split_location[1];
      // const thanhpho = split_location[0];

      // const complete_location = `${phuong}, ${quan}, ${thanhpho}`;

      const callBoundingBox = await axios.get(
        `https://geocode.maps.co/search?q=${complete_location}&format=json`
      );

      const dataBoundingBox = callBoundingBox.data[0]?.boundingbox;
      filterLocation(dataBoundingBox, complete_location);
    } catch (e) {
      console.log(e);
    }
  };

  //Lọc dữ liệu địa điểm cho đơn hàng
  const filterLocation = async (dataBoundingBox, complete_location) => {
    try {
      //Xử lý lấy tên tỉnh ra so sánh. VD: Thành phố Cần thơ => Cần thơ
      const split_city_split = complete_location.split(",")[0];

      const split_city_next = split_city_split.split(" ");

      const string_city_split =
        split_city_next[split_city_next.length - 2] +
        " " +
        split_city_next[split_city_next.length - 1];

      // Cho chạy vòng lặp lọc dữ liệu
      const data_result = await Promise.all(
        reportDeliveryArea.map(async (item) => {
          const fromLocationData = item.fromLocation.toUpperCase();
          console.log(fromLocationData);
          console.log(string_city_split);

          if (fromLocationData.includes(string_city_split.toUpperCase())) {
            console.log(fromLocationData);
            console.log(string_city_split);

            const dataFromLocation = await axios.get(
              `https://rsapi.goong.io/geocode?address=${fromLocationData}&api_key=${process.env.REACT_APP_GOONG_API_KEY}`,
              {
                debounce: 500, // Trì hoãn 500 mili giây trước khi gửi yêu cầu API
              }
            );

            const data_get = dataFromLocation.data.results[0];
            // console.group();
            // console.log(fromLocationData);
            const point = {
              lat: data_get.geometry.location?.lat,
              lon: data_get.geometry.location?.lng,
            };

            // Check if the point is in the bounding box
            const isInside = isPointInBoundingBox(point, dataBoundingBox);
            // console.log(isInside);
            // console.groupEnd();

            if (isInside == true) {
              return item;
            }
          }
        })
      );

      if (data_result) {
        const dataNewResult = data_result.filter((item) => {
          return item != undefined;
        });

        console.log(dataNewResult);
        setReportDeliveryArea(dataNewResult);
        let total = 0;
        dataNewResult.forEach((item, index) => {
          total += item.totalOrder;
        });
        setTotalReport(total);
      }
    } catch (e) {
      await Toast.fire({
        icon: "warning",
        title: "Vui lòng thử lại !",
      });
      console.log(e);
    }
  };

  //Kiểm tra xem 1 điểm có nằm trong vùng vị trí không
  function isPointInBoundingBox(point, boundingBox) {
    const lat = parseFloat(point.lat);
    const lon = parseFloat(point.lon);

    const minLat = parseFloat(boundingBox[0]);
    const maxLat = parseFloat(boundingBox[1]);
    const minLon = parseFloat(boundingBox[2]);
    const maxLon = parseFloat(boundingBox[3]);

    // minimum latitude, minimum longitude, maximum latitude, maximum longitude

    // Tọa độ trái dưới
    // Tọa độ phải dưới
    // Tọa độ phải trên
    // Tọa độ trái trên

    //     Tọa độ vĩ độ của điểm lớn hơn hoặc bằng tọa độ vĩ độ thấp nhất của bounding box và nhỏ hơn hoặc bằng tọa độ vĩ độ cao nhất của bounding box.
    // Tọa độ kinh độ của điểm lớn hơn hoặc bằng tọa độ kinh độ thấp nhất của bounding box và nhỏ hơn hoặc bằng tọa độ kinh độ cao nhất của bounding box.

    // Ví dụ, nếu tọa độ của điểm là (10.777, 106.667) và bounding box là (10.75, 106.65, 10.8, 106.68), thì điểm sẽ nằm trong bounding box.

    // console.log(point);
    // console.log(boundingBox);
    // console.log(
    //   lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon
    // );
    return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
  }

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
      getDataDeliveryArea();
    }
    let total = 0;
    let arr_result = [];
    reportDeliveryArea.forEach((item, index) => {
      if (
        isDateInRange(item.date_created.split(",")[1], startRange, endRange)
      ) {
        total += item.totalOrder;
        arr_result.push(item);
      }
    });

    setTotalReport(total);

    setReportDeliveryArea(arr_result);
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
            <div
              style={{
                border: "1px solid orange",
                borderRadius: "10px",
                margin: "10px",
                padding: "10px",
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
          </div>
          {/* Chọn khu vực cụ thể ~ chỉ chính xác tương đối */}
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
                &nbsp; Địa chỉ bắt đầu{" "}
                <SearchOutlined
                  style={{
                    borderRadius: "50%",
                    backgroundColor: "orange",
                    color: "white",
                    padding: "10px",
                    marginLeft: "10px",
                  }}
                  onClick={() => findLocation()}
                />
              </p>
              {/* Chọn tỉnh, quận, xã */}
              <div className="d-flex">
                <select
                  style={{
                    marginRight: "10px",
                  }}
                  class="form-select form-select-sm mb-3"
                  id="city"
                  value={provinces}
                  onChange={(e) => setProvinces(e.target.value)}
                  aria-label=".form-select-sm"
                >
                  <option value="" selected>
                    Chọn tỉnh thành
                  </option>
                </select>

                <select
                  style={{
                    marginRight: "10px",
                  }}
                  class="form-select form-select-sm mb-3"
                  id="district"
                  aria-label=".form-select-sm"
                  value={districts}
                  onChange={(e) => setDistricts(e.target.value)}
                >
                  <option value="" selected>
                    Chọn quận huyện
                  </option>
                </select>

                <select
                  style={{
                    marginRight: "10px",
                  }}
                  class="form-select form-select-sm mb-3"
                  id="ward"
                  aria-label=".form-select-sm"
                  value={wards}
                  onChange={(e) => setWards(e.target.value)}
                >
                  <option value="" selected>
                    Chọn phường xã
                  </option>
                </select>
              </div>
            </div>
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
          columns={columnDeliveryArea}
          dataSource={reportDeliveryArea}
          onChange={onChange}
        />
      </div>
    </>
  );
}

export default ReportDeliveryArea;
