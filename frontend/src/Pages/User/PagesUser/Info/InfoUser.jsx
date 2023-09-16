import React, { useEffect, useState } from "react";
import HeaderUser from "../../ComponentUser/HeaderUser";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import LoadingOverlayComponent from "../../../../Components/LoadingOverlayComponent";

import { updateUser } from "../../../../redux/apiRequest";
import { useDispatch } from "react-redux";

function InfoUser() {
  const user = useSelector((state) => state.auth.login.currentUser);

  const [dataCustomer, setDataCustomer] = useState();

  const [email, setEmail] = useState();
  const [phonenumber, setPhonenumber] = useState();

  const [image, setImage] = useState("");
  const [image_old, setImageOld] = useState("");
  // Upload Img
  function uploadImg(e) {
    setImage(e.target.files[0]);
  }

  const dispatch = useDispatch();
  //Update Info
  const updateInfo = async () => {
    dataCustomer.id_user = user._id; // Tự động thêm key vô Object
    dataCustomer.avatar = image;
    dataCustomer.email = email; // Tự động thêm key vô Object
    dataCustomer.phonenumber = phonenumber; // Tự động thêm key vô Object

    const formData = new FormData();
    formData.append("file", image);
    formData.append("id_customer", dataCustomer._id);
    formData.append("image_old", image_old);
    formData.append("fullname", dataCustomer.fullname);
    formData.append("address", dataCustomer.address);
    formData.append("gender", dataCustomer.gender);
    formData.append("id_user", user._id);
    formData.append("email", email);
    formData.append("phonenumber", phonenumber);

    if (formData) {
      await axios
        .post(`/v1/customer/update_customer`, formData)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Cập nhật thông tin cá nhân thành công!",
            text: "Cần đăng nhập lại để cập nhật thông tin !",
            showConfirmButton: false,
            timer: 1200,
          });

          const dataNew = {
            _id: user._id,
            accessToken: user.accessToken,
            email: dataCustomer.email,
            fullname: dataCustomer.fullname,
            phonenumber: dataCustomer.phonenumber,
            status: true,
          };

          // console.log(data)
          // useSelector((state) => state.auth.login.currentUser.fullname = data.fullname);
          updateUser(dataNew, dispatch);
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
    let id = user._id;

    await axios
      .get(`/v1/customer/get_customer_info/${id}`)
      .then((data) => {
        let data_customer = data.data;
        console.log(data_customer);

        setDataCustomer(data_customer);
        setImage(data_customer.avatar);
        setImageOld(data_customer.avatar);
        setEmail(user.email);
        setPhonenumber(user.phonenumber);
      })
      .catch((e) => console.log(e));
  };

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    getInfoCustomer();
    setIsActive(false);
    // eslint-disable-next-line
  }, []);

  const [hide, setHide] = useState(true);

  useEffect(() => {
    setHide(false);
  }, [dataCustomer, email, phonenumber, image]);

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
                      placeholder={
                        dataCustomer?.fullname ? "" : "Vui lòng cập nhật !"
                      }
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
                      <option value="Chưa chọn" selected>
                        Chưa chọn
                      </option>
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
                <tr>
                  <td className="left_text">ĐỊA CHỈ</td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={dataCustomer?.address}
                      placeholder={
                        dataCustomer?.address ? "" : "Vui lòng cập nhật !"
                      }
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
                <tr>
                  <td className="left_text">SỐ ĐIỆN THOẠI</td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={phonenumber}
                      placeholder={phonenumber ? "" : "Vui lòng cập nhật !"}
                      onChange={(e) => {
                        setPhonenumber(e.target.value);
                      }}
                      style={{ fontSize: "14px" }}
                    ></input>
                  </td>
                </tr>

                <br></br>
                <tr>
                  <td className="left_text">EMAIL ĐĂNG NHẬP</td>
                  <td>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder={email ? "" : "Vui lòng cập nhật !"}
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
                  {image && (
                    <img
                      style={{
                        borderRadius: "50%",
                        border: "1px solid #ccc",
                        boxShadow:"2px 3px 6px #ccc",
                        backgroundColor: "black",
                        width: "250px",
                        marginLeft: "70px",
                        objectFit: "cover",
                        height: "250px",
                      }}
                      src={
                        typeof image === "object"
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt="anh"
                    />
                  )}
                </td>
                <td>
                  {" "}
                  <input
                    accept="image/*"
                    type="file"
                    onChange={uploadImg}
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
