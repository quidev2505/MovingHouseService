import React, { useState, useEffect, useRef } from "react";
import { FileSearchOutlined } from "@ant-design/icons";
import { Image, Table, Avatar, Tag, Input, Space, Button } from "antd";
import axios from "axios";
import Highlighter from "react-highlight-words";

import { SearchOutlined } from "@ant-design/icons";

import LoadingOverlayComponent from "../../../../../Components/LoadingOverlayComponent";

function DriverSearch() {
  const [fullname, setFullName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profile_code, setProfileCode] = useState("");

  const [dataDriver, setDataDriver] = useState([]);

  // const [showTable, setShowTable] = useState(false);

  const [isActive, setIsActive] = useState(false);

  const findData = async () => {
    setIsActive(true);

    // setShowTable(false);
    const api_call = await axios.post("/v1/driver/findDriverAdvanced", {
      profile_code,
      phonenumber,
      fullname,
      address,
    });

    const data_get = api_call.data;
    // console.log(data_get);
    setIsActive(false);
    setDataDriver(data_get);
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
      sorter: (a, b) => a.id_delivery.length - b.id_delivery.length,
      render: (id_delivery) => {
        return (
          <td
            style={{
              fontWeight: "500",
            }}
          >
            {id_delivery.length}
          </td>
        );
      },
    },
    {
      title: "Lượt đánh giá",
      dataIndex: "id_rating",
      key: "id_rating",
      sorter: (a, b) => a.id_rating.length - b.id_rating.length,
      render: (id_rating) => {
        return (
          <td
            style={{
              fontWeight: "500",
            }}
          >
            {id_rating.length}
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

  const onChange = (pagination, filters, sorter, extra) => {
    if (
      filters.fullname == null &&
      filters.address == null &&
      filters.avatar == null &&
      filters.gender == null
    ) {
      //Gọi API
      findData();
    } else {
      setDataDriver(extra.currentDataSource);
    }
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
        TÀI XẾ
      </p>
      {/* Các hạng mục tìm kiếm */}
      <div
        className="d-flex mt-5"
        style={{
          margin: "0 auto",
          marginBottom: "18px",
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
      </div>

      {/* Bảng dữ liệu */}
      <LoadingOverlayComponent status={isActive}>
        <Table
          columns={columnDriver}
          dataSource={dataDriver}
          onChange={onChange}
        />
      </LoadingOverlayComponent>
    </>
  );
}

export default DriverSearch;
