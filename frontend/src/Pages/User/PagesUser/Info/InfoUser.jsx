import React, { useEffect, useState } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";
import { useSelector } from "react-redux";
import axios from "axios";

function InfoUser() {
  const user = useSelector((state) => state.auth.login.currentUser);

  const [dataCustomer, setDataCustomer] = useState();

  const getInfoCustomer = async () => {
    let fullname = user.fullname;
    await axios
      .get(`/v1/auth/get_customer_info/${fullname}`)
      .then((data) => {
        let data_customer = data.data;
        setDataCustomer(data_customer);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getInfoCustomer();
  }, []);

  return (
    <>
      <HeaderUser />
      <div className="infoUser">
        <h1 style={{ fontWeight: "700", marginBottom: "60px" }}>
          Thông tin cá nhân
        </h1>

        <div className="d-flex">
          <table>
            <tbody>
              <tr>
                <td className="left_text">HỌ VÀ TÊN</td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={dataCustomer?.fullname}
                    style={{ fontSize: "14px" }}
                  ></input>
                </td>
              </tr>
              <br></br>
              <br></br>
              <tr>
                <td className="left_text">GIỚI TÍNH</td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={dataCustomer?.gender || "Chưa cập nhật"}
                    style={{ fontSize: "14px" }}
                  ></input>
                </td>
              </tr>
              <br></br>
              <br></br>
              <tr>
                <td className="left_text">ĐỊA CHỈ</td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={dataCustomer?.address || "Chưa cập nhật"}
                    style={{ fontSize: "14px" }}
                  ></input>
                </td>
              </tr>
              <br></br>
              <br></br>
              <tr>
                <td className="left_text">SỐ ĐIỆN THOẠI</td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={user.phonenumber || "Chưa cập nhật"}
                    style={{ fontSize: "14px" }}
                  ></input>
                </td>
              </tr>

              <br></br>
              <br></br>
              <tr>
                <td className="left_text">EMAIL ĐĂNG NHẬP</td>
                <td>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={user.email}
                    style={{ fontSize: "14px" }}
                  ></input>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <tr>
              <td>
                <img src={dataCustomer?.avatar} alt="" />
              </td>
            </tr>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoUser;
