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
} from "@ant-design/icons";

import axios from "axios";

function ServiceAdmin() {
  const nav = useNavigate()
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
      title: "Tên dịch vụ",
      dataIndex: "service_name",
      key: "service_name",
    },
    {
      title: "Giá",
      dataIndex: "service_price",
      key: "service_price",
      render: (service_price) => (
        <td>
          {service_price === "0 đ"
            ? "Tùy thuộc vào nhu cầu và yêu cầu của khách hàng"
            : service_price}
        </td>
      ),
    },
    {
      title: "Khoảng cách áp dụng",
      dataIndex: "distance",
      key: "distance",
      render: (distance) => (
        <td>
          {distance === "0" ? "Tùy thuộc vào yêu cầu của khách hàng" : distance}
        </td>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status ? "green" : "volcano"} key={status}>
          {status ? "Hoạt động" : "Tạm ngưng"}
        </Tag>
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

  const get_service = async () => {
    await axios
      .get(`/v1/service/list_service`)
      .then((data) => {
        let data_solve = data.data;
        const data_service = [];
        data_solve &&
          data_solve.forEach((item, index) => {
            const ob_service = {
              id: item._id,
              image: item.image,
              STT: index + 1,
              service_name: item.name,
              service_price: item.price.toLocaleString() + " đ",
              distance: item.distance,
              status: item.status,
            };

            data_service.push(ob_service);
          });

        setDataSource(data_service);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    get_service();
  }, []);

  const delete_service =  (id) => {
    let id_service = id.id;
        Swal.fire({
          title: "Bạn muốn xóa dịch vụ này ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Xác nhận",
        }).then(async(result) =>{
          if (result.isConfirmed) {
            await axios
            .delete(`/v1/service/delete_service/${id_service}`)
            .then((data) => {
                  get_service();
                    Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Xóa dịch vụ thành công!",
                    showConfirmButton: false,
                    timer: 1200,
                  });
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Xóa dịch vụ thất bại!",
                showConfirmButton: false,
                timer: 1200,
              });
              console.log(e);
            });
          }}).catch((e)=>{
             Swal.fire({
                position: "center",
                icon: "warning",
                title: "Xóa dịch vụ thất bại!",
                showConfirmButton: false,
                timer: 1200,
              });
              console.log(e);
          })
}

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
                  title: "Dịch vụ",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Dịch vụ</p>
              <Link to="/admin/service/add">
                <Button
                  style={{
                    backgroundColor: "#344767",
                    color: "white",
                    float: "right",
                    marginBottom: "15px",
                  }}
                >
                  + THÊM DỊCH VỤ
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

export default ServiceAdmin;
