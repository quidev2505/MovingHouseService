import React, { useState, useEffect, useRef } from "react";

import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js/dist/html2pdf.min";

import { FilePdfOutlined } from "@ant-design/icons";

import SignaturePad from "react-signature-pad";
import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function ContractDelivery({
  orderData,
  orderDataDetail,
  checkModal,
  setCheckModal,
}) {
  async function finishSign() {
    Swal.fire({
      title: "Bạn đã đọc xong hợp đồng và đồng ý với điều khoản hợp đồng ?",
      showDenyButton: true,
      confirmButtonText: "Xác nhận",
      denyButtonText: "Hủy",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        axios
          .patch(`/v1/order/updateonefield_order/${orderData.order_id}`, {
            accept_contract: true,
          })
          .then((data) => {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Xác nhận hợp đồng vận chuyển thành công !",
              text: "Hãy chờ bộ phận quản trị duyệt hợp đồng của bạn !",
              showConfirmButton: true,
              timer: 3000,
            });
            setCheckModal(false);
          })
          .catch((e) => {
            Swal.fire({
              position: "center",
              icon: "warning",
              title: "Xác nhận hợp đồng vận chuyển thất bại !",
              text: "Cần cập nhật lại hợp đồng do có lỗi !",
              showConfirmButton: false,
              timer: 1000,
            });
            setCheckModal(false);
          });
      }
    });
  }

  const pdfJSX = () => {
    return (
      <>
        <div style={{ width: "800px", padding: "20px", paddingTop: "30px" }}>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <u>
                <span style={{ fontSize: "12pt" }}>
                  Độc lập – Tự do – Hạnh phúc
                </span>
              </u>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>&nbsp;</span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                HỢP ĐỒNG CUNG CẤP DỊCH VỤ
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                {orderData.service_name.toUpperCase()}
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
              fontWeight: "bold",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              Số:{orderData.date_created.split(",")[1]}/
            </span>
            <span style={{ fontSize: "12pt" }}>HĐVC</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <em>
              <span style={{ fontSize: "12pt" }}>
                Căn cứ Bộ Luật Dân sự số 91/2015/QH13 được Quốc hội nước CHXHCN
                Việt Nam thông qua ngày 24/11/2015;
              </span>
            </em>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <em>
              <span style={{ fontSize: "12pt" }}>
                Căn cứ Nghị định 58/2016/NĐ-CP quy định chi tiết về kinh doanh
                sản phẩm, dịch vụ mật mã dân sự và xuất khẩu, nhập khẩu sản phẩm
                mật mã dân sự
              </span>
            </em>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <em>
              <span style={{ fontSize: "12pt" }}>
                Căn cứ yêu cầu sử dụng dịch vụ của bên A và khả năng, điều kiện
                cung cấp dịch vụ của bên B.
              </span>
            </em>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <em>
              <span style={{ fontSize: "12pt" }}>
                Hôm nay, ngày {orderData.date_created.split(",")[1]}, chúng tôi
                gồm:
              </span>
            </em>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt", textDecoration: "underline" }}>
                Bên A:
              </span>
            </strong>
            <span style={{ fontSize: "12pt" }}>&nbsp;</span>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              {orderData.gender_customer == "Nam" ? "ÔNG" : "BÀ"}{" "}
              {orderData.customer_full_name.toUpperCase()}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Điện thoại:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              {orderData.phonenumber_customer}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Địa chỉ:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              {orderData.address_customer}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt", textDecoration: "underline" }}>
                Bên B:&nbsp;
              </span>
            </strong>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              CÔNG TY DỊCH VỤ DỌN NHÀ - FAST MOVE COMPANY
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
              display: "flex",
            }}
          >
            <span>
              <span style={{ fontSize: "12pt" }}>Đại diện:&nbsp;</span>
              <span style={{ fontSize: "12pt" }}>BÀ HUỲNH THỊ TÂN</span>
            </span>

            <span style={{ marginLeft: "40px" }}>
              <span style={{ fontSize: "12pt" }}>Chức vụ:&nbsp;</span>
              <span style={{ fontSize: "12pt" }}>Quản lý</span>
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Điện thoại:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>0992356425</span>
          </p>

          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Địa chỉ:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              Số 24 Độc Lập, Phường Tân Thành, Quận Tân Phú, TP.HCM
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <em>
                <span style={{ fontSize: "12pt" }}>
                  Sau khi bàn bạc và thảo luận, hai bên đi đến thống nhất ký kết
                  hợp đồng cung cấp dịch vụ vận chuyển đồ trọn gói với các điều
                  khoản sau:
                </span>
              </em>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 1: </span>
                NỘI DUNG CÔNG VIỆC
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              1.1. Bên A giao cho bên B thực hiện các công việc sau: Tháo gỡ,
              đóng gói, bao bọc đồ, tài sản và vật dụng trong văn phòng (nhà ở)
              của bên A (được liệt kê trong chi tiết đơn hàng).
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              1.2. Sau khi vận chuyển đến địa điểm theo yêu cầu của bên A, bên B
              tiến hành lắp đặt theo đúng thiết kế và yêu cầu của bên A trong
              phạm vi năng lực của bên B.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 2: </span>
                THỜI GIAN VÀ ĐỊA ĐIỂM THỰC HIỆN
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              2.1. Thời gian thực hiện công việc:
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Bên B thực hiện tháo gỡ và đóng gói đồ vào{" "}
              {orderData.time_get_item}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              (nếu có thay đổi về thời gian bên A có trách nhiệm thông báo cho
              bên B trước 02 ngày).
            </span>
          </p>
          <br></br>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>2.2. Địa điểm vận chuyển:</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>- Từ địa chỉ:&nbsp;</span>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              {orderData.router.split("->")[0]}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>- Đến địa chỉ:&nbsp;</span>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              {orderData.router.split("->")[1]}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              2.3. Các hạng mục công việc:
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Tháo gỡ, đóng gói, vận chuyển đến địa chỉ theo yêu cầu của bên
              A.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 3: </span>
                TRÁCH NHIỆM CỦA CÁC BÊN
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Trách nhiệm của bên A</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Thanh toán đầy đủ cho bên B theo Điều 4 của hợp đồng này.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Tạo điều kiện làm việc với ban quản lý tòa nhà/khu phố để bên B
              hoàn thành tốt công việc.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>2. Trách nhiệm của bên B</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Tháo gỡ, đóng gói, vận chuyển, lắp đặt đồ đạc theo đúng yêu cầu
              của bên A.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Đảm bảo đúng thời gian và an toàn khi tiến hành công việc.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Trong trường hợp đồ đạc bị đổ vỡ, mất mát, bên B cam kết bồi
              thường cho bên A theo đúng giá trị đồ vật trên thị trường tại thời
              điểm vận chuyển. Đồng thời, đại diện bên B cam kết gửi lời xin lỗi
              chân thành tới đại diện bên A.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 4: </span>
                GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>4.1. Giá trị hợp đồng là:</span>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              &nbsp;{orderData.totalOrder.toLocaleString()}
            </span>
            <span style={{ fontSize: "12pt" }}>&nbsp;(Đơn vị: VNĐ)</span>
          </p>

          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              4.2. Phương thức thanh toán:{" "}
            </span>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              {orderDataDetail.data[0].payment_method}
            </span>
          </p>

          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Các công việc sau khi đã thực hiện xong, Bên A tiến hành nghiệm
              thu kiểm tra chất lượng đạt yêu cầu và nhận đủ giấy tờ kèm theo,
              Hóa đơn tài chính hợp lệ. Bên A phải thanh toán cho bên B 100% giá
              trị hợp đồng trong vòng 15 ngày (ngày làm việc) sau khi hoàn tất
              thủ tục thanh lý hợp đồng.
            </span>
          </p>

          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 5: </span>
                ĐIỀU KHOẢN THI HÀNH
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Bên B sau khi ký hợp đồng, nếu quá thời gian quy định trong hợp
              đồng 01 ngày không tiến hành công việc sẽ phải hoàn trả lại bên A
              số tiền bên A đã đặt cọc. Đồng thời, bên B sẽ phải chịu bồi thường
              cho bên A khoản tiền bằng số tiền bên A đã đặt cọc (trừ trường hợp
              hai bên có sự thỏa thuận khác về mặt thời gian).
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Bên A sau khi giao tiền đặt cọc, trong thời gian 15 ngày không
              thực hiện công việc thì hợp đồng sẽ tự hết hiệu lực, bên B toàn
              quyền xử lý khoản tiền đặt cọc.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 6: </span>
                HIỆU LỰC HỢP ĐỒNG
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Trường hợp có phát sinh tranh chấp hợp đồng, hai bên sẽ bàn bạc
              giải quyết trên tinh thần hợp tác. Trong trường hợp không tự giải
              quyết được hai bên sẽ tự đưa vụ việc ra giải quyết tại tòa án có
              thẩm quyến. Quyết định của tòa án là quyết định cuối cùng mà hai
              bên phải chấp hành.
            </span>
          </p>
          <br></br>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Hợp đồng này có hiệu lực kể từ ngày ký và tự hết hiệu lực khi
              các điều khoản của hợp đồng được thực hiện và không có khiếu nại
              của hai bên.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Hợp đồng được chia làm 02 bản, có giá trị pháp lý ngang nhau,
              mỗi bên giữ 01 bản.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 7: </span>
                ĐIỀU KHOẢN VÀ ĐIỀU KIỆN CHUNG
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              Bảng thống kê tài sản là một phần không thể tách rời của hợp đồng
              này.
            </span>
          </p>
          <table
            cellSpacing={0}
            cellPadding={0}
            style={{
              textAlign: "start",
              color: "rgb(0, 0, 0)",
              fontSize: 12,
              borderCollapse: "collapse",
            }}
          >
            <tbody className="row">
              <tr
                className="d-flex"
                style={{ justifyContent: "space-between", width: "700px" }}
              >
                <td>
                  <p style={{ textAlign: "center" }}>
                    <strong>
                      <span style={{ fontSize: "12pt" }}>BÊN A</span>
                    </strong>
                    <br />
                    <em>
                      <span style={{ fontSize: "12pt" }}>
                        (Ký, ghi rõ họ tên)
                      </span>
                      <p
                        style={{
                          fontSize: "12pt",
                          height: "30px",
                        }}
                      ></p>
                      <p style={{ fontSize: "12pt" }}>
                        {orderData.customer_full_name.toUpperCase()}
                      </p>
                    </em>
                  </p>
                </td>
                <td>
                  <p style={{ textAlign: "center" }}>
                    <strong>
                      <span style={{ fontSize: "12pt" }}>BÊN B</span>
                    </strong>
                    <br />
                    <em>
                      <span style={{ fontSize: "12pt" }}>
                        (Ký, ghi rõ họ tên)
                      </span>
                      <p
                        style={{
                          fontSize: "12pt",
                          height: "30px",
                        }}
                      ></p>
                      <p style={{ fontSize: "12pt" }}>HUỲNH THỊ TÂN</p>
                    </em>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  };

  //Xem file pdf
  const viewPDF = () => {
    const printElement = ReactDOMServer.renderToString(pdfJSX());
    // const printElement = pdfJSX();

    html2pdf()
      .from(printElement)
      .save();
  };

  return (
    <>
      <div className="d-flex">
        <div
          style={{
            width: "800px",
            maxHeight: "600px",
            overflowY: "scroll",
            padding: "10px",
          }}
        >
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <u>
                <span style={{ fontSize: "12pt" }}>
                  Độc lập – Tự do – Hạnh phúc
                </span>
              </u>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>&nbsp;</span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                HỢP ĐỒNG CUNG CẤP DỊCH VỤ
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                {orderData.service_name.toUpperCase()}
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
              fontWeight: "bold",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              Số:{orderData.date_created.split(",")[1]}/
            </span>
            <span style={{ fontSize: "12pt" }}>HĐVC</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <em>
              <span style={{ fontSize: "12pt" }}>
                Căn cứ Bộ Luật Dân sự số 91/2015/QH13 được Quốc hội nước CHXHCN
                Việt Nam thông qua ngày 24/11/2015;
              </span>
            </em>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <em>
              <span style={{ fontSize: "12pt" }}>
                Căn cứ Nghị định 58/2016/NĐ-CP quy định chi tiết về kinh doanh
                sản phẩm, dịch vụ mật mã dân sự và xuất khẩu, nhập khẩu sản phẩm
                mật mã dân sự
              </span>
            </em>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <em>
              <span style={{ fontSize: "12pt" }}>
                Căn cứ yêu cầu sử dụng dịch vụ của bên A và khả năng, điều kiện
                cung cấp dịch vụ của bên B.
              </span>
            </em>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <em>
              <span style={{ fontSize: "12pt" }}>
                Hôm nay, ngày {orderData.date_created.split(",")[1]}, chúng tôi
                gồm:
              </span>
            </em>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt", textDecoration: "underline" }}>
                Bên A:
              </span>
            </strong>
            <span style={{ fontSize: "12pt" }}>&nbsp;</span>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              {orderData.gender_customer == "Nam" ? "ÔNG" : "BÀ"}{" "}
              {orderData.customer_full_name.toUpperCase()}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Điện thoại:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              {orderData.phonenumber_customer}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Địa chỉ:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              {orderData.address_customer}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt", textDecoration: "underline" }}>
                Bên B:&nbsp;
              </span>
            </strong>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              CÔNG TY DỊCH VỤ DỌN NHÀ - FAST MOVE COMPANY
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
              display: "flex",
            }}
          >
            <span>
              <span style={{ fontSize: "12pt" }}>Đại diện:&nbsp;</span>
              <span style={{ fontSize: "12pt" }}>BÀ HUỲNH THỊ TÂN</span>
            </span>

            <span style={{ marginLeft: "40px" }}>
              <span style={{ fontSize: "12pt" }}>Chức vụ:&nbsp;</span>
              <span style={{ fontSize: "12pt" }}>Quản lý</span>
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Điện thoại:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>0992356425</span>
          </p>

          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Địa chỉ:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              Số 24 Độc Lập, Phường Tân Thành, Quận Tân Phú, TP.HCM
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <em>
                <span style={{ fontSize: "12pt" }}>
                  Sau khi bàn bạc và thảo luận, hai bên đi đến thống nhất ký kết
                  hợp đồng cung cấp dịch vụ vận chuyển đồ trọn gói với các điều
                  khoản sau:
                </span>
              </em>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 1: </span>
                NỘI DUNG CÔNG VIỆC
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              1.1. Bên A giao cho bên B thực hiện các công việc sau: Tháo gỡ,
              đóng gói, bao bọc đồ, tài sản và vật dụng trong văn phòng (nhà ở)
              của bên A (được liệt kê trong chi tiết đơn hàng).
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              1.2. Sau khi vận chuyển đến địa điểm theo yêu cầu của bên A, bên B
              tiến hành lắp đặt theo đúng thiết kế và yêu cầu của bên A trong
              phạm vi năng lực của bên B.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 2: </span>
                THỜI GIAN VÀ ĐỊA ĐIỂM THỰC HIỆN
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              2.1. Thời gian thực hiện công việc:
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Bên B thực hiện tháo gỡ và đóng gói đồ vào{" "}
              {orderData.time_get_item}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              (nếu có thay đổi về thời gian bên A có trách nhiệm thông báo cho
              bên B trước 02 ngày).
            </span>
          </p>

          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>2.2. Địa điểm vận chuyển:</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>- Từ địa chỉ:&nbsp;</span>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              {orderData.router.split("->")[0]}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>- Đến địa chỉ:&nbsp;</span>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              {orderData.router.split("->")[1]}
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              2.3. Các hạng mục công việc:
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Tháo gỡ, đóng gói, vận chuyển đến địa chỉ theo yêu cầu của bên
              A.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 3: </span>
                TRÁCH NHIỆM CỦA CÁC BÊN
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Trách nhiệm của bên A</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Thanh toán đầy đủ cho bên B theo Điều 4 của hợp đồng này.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Tạo điều kiện làm việc với ban quản lý tòa nhà/khu phố để bên B
              hoàn thành tốt công việc.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>2. Trách nhiệm của bên B</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Tháo gỡ, đóng gói, vận chuyển, lắp đặt đồ đạc theo đúng yêu cầu
              của bên A.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Đảm bảo đúng thời gian và an toàn khi tiến hành công việc.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Trong trường hợp đồ đạc bị đổ vỡ, mất mát, bên B cam kết bồi
              thường cho bên A theo đúng giá trị đồ vật trên thị trường tại thời
              điểm vận chuyển. Đồng thời, đại diện bên B cam kết gửi lời xin lỗi
              chân thành tới đại diện bên A.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 4: </span>
                GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>4.1. Giá trị hợp đồng là:</span>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              &nbsp;{orderData.totalOrder.toLocaleString()}
            </span>
            <span style={{ fontSize: "12pt" }}>&nbsp;(Đơn vị: VNĐ)</span>
          </p>

          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              4.2. Phương thức thanh toán:{" "}
            </span>
            <span style={{ fontSize: "12pt", fontWeight: "bold" }}>
              {orderDataDetail.data[0].payment_method}
            </span>
          </p>

          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Các công việc sau khi đã thực hiện xong, Bên A tiến hành nghiệm
              thu kiểm tra chất lượng đạt yêu cầu và nhận đủ giấy tờ kèm theo,
              Hóa đơn tài chính hợp lệ. Bên A phải thanh toán cho bên B 100% giá
              trị hợp đồng trong vòng 15 ngày (ngày làm việc) sau khi hoàn tất
              thủ tục thanh lý hợp đồng.
            </span>
          </p>

          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 5: </span>
                ĐIỀU KHOẢN THI HÀNH
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Bên B sau khi ký hợp đồng, nếu quá thời gian quy định trong hợp
              đồng 01 ngày không tiến hành công việc sẽ phải hoàn trả lại bên A
              số tiền bên A đã đặt cọc. Đồng thời, bên B sẽ phải chịu bồi thường
              cho bên A khoản tiền bằng số tiền bên A đã đặt cọc (trừ trường hợp
              hai bên có sự thỏa thuận khác về mặt thời gian).
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Bên A sau khi giao tiền đặt cọc, trong thời gian 15 ngày không
              thực hiện công việc thì hợp đồng sẽ tự hết hiệu lực, bên B toàn
              quyền xử lý khoản tiền đặt cọc.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 6: </span>
                HIỆU LỰC HỢP ĐỒNG
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Trường hợp có phát sinh tranh chấp hợp đồng, hai bên sẽ bàn bạc
              giải quyết trên tinh thần hợp tác. Trong trường hợp không tự giải
              quyết được hai bên sẽ tự đưa vụ việc ra giải quyết tại tòa án có
              thẩm quyến. Quyết định của tòa án là quyết định cuối cùng mà hai
              bên phải chấp hành.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Hợp đồng này có hiệu lực kể từ ngày ký và tự hết hiệu lực khi
              các điều khoản của hợp đồng được thực hiện và không có khiếu nại
              của hai bên.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Hợp đồng được chia làm 02 bản, có giá trị pháp lý ngang nhau,
              mỗi bên giữ 01 bản.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                <span style={{ textDecoration: "underline" }}>Điều 7: </span>
                ĐIỀU KHOẢN VÀ ĐIỀU KIỆN CHUNG
              </span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              Bảng thống kê tài sản là một phần không thể tách rời của hợp đồng
              này.
            </span>
          </p>
          <table
            cellSpacing={0}
            cellPadding={0}
            style={{
              textAlign: "start",
              color: "rgb(0, 0, 0)",
              fontSize: 12,
              borderCollapse: "collapse",
            }}
          >
            <tbody className="row">
              <tr
                className="d-flex"
                style={{ justifyContent: "space-between", width: "700px" }}
              >
                <td>
                  <p style={{ textAlign: "center" }}>
                    <strong>
                      <span style={{ fontSize: "12pt" }}>BÊN A</span>
                    </strong>
                    <br />
                    <em>
                      <span style={{ fontSize: "12pt" }}>
                        (Ký, ghi rõ họ tên)
                      </span>
                      <p
                        style={{
                          fontSize: "12pt",
                          marginLeft: "15px",
                          height: "30px",
                        }}
                      ></p>
                      <p style={{ fontSize: "12pt" }}>
                        {orderData.customer_full_name.toUpperCase()}
                      </p>
                    </em>
                  </p>
                </td>
                <td>
                  <p style={{ textAlign: "center" }}>
                    <strong>
                      <span style={{ fontSize: "12pt" }}>BÊN B</span>
                    </strong>
                    <br />
                    <em>
                      <span style={{ fontSize: "12pt" }}>
                        (Ký, ghi rõ họ tên)
                      </span>
                      <p
                        style={{
                          fontSize: "12pt",
                          marginLeft: "15px",
                          height: "30px",
                        }}
                      ></p>
                      <p style={{ fontSize: "12pt" }}>HUỲNH THỊ TÂN</p>
                    </em>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            border: "1px solid orange",
            borderRadius: "10px",
            width: "400px",
            height: "fit-content",
            padding: "10px",
            marginLeft: "10px",
          }}
        >
          <button className="btn btn-success" onClick={viewPDF}>
            Xuất file PDF <FilePdfOutlined />
          </button>

          {/* Trạng thái hợp đồng */}
          <div
            style={{
              border: "1px solid black",
              borderRadius: "10px",
              alignItems: "center",
              padding: "5px",
              fontSize: "15px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
            className="d-flex"
          >
            <span>Trạng thái hợp đồng:&nbsp;</span>
            <span
              style={{
                color: orderData.accept_contract == false ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {orderData.accept_contract == false
                ? "Chưa chấp thuận"
                : "Đã chấp thuận"}
            </span>
          </div>

          {orderData.accept_contract == false ? (
            <>
              {/* Lưu ý */}
              <div>
                <p style={{ fontStyle: "italic", fontWeight: "bold" }}>
                  Đọc kỹ nội dung bên trong hợp đồng và bấm nút chấp thuận ở bên
                  dưới nếu đã đồng ý với điều khoản trong hợp đồng ! <br />{" "}
                </p>
              </div>

              {/* Nút nhấn */}
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <button
                  className="btn btn-success text-white"
                  onClick={finishSign}
                >
                  Chấp thuận
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default ContractDelivery;
