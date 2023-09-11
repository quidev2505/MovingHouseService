import React, { useState, useRef, useEffect } from "react";
import LayoutAdmin from "../../ComponentAdmin/LayoutAdmin";

import { Breadcrumb } from "antd";
import TopCssContent from "../TopCssContent";
import BottomCssContent from "../BottomCssContent";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

//Nội dung bài Blog
import { Editor } from "@tinymce/tinymce-react";

function AddBlog() {
  const params = useParams();
  const navigate = useNavigate();

  const editorRef = useRef(null);
  const [content, setContent] = useState();

  const log = () => {
    if (editorRef.current) {
      let content_blog = editorRef.current.getContent();
      setContent(content_blog);
    }
  };

  //Validation form
  const { handleSubmit } = useForm();

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

  const [dataBlog, setDataBlog] = useState({});

  const onSubmit = async () => {
    dataBlog.thumbnail = image;
    dataBlog.content = content;

    const isKeyEmpty = (key) => {
      return (
        dataBlog[key] === undefined ||
        dataBlog[key] === null ||
        dataBlog[key] === ""
      );
    };

    let check = true;

    for (const key in dataBlog) {
      if (isKeyEmpty(key)) {
        check = false;
        break;
      }
    }

    if (check) {
      await axios
        .put(`/v1/blog/update_blog/${dataBlog._id}`, dataBlog)
        .then((data) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Sửa blog thành công!",
            showConfirmButton: false,
            timer: 1200,
          });
          navigate("/admin/blog");
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Sửa blog thất bại!",
            showConfirmButton: false,
            timer: 1200,
          });
        });
    } else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Dữ liệu còn thiếu",
        showConfirmButton: false,
        timer: 1200,
      });
    }
  };

  const get_data_blog = async () => {
    const id = params.id;
    await axios
      .get(`/v1/blog/view_detail_blog/${id}`)
      .then((data) => {
        const data_blog = data.data;
        setDataBlog(data_blog);
        setImage(data_blog.thumbnail);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    get_data_blog();
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
                  title: <Link to="/admin/blog">Blog</Link>,
                },
                {
                  title: "Sửa Blog",
                },
              ]}
            />
          </div>

          <BottomCssContent>
            <TopCssContent>
              <p>Sửa Blog</p>
            </TopCssContent>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="d-flex" style={{ flexDirection: "column" }}>
                  <div
                    style={{
                      border: "1px solid #ed883b",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      padding: "10px",
                    }}
                  >
                    <h4
                      style={{
                        color: "white",
                        width: "fit-content",
                        backgroundColor: "#ed883b",
                        borderRadius: "10px",
                        padding: "10px",
                      }}
                    >
                      Thông tin chính Blog
                    </h4>
                    <div className="row">
                      <div className="col">
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="title"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Tiêu đề
                          </label>
                          <div className="form-outline mb-3 form_input_handle">
                            <input
                              value={dataBlog.title}
                              onChange={(e) =>
                                setDataBlog({
                                  ...dataBlog,
                                  title: e.target.value,
                                })
                              }
                              type="text"
                              id="title"
                              className="form-control form-control-lg"
                              placeholder="Tiêu đề blog..."
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: "5px" }}>
                          <label
                            htmlFor="category"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Danh mục
                          </label>
                          <div className="form-outline mb-3  form_input_handle">
                            <input
                              value={dataBlog.category}
                              onChange={(e) =>
                                setDataBlog({
                                  ...dataBlog,
                                  category: e.target.value,
                                })
                              }
                              type="text"
                              id="category"
                              className="form-control form-control-lg"
                              placeholder="Nhập vào thương hiệu xe"
                              style={{ fontSize: "17px", borderRadius: "3px" }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        {/* Image */}
                        <div style={{ marginBottom: "28px" }}>
                          <label
                            htmlFor="service_name"
                            className="label-color"
                            style={{ marginBottom: "5px" }}
                          >
                            Hình ảnh Blog (Thumbnail)&nbsp;
                          </label>
                          <br />
                          <input
                            accept="image/"
                            type="file"
                            onChange={convertToBase64}
                          />
                          <br />
                          {image === "" || image === null ? (
                            ""
                          ) : (
                            <img
                              width={100}
                              height={100}
                              src={image}
                              alt=""
                              style={{ objectFit: "contain" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phí di chuyển phương tiện*/}
                  <div
                    style={{
                      border: "1px solid #ed883b",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      padding: "10px",
                    }}
                  >
                    <h4
                      style={{
                        color: "white",
                        width: "fit-content",
                        backgroundColor: "#ed883b",
                        borderRadius: "10px",
                        padding: "10px",
                      }}
                    >
                      Nội dung Blog
                    </h4>

                    <div className="row">
                      <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={dataBlog.content}
                        apiKey="eva701gmuv646z5y7ja3xkalduzx3xhchjivomgxeijmsjpv"
                        init={{
                          height: 500,
                          menubar: true,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                          ],
                          toolbar:
                            "undo redo | formatselect | " +
                            "bold italic backcolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | help",
                          content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      onClick={log}
                      style={{
                        backgroundColor: "#344767",
                        color: "white",
                        float: "left",
                        marginBottom: "12px",
                        marginTop: "20px",
                        width: "fit-content",
                        height: "50px",
                        padding: "5px",
                        borderRadius: "5px",
                      }}
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </BottomCssContent>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default AddBlog;
