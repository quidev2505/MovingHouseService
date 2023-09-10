import React, { useEffect, useState } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";

function InfoUser() {
  const user = useSelector((state) => state.auth.login.currentUser);

  const [dataCustomer, setDataCustomer] = useState();

  const [email, setEmail] = useState();
  const [phonenumber, setPhonenumber] = useState();

  const [image, setImage] = useState("");

  //Upload Img
  function convertToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      // console.log(reader.result); //base64encoded string
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error", error);
    };
  }

  //Update Info
  const updateInfo = async () => {
    dataCustomer.id_user = user._id; // Tự động thêm key vô Object
    dataCustomer.avatar = image;
    dataCustomer.email = email; // Tự động thêm key vô Object
    dataCustomer.phonenumber = phonenumber; // Tự động thêm key vô Object

    if (dataCustomer) {
      await axios
        .post(`/v1/customer/update_customer`, dataCustomer)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Cập nhật thông tin cá nhân thành công!",
            showConfirmButton: false,
            timer: 1200,
          });
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Cập nhật thông tin cá nhân thất bại!",
            showConfirmButton: false,
            timer: 1200,
          });
        });
    }
  };

  const getInfoCustomer = async () => {
    let fullname = user.fullname;
    await axios
      .get(`/v1/customer/get_customer_info/${fullname}`)
      .then((data) => {
        let data_customer = data.data;

        setDataCustomer(data_customer);
        setImage(data_customer.avatar);
        setEmail(user.email);
        setPhonenumber(user.phonenumber);
      })
      .catch((e) => console.log(e));
  };


  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    getInfoCustomer();
    setIsActive(false)
  }, []);

  const [hide, setHide] = useState(true);

  useEffect(() => {
    setHide(!hide);
  }, [dataCustomer, email, phonenumber]);

  return (
    <>
      <HeaderUser />
      <LoadingOverlayComponent status={isActive}>
        <div className="infoUser">
          <div>
            <h1 style={{ fontWeight: "700", marginBottom: "60px" }}>
              Thông tin cá nhân
            </h1>
            <p style={{ fontStyle: "italic", color: "#737375 " }}>
              Hoàn thành thông tin cá nhân vào các ô trống bên dưới !
            </p>
          </div>

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
                      onChange={(e) => {
                        setDataCustomer({
                          ...dataCustomer,
                          fullname: e.target.value,
                        });
                      }}
                      style={{ fontSize: "14px" }}
                    ></input>
                  </td>
                </tr>
                <br></br>
                <br></br>
                <tr>
                  <td className="left_text">GIỚI TÍNH</td>
                  <td>
                    <select
                      className="form-control form-control-lg"
                      style={{ fontSize: "14px" }}
                      value={dataCustomer?.gender}
                      onChange={(e) => {
                        setDataCustomer({
                          ...dataCustomer,
                          gender: e.target.value,
                        });
                      }}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                    {/* <input
                    type="text"
                    className="form-control form-control-lg"
                    value={dataCustomer?.gender || "Chưa cập nhật"}
                    onChange={(e) => {
                      setDataCustomer({
                        ...dataCustomer,
                        gender: e.target.value,
                      });
                    }}
                    style={{ fontSize: "14px" }}
                  ></input> */}
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
                      value={dataCustomer?.address}
                      onChange={(e) => {
                        setDataCustomer({
                          ...dataCustomer,
                          address: e.target.value,
                        });
                      }}
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
                      value={phonenumber}
                      onChange={(e) => {
                        setPhonenumber(e.target.value);
                      }}
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ fontSize: "14px" }}
                    ></input>
                  </td>
                </tr>
                <br></br>
                <tr>
                  <td></td>
                  <td>
                    <button
                      type="submit"
                      onClick={updateInfo}
                      style={{
                        backgroundColor: "#344767",
                        color: "white",
                        float: "right",
                        marginBottom: "12px",
                        width: "fit-content",
                        height: "50px",
                        padding: "5px",
                        borderRadius: "5px",
                        opacity: hide ? "0.5" : "1",
                      }}
                      disabled={hide}
                    >
                      Xác nhận
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginLeft: "100px", borderLeft: "2px solid #ccc" }}>
              <tr
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "187px",
                }}
              >
                <td>
                  <img
                    src={image}
                    alt=""
                    style={{
                      borderRadius: "50%",
                      border: "3px solid var(--second-color)",
                      backgroundColor: "black",
                      width: "250px",
                      marginLeft: "70px",
                    }}
                  />
                </td>
                <td>
                  <input
                    accept="image/"
                    type="file"
                    onChange={convertToBase64}
                    className="form-control form-control-lg"
                    style={{ width: "fit-content", marginTop: "30px" }}
                  />
                </td>
              </tr>
            </div>
          </div>
        </div>
      </LoadingOverlayComponent>
    </>
  );
}

export default InfoUser;
