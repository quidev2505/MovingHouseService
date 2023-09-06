import React, { useState, useEffect } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb, Card, Image, Tag } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link, useParams } from "react-router-dom";

import axios from "axios";

function ViewService() {
  const params = useParams();
  const [dataService, setDataService] = useState();
  const [arrProcess, setArrProcess] = useState([]);
  const [arrBonus, setArrBonus] = useState([]);
  const getDetail_service = async () => {
    const id = params.id;
    await axios
      .get(`/v1/service/list_service/${id}`)
      .then((data) => {
        const data_detail_service = data.data;
        const object_data = {
          name: data_detail_service.name,
          image: data_detail_service.image,
          vehicle: data_detail_service.vehicle,
          needpeople: data_detail_service.needPeople,
          distance: data_detail_service.distance,
          price: data_detail_service.price,
          status: data_detail_service.status,
          process: data_detail_service.process,
          bonus: data_detail_service.bonus,
          warranty_policy: data_detail_service.warranty_policy,
          suitable_for: data_detail_service.suitable_for,
        };

        const arrProcessMap = object_data.process.map((item) => (
          <li>{item}</li>
        ));
        setArrProcess(arrProcessMap);

        const arrBonusMap = object_data.bonus.map((item) => <li>{item}</li>);
        setArrBonus(arrBonusMap);

        setDataService(object_data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getDetail_service();
  }, []);

  return (
    <>
      <LayoutAdmin>
        <div className="service_add_admin">
          <div>
            <Breadcrumb
              routes={[
                {
                  title: "Admin",
                },
                {
                  title: <Link to="/admin/service">Dịch vụ</Link>,
                },
                {
                  title: "Xem chi tiết dịch vụ",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Xem chi tiết dịch vụ</p>
            </TopCssContent>
            <div>
              <Card title={dataService?.name}>
                <Card type="inner" title="Thông tin chính" className="d-flex">
                  <div>
                    <Image width={80} src={dataService?.image} />
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    <Tag
                      color={dataService?.status ? "green" : "volcano"}
                      key={dataService?.status}
                    >
                      {dataService?.status ? "Hoạt động" : "Tạm ngưng"}
                    </Tag>
                    <ul style={{ marginTop: "20px" }}>
                      <li>
                        Giá gói dịch vụ: {dataService?.price === 0 ? "Tùy thuộc vào số lượng đồ đạc và quãng đường di chuyển" : dataService?.price.toLocaleString() + "đ"}
                      </li>
                      <li>Xe tải sử dụng: {dataService?.vehicle}</li>
                      <li>
                        Số lượng người khuân vác: {dataService?.needpeople === 0 ? "Tùy thuộc vào số lượng đồ đạc và quãng đường di chuyển" : dataService?.needpeople}
                      </li>
                      <li>
                        Quảng đường áp dụng:{" "}
                        {dataService?.distance === "0"
                          ? "Tùy thuộc vào yêu cầu của khách hàng"
                          : dataService?.distance}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="fw-bold">
                      Gói dịch vụ bao gồm các công việc sau:{" "}
                    </p>
                    <ol>{arrProcess}</ol>
                  </div>
                </Card>
                <Card
                  style={{
                    marginTop: 16,
                  }}
                  type="inner"
                  title="Thông tin khác"
                  className="d-flex"
                >
                  <p className="fw-bold">Các dịch vụ bổ sung:</p>
                  <ol>{arrBonus}</ol>
                  <p className="fw-bold">Chính sách bảo hành:</p>
                  <ul>
                    <li>{dataService?.warranty_policy}</li>
                  </ul>
                  <p className="fw-bold">Gói này phù hợp với:</p>
                  <ul>
                    <li> {dataService?.suitable_for}</li>
                  </ul>
                </Card>
              </Card>
            </div>
          </BottomCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default ViewService;
