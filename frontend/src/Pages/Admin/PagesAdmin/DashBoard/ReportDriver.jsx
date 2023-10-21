import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Image, Table, Avatar, Input, Space, Button, Tag } from "antd";
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

import { StarFilled } from "@ant-design/icons";

function ReportDriver({ driverPass }) {
  const [reportDriver, setReportDriver] = useState([]);
  var filterNew = "";
  if (driverPass == "Tất cả") {
    filterNew = "Tất cả";
  } else {
    filterNew = driverPass;
  }
  const getDataDriver = async () => {
    console.log(driverPass);
    // console.log(orderPass);
    // console.log(orderFilterNew);
    try {
      var call_api_driver = await axios.get(`/v1/driver/show_all_driver`);
      var arr_driver = call_api_driver.data;

      //Xử lý những đơn đã hoàn thành và date_end != null
      //Tính doanh thu theo từng tháng
      let arr_solve = [];
      let count = 0;
      arr_driver.forEach((item, index) => {
        if (filterNew == item.fullname) {
          count++;
          const ob = {
            stt: count,
            profile_code: item.profile_code,
            fullname: item.fullname,
            email: item.email,
            address: item.address,
            avatar: item.avatar,
            star_average: item.star_average,
            status: item.status,
            current_position: item.current_position,
            id_rating: item.id_rating, //Số lượng đánh giá
            id_delivery: item.id_delivery, //Số lượt vận chuyển
          };

          arr_solve.push(ob);
        } else if (filterNew == "Tất cả") {
          count++;
          const ob = {
            stt: count,
            profile_code: item.profile_code,
            fullname: item.fullname,
            email: item.email,
            address: item.address,
            avatar: item.avatar,
            star_average: item.star_average,
            status: item.status,
            current_position: item.current_position,
            id_rating: item.id_rating, //Số lượng đánh giá
            id_delivery: item.id_delivery, //Số lượt vận chuyển
          };

          arr_solve.push(ob);
        }
      });

      setReportDriver(arr_solve);
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
  const columnDriver = [
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
      title: "Mã hồ sơ",
      dataIndex: "profile_code",
      key: "profile_code",
      ...getColumnSearchProps("profile_code"),
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
      title: "Tên tài xế",
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
      title: "Địa chỉ thường trú",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),
      render: (address) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {address}
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
      title: "Sao trung bình",
      dataIndex: "star_average",
      key: "star_average",
      sorter: (a, b) => a.star_average - b.star_average,
      render: (star_average) => (
        <td className="d-flex" style={{ alignItems: "center" }}>
          {star_average}&nbsp;
          <StarFilled style={{ color: "#f1a062" }} />
        </td>
      ),
    },

    {
      title: "Vị trí hiện tại",
      dataIndex: "current_position",
      key: "current_position",
      ...getColumnSearchProps("current_position"),
      render: (current_position) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            {current_position}
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
              color: "black",
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
              color: "black",
            }}
          >
            {id_rating.length}
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
      onFilter: (value, record) => record.status.indexOf(value) == 0,
      render: (status) => {
        return (
          <td
            style={{
              fontWeight: "500",
              color: "black",
            }}
          >
            <Tag
              color={status === "Sẵn sàng" ? "green" : "volcano"}
              key={status}
            >
              {status === "Sẵn sàng" ? "Sẵn sàng" : "Đang bận"}
            </Tag>
          </td>
        );
      },
    },
  ];

  useEffect(() => {
    //Gọi API
    getDataDriver();
  }, [driverPass]);

  const onChange = (pagination, filters, sorter, extra) => {
    if (filters.status == null && filters.service_name == null) {
      //Gọi API
      getDataDriver();
    } else {
      setReportDriver(extra.currentDataSource);
    }
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
          style={{ alignItems: "center", padding: "10px" }}
        >
          <Tag
            icon={<SyncOutlined spin />}
            color="#ff671d"
            style={{ display: "flex", alignItems: "center" }}
          >
            Số lượng tài xế: {reportDriver.length}
          </Tag>
        </div>
        <Table
          columns={columnDriver}
          dataSource={reportDriver}
          onChange={onChange}
        />
      </div>
    </>
  );
}

export default ReportDriver;
