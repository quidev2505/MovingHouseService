import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Button } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";

import { Space, Table, Tag, Image } from "antd";

import Swal from "sweetalert2/dist/sweetalert2.js";

import "sweetalert2/src/sweetalert2.scss";

import { useNavigate } from "react-router-dom";

import {
  EditOutlined,
  FolderViewOutlined,
  DeleteOutlined,
  SwapOutlined,
} from "@ant-design/icons";

import axios from "axios";

function VehicleAdmin() {
  const nav = useNavigate();
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <td>
          <Image width={80} src={image} />
        </td>
      ),
    },
    {
      title: "Tên phương tiện",
      dataIndex: "vehicle_name",
      key: "vehicle_name",
    },
    {
      title: "Thương hiệu xe",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Trọng lượng tối đa",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Kích cỡ hàng hóa tối đa",
      dataIndex: "cago_size",
      key: "cago_size",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, id) => (
        <div className="d-flex">
          <Tag color={status ? "green" : "volcano"} key={status}>
            {status ? "Hoạt động" : "Tạm ngưng"}
          </Tag>
          <div
            onClick={() => changeStatus(id, status)}
            style={{
              backgroundColor: "orange",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
              cursor: "pointer",
            }}
          >
            <SwapOutlined style={{ color: "white", fontWeight: "bold" }} />
          </div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (id) => (
        <Space size="middle" className="icon_hover">
          <div
            onClick={() => nav(`/admin/service/edit/${id.id}`)}
            style={{
              backgroundColor: "green",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
              cursor: "pointer",
            }}
          >
            <EditOutlined style={{ color: "white", fontWeight: "bold" }} />
          </div>
          <div
            onClick={() => nav(`/admin/service/view/${id.id}`)}
            style={{
              backgroundColor: "blue",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
              cursor: "pointer",
            }}
          >
            <FolderViewOutlined
              style={{ color: "white", fontWeight: "bold" }}
            />
          </div>
          <Link
            onClick={() => delete_service(id)}
            style={{
              backgroundColor: "red",
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
            }}
          >
            <DeleteOutlined style={{ color: "white", fontWeight: "bold" }} />
          </Link>
        </Space>
      ),
    },
  ];

  const get_vehicle = async () => {
    await axios
      .get(`/v1/vehicle/list_vehicle`)
      .then((data) => {
        let data_solve = data.data;
        const data_service = [];
        data_solve &&
          data_solve.forEach((item, index) => {
            const ob_service = {
              id: item._id,
              STT: index + 1,
              vehicle_name: item.vehicle_name,
              brand:  item.brand,
              capacity:item.capacity,
              status: item.status,
              cago_size: item.cago_size,
              suitable_for: item.suitable_for,
              image: item.image,
            };

            data_service.push(ob_service);
          });

        setDataSource(data_service);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const changeStatus = (id, status) => {
    let id_service = id.id;
    Swal.fire({
      title: "Bạn muốn thay đổi trạng thái phương tiện này ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .patch(`/v1/vehicle/update_one_field_vehicle/${id_service}`, {
              status: !status,
            })
            .then((data) => {
              get_vehicle();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Thay đổi trạng thái phương tiện thành công !",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Thay đổi trạng thái phương tiện thất bại !",
                showConfirmButton: false,
                timer: 1200,
              });
              console.log(e);
            });
        }
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Thay đổi trạng thái phương tiện thất bại !",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  useEffect(() => {
    get_vehicle();
  }, []);

  const delete_service = (id) => {
    let id_service = id.id;
    Swal.fire({
      title: "Bạn muốn xóa dịch vụ này ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios
            .delete(`/v1/vehicle/delete_vehicle/${id_service}`)
            .then((data) => {
              get_vehicle();
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Xóa phương tiện thành công!",
                showConfirmButton: false,
                timer: 1200,
              });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Xóa phương tiện thất bại!",
                showConfirmButton: false,
                timer: 1200,
              });
              console.log(e);
            });
        }
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Xóa phương tiện thất bại!",
          showConfirmButton: false,
          timer: 1200,
        });
        console.log(e);
      });
  };

  return (
    <>
      <LayoutAdmin>
        <div className="service_admin">
          <div>
            <Breadcrumb
              routes={[
                {
                  title: "Admin",
                },
                {
                  title: "Phương tiện",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Phương tiện</p>
              <Link to="/admin/vehicle/add">
                <Button
                  style={{
                    backgroundColor: "#344767",
                    color: "white",
                    float: "right",
                    marginBottom: "15px",
                  }}
                >
                  + THÊM PHƯƠNG TIỆN
                </Button>
              </Link>
            </TopCssContent>

            <div>
              <Table columns={columns} dataSource={dataSource} />
            </div>
          </BottomCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default VehicleAdmin;
