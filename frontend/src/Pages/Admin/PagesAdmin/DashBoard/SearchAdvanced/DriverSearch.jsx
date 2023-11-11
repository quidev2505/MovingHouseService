import React, { useState, useEffect, useRef } from "react";
import {
  FileSearchOutlined,
  SyncOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { Image, Table, Avatar, Tag, Input, Space, Button, Select } from "antd";
import axios from "axios";
import Highlighter from "react-highlight-words";

import { SearchOutlined } from "@ant-design/icons";

import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import * as XLSX from "xlsx"; //Xử lý file Excel

import LoadingOverlayComponent from "../../../../../Components/LoadingOverlayComponent";
import { Toast } from "../../../../../Components/ToastColor";

function DriverSearch() {
  const [fullname, setFullName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profile_code, setProfileCode] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  const [dataDriver, setDataDriver] = useState([]);

  const [showTable, setShowTable] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const findData = async () => {
    //Kiểm tra xem đã nhập 1 trong 3 ô chưa
    if (
      profile_code == "" &&
      phonenumber == "" &&
      fullname == "" &&
      address == "" &&
      licensePlate == ""
    ) {
      await Toast.fire({
        icon: "warning",
        title: "Vui lòng nhập ít nhất 1 ô dữ liệu tìm kiếm !",
      });
    } else {
      setIsActive(true);
      setShowTable(true);

      const api_call = await axios.post("/v1/driver/findDriverAdvanced", {
        profile_code,
        phonenumber,
        fullname,
        address,
      });

      const data_get = api_call.data;

      const data_get_new = data_get.map((item, index) => {
        const ob = {
          key: index,
          profile_code: item.profile_code,
          fullname: item.fullname,
          phonenumber: item.phonenumber,
          date_of_birth: item.date_of_birth,
          citizen_id: item.citizen_id,
          address: item.address,
          avatar: item.avatar,
          gender: item.gender,
          star_average: item.star_average,
          vehicle_type: item.vehicle_type,
          location_delivery: item.location_delivery,
          id_delivery: item.id_delivery.length,
          id_rating: item.id_rating.length,
          license_plate: item.license_plate,
          current_position: item.current_position,
          status: item.status,
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
        setDataDriver([]);
      } else {
        setIsActive(false);
        setDataDriver(data_get_new);
      }

      // console.log(data_get);

      // setShowTable(true);
    }
  };

  // Khi nhấn vào nút tìm tất cả
  const findDataAll = async () => {
    setIsActive(true);
    setShowTable(true);

    setPhoneNumber("");
    setFullName("");
    setAddress("");
    setProfileCode("");

    // setShowTable(false);
    const api_call = await axios.post("/v1/driver/findDriverAdvanced", {
      profile_code,
      phonenumber,
      fullname,
      address,
    });

    const data_get = api_call.data;
    console.log(data_get);

    const data_get_new = data_get.map((item, index) => {
      const ob = {
        key: index,
        profile_code: item.profile_code,
        fullname: item.fullname,
        phonenumber: item.phonenumber,
        date_of_birth: item.date_of_birth,
        citizen_id: item.citizen_id,
        address: item.address,
        avatar: item.avatar,
        gender: item.gender,
        star_average: item.star_average,
        vehicle_type: item.vehicle_type,
        location_delivery: item.location_delivery,
        id_delivery: item.id_delivery.length,
        id_rating: item.id_rating.length,
        license_plate: item.license_plate,
        current_position: item.current_position,
        status: item.status,
      };

      return ob;
    });

    // console.log(data_get);
    setIsActive(false);
    setDataDriver(data_get_new);
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

  const columnDriver = [
    {
      title: "Mã hồ sơ",
      dataIndex: "profile_code",
      key: "profile_code",
      render: (profile_code) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {profile_code}
          </td>
        );
      },
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
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
      title: "Ngày sinh",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      render: (date_of_birth) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {date_of_birth}
          </td>
        );
      },
    },

    {
      title: "CCCD",
      dataIndex: "citizen_id",
      key: "citizen_id",
      render: (citizen_id) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {citizen_id}
          </td>
        );
      },
    },
    {
      title: "Biển số xe",
      dataIndex: "license_plate",
      key: "license_plate",
      ...getColumnSearchProps("license_plate"),
      render: (license_plate) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {license_plate}
          </td>
        );
      },
    },
    {
      title: "Địa chỉ thường trú",
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
      title: "Sao trung bình",
      dataIndex: "star_average",
      key: "star_average",
      render: (star_average) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {star_average} ⭐
          </td>
        );
      },
    },
    {
      title: "Loại phương tiện",
      dataIndex: "vehicle_type",
      key: "vehicle_type",
      sorter: (a, b) => a.vehicle_type - b.vehicle_type,
      render: (vehicle_type) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "orange",
            }}
          >
            {vehicle_type}
          </td>
        );
      },
    },
    {
      title: "Địa điểm vận chuyển",
      dataIndex: "location_delivery",
      key: "location_delivery",
      sorter: (a, b) => a.location_delivery - b.location_delivery,
      render: (location_delivery) => {
        return (
          <td
            style={{
              fontWeight: "500",
            }}
          >
            {location_delivery}
          </td>
        );
      },
    },
    {
      title: "Lượt vận chuyển",
      dataIndex: "id_delivery",
      key: "id_delivery",
      sorter: (a, b) => a.id_delivery - b.id_delivery,
      render: (id_delivery) => {
        return (
          <td
            style={{
              fontWeight: "500",
            }}
          >
            {id_delivery}
          </td>
        );
      },
    },
    {
      title: "Lượt đánh giá",
      dataIndex: "id_rating",
      key: "id_rating",
      sorter: (a, b) => a.id_rating - b.id_rating,
      render: (id_rating) => {
        return (
          <td
            style={{
              fontWeight: "500",
            }}
          >
            {id_rating}
          </td>
        );
      },
    },
    {
      title: "Vị trí hiện tại",
      dataIndex: "current_position",
      key: "current_position",
      render: (current_position) => {
        return (
          <td
            style={{
              fontWeight: "500",
            }}
          >
            {current_position}
          </td>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Sẵn sàng",
          value: "Sẵn sàng",
        },
        {
          text: "Đang bận",
          value: "Đang bận",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status, id) => (
        <div className="d-flex">
          <Tag color={status === "Sẵn sàng" ? "green" : "volcano"} key={status}>
            {status === "Sẵn sàng" ? "Sẵn sàng" : "Đang bận"}
          </Tag>
        </div>
      ),
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
      setDataDriver(extra.currentDataSource);
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
            return dataDriver[item];
          });

          let count = 0;
          const rows =
            arrSolve &&
            arrSolve.map((item, index) => {
              count++;
              return {
                STT: count,
                profile_code: item.profile_code,
                fullname: item.fullname,
                phonenumber: item.phonenumber,
                date_of_birth: item.date_of_birth,
                citizen_id: item.citizen_id,
                license_plate: item.license_plate,
                address: item.address,
                avatar: item.avatar,
                gender: item.gender,
                star_average: item.star_average,
                vehicle_type: item.vehicle_type,
                location_delivery: item.location_delivery,
                id_delivery: item.id_delivery,
                id_rating: item.id_rating,
                current_position: item.current_position,
                status: item.status,
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
              "Mã hồ sơ",
              "Tên tài xế",
              "Số điện thoại",
              "Ngày sinh",
              "CCCD",
              "Biển số xe",
              "Địa chỉ",
              "Ảnh đại diện",
              "Giới tính",
              "Sao trung bình",
              "Loại phương tiện",
              "Địa điểm vận chuyển",
              "Lượt vận chuyển",
              "Lượt đánh giá",
              "Vị trí hiện tại",
              "Trạng thái",
            ],
          ]);

          XLSX.writeFile(workbook, "TimKiemTaiXe.xlsx", {
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

  const [infoChoose, setInfoChoose] = useState("Chưa chọn");
  //Khu vực hiển thị thông tin thêm
  const CategoryFilter = (value) => {
    setInfoChoose(value);
  };

  const [dataDistance, setDataDistance] = useState([]);

  const [isActiveMore, setIsActiveMore] = useState([]);

  //Gọi API thông tin thêm
  const moreData = async () => {
    if (infoChoose != "Chưa chọn") {
      setIsActiveMore(true);
      const api_more_data = await axios.get(`/v1/driver/findMoreDriverInfo`);
      console.log(api_more_data.data);
      setIsActiveMore(false);
      setDataDistance(api_more_data.data);
    } else {
      await Toast.fire({
        icon: "warning",
        title: "Vui lòng chọn 1 loại thông tin thêm !",
      });
    }
  };

  const columnDistance = [
    {
      title: "Tên tài xế",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (name) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {name}
          </td>
        );
      },
    },
    {
      title: "ID đơn hàng",
      dataIndex: "arrIdOrder",
      key: "arrIdOrder",
      ...getColumnSearchProps("arrIdOrder"),
      render: (arrIdOrder) => {
        return (
          <td
            style={{
              fontWeight: "bold",
              color: "black",
            }}
          >
            {arrIdOrder.map((item, index) => {
              return (
                <span>
                  {item}
                  {index < arrIdOrder.length - 1 ? "-" : " "}
                </span>
              );
            })}
          </td>
        );
      },
    },
    {
      title: "Tổng khoảng cách",
      dataIndex: "sumDistance",
      key: "sumDistance",
      ...getColumnSearchProps("sumDistance"),
      render: (sumDistance) => {
        return (
          <td
            style={{
              fontWeight: "bold",
              color: "orange",
            }}
          >
            {sumDistance.toFixed(2)} km
          </td>
        );
      },
    },
  ];

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
        TÀI XẾ
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
          <label>Mã hồ sơ</label>
          <input
            placeholder="Nhập vào mã hồ sơ"
            style={{
              width: "fit-content",
              borderRadius: "7px",
              padding: "5px",
              marginTop: "3px",
              border: "1px solid #ccc",
            }}
            value={profile_code}
            onChange={(e) => setProfileCode(e.target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
          }}
        >
          <label>Họ và tên</label>
          <input
            placeholder="Nhập vào tên tài xế"
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

      {/* Khu vực thông tin thêm */}
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
        {/* Danh mục cần tìm */}
        <div className="d-fle mt-3" style={{ flexDirection: "column" }}>
          <h6 className="fw-bold">Thông tin thêm</h6>
          <div className="form-outline mb-3 form_input_handle">
            <Select
              defaultValue="Chưa chọn"
              style={{
                width: 250,
              }}
              onChange={CategoryFilter}
              options={[
                {
                  value: "Chưa chọn",
                  label: "Chưa chọn",
                },
                {
                  value: "Tổng khoảng cách vận chuyển",
                  label: "Tổng khoảng cách vận chuyển",
                },
                // {
                //   value: "Tổng thời gian vận chuyển",
                //   label: "Tổng thời gian vận chuyển",
                // },
              ]}
            />
          </div>
        </div>

        {/* Nút liệt kê tất cả */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "20px",
            justifyContent: "center",
            marginTop: "25px",
            marginLeft: "10px",
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
            onClick={() => moreData()}
          >
            LIỆT KÊ
          </button>
        </div>
      </div>

      {/* Khu vực bảng dữ liệu */}
      {infoChoose == "Tổng khoảng cách vận chuyển" ? (
        <LoadingOverlayComponent status={isActiveMore}>
          <Table
            columns={columnDistance}
            dataSource={dataDistance}
            onChange={onChange}
          />
        </LoadingOverlayComponent>
      ) : (
        ""
      )}

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
                Kết quả : {dataDriver.length} hàng dữ liệu
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
              columns={columnDriver}
              dataSource={dataDriver}
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

export default DriverSearch;
