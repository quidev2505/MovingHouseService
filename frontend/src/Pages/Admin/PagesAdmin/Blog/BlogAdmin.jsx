import React, { useEffect, useState } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Button } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";

import { Space, Table, Tag, Image, Modal } from "antd";

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

function BlogAdmin() {
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
            onClick={() => nav(`/admin/vehicle/edit/${id.id}`)}
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
            onClick={() => view_detail_vehicle(id)}
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
              brand: item.brand,
              capacity: item.capacity,
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

  const view_detail_vehicle = async (id) => {
    const column_moving_fee = [
      {
        title: "Tên phương tiện",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Giá đi 10km đầu tiên",
        dataIndex: "priceFirst10km",
        key: "priceFirst10km",
      },
      {
        title: "Giá đi 11 - 45 km",
        dataIndex: "priceFrom11to45",
        key: "priceFrom11to45",
      },
      {
        title: "Giá trên 45km",
        dataIndex: "pricePer45km",
        key: "pricePer45km",
      },
      {
        title: "Phí chờ",
        dataIndex: "waiting_fee",
        key: "waiting_fee",
      },
      {
        title: "Phí bốc xếp tầng lầu 2 chiều",
        dataIndex: "TwowayFloor_loadingFee",
        key: "TwowayFloor_loadingFee",
      },
      {
        title: "Phí bốc xếp tầng lầu 1 chiều",
        dataIndex: "OnewayFloor_loadingFee",
        key: "OnewayFloor_loadingFee",
      },
      {
        title: "Phí bốc xếp tầng trệt 2 chiều",
        dataIndex: "Twoway_loadingFee",
        key: "Twoway_loadingFee",
      },
      {
        title: "Phí bốc xếp tầng trệt 1 chiều",
        dataIndex: "Oneway_loadingFee",
        key: "Oneway_loadingFee",
      },
    ];
    await axios
      .get(`/v1/vehicle/moving_fee/${id.id}`)
      .then((data) => {
        let data_result = data.data.movingFee_id;
        console.log(data_result);
        const objectMoving = {
          name: data_result?.name,
          priceFirst10km: data_result?.priceFirst10km.toLocaleString() + " đ",
          priceFrom11to45: data_result?.priceFrom11to45.toLocaleString() + " đ",
          pricePer45km: data_result?.pricePer45km.toLocaleString() + " đ",
          waiting_fee: data_result?.waiting_fee.toLocaleString() + " đ",
          TwowayFloor_loadingFee:
            data_result?.TwowayFloor_loadingFee.toLocaleString() + " đ",
          OnewayFloor_loadingFee:
            data_result?.OnewayFloor_loadingFee.toLocaleString() + " đ",
          Twoway_loadingFee:
            data_result?.Twoway_loadingFee.toLocaleString() + " đ",
          Oneway_loadingFee:
            data_result?.Oneway_loadingFee.toLocaleString() + " đ",
        };

        const arrMoving = [objectMoving];

        Modal.success({
          title: "Thông tin phí di chuyển phương tiện",
          content: (
            <div>
              <Table columns={column_moving_fee} dataSource={arrMoving} />
            </div>
          ),
          onOk() {},
        });
      })
      .catch((e) => {
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
                  title: "Blog",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Blog</p>
              <Link to="/admin/blog/add">
                <Button
                  style={{
                    backgroundColor: "#344767",
                    color: "white",
                    float: "right",
                    marginBottom: "15px",
                  }}
                >
                  + THÊM BLOG
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

export default BlogAdmin;
