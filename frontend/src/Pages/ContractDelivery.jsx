import React, { useState, useEffect, useRef } from "react";

import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js/dist/html2pdf.min";

import { FilePdfOutlined } from "@ant-design/icons";

import SignaturePad from "react-signature-pad";
import Swal from "sweetalert2/dist/sweetalert2.js";
import axios from "axios";

function ContractDelivery({ orderData }) {
  let sigPad = useRef({});

  useEffect(() => {
    var canvas = document.getElementsByTagName("canvas")[0];
    canvas.width = 380;
    canvas.height = 150;

    //Kiểm tra đã có chữ ký chưa
    sigPad.current.fromDataURL(orderData.electronic_signature);
  }, []);

  function clearSign() {
    sigPad.current.clear();
  }

  async function finishSign() {
    const data_update_signal = sigPad.current.toDataURL();
    axios
      .patch(`/v1/order/updateonefield_order/${orderData.order_id}`, {
        electronic_signature: data_update_signal,
      })
      .then((data) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cập nhật chữ ký điện tử thành công",
          showConfirmButton: false,
          timer: 1000,
        });
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Cập nhật chữ ký điện tử thất bại",
          showConfirmButton: false,
          timer: 1000,
        });
      });
  }

  const pdfJSX = () => {
    return (
      <>
        <div style={{ width: "800px", padding: "20px", paddingTop: "10px" }}>
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
              <span style={{ fontSize: "12pt" }}>CHUYỂN NHÀ TRỌN GÓI</span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Số:……./</span>
            <span style={{ fontSize: "12pt" }}>HĐ….</span>
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
                Hôm nay, ngày...tháng...năm.... tại……………………….Chúng tôi gồm:
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
              <span style={{ fontSize: "12pt" }}>Bên A:</span>
            </strong>
            <span style={{ fontSize: "12pt" }}>&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>MSDN:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
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
              …………………………………………………………………………….
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Tài khoản:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Đại diện:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
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
              …………………………………………………………………………….
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
              <span style={{ fontSize: "12pt" }}>Bên B:&nbsp;</span>
            </strong>
            <span style={{ fontSize: "12pt" }}>………</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………….
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>MSDN:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
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
              …………………………………………………………………………….
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Đại diện:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
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
              …………………………………………………………………………….
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
                Điều 1: NỘI DUNG CÔNG VIỆC
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
              của bên A (được liệt kê trong danh mục vận chuyển kèm theo hợp
              đồng này).
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
              marginTop: "40px",
            }}
          >
            <strong>
              <span style={{ fontSize: "12pt" }}>
                Điều 2: THỜI GIAN VÀ ĐỊA ĐIỂM THỰC HIỆN
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
              - Bên B thực hiện tháo gỡ và đóng gói đồ vào ..... giờ,
              ngày...tháng...năm...
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
            <span style={{ fontSize: "12pt" }}>
              Thời gian thực hiện công việc có sự thay đổi:&nbsp;
            </span>
            <span style={{ fontSize: "12pt" }}>……………………………………</span>
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
            <span style={{ fontSize: "12pt" }}>……………………………………</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>- Đến địa chỉ:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>……………………………………</span>
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
                Điều 3: TRÁCH NHIỆM CỦA CÁC BÊN
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
                Điều 4. GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN
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
            <span style={{ fontSize: "12pt" }}>&nbsp;…………………..</span>
            <span style={{ fontSize: "12pt" }}>
              &nbsp;(Đơn vị: VNĐ, chưa bao gồm 10% thuế VAT)
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Viết bằng chữ:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              ……………………………………………………………………..
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
              4.2. Phương thức thanh toán
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
              - Ngay sau khi hai bên thống nhất khối lượng công việc, giá cả và
              ký hợp đồng, bên A đặt cọc trước cho bên B là 10% giá trị hợp
              đồng. Số tiền đặt trước là:
            </span>
            <span style={{ fontSize: "12pt" }}>&nbsp;……………</span>
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
              Số tiền viết bằng chữ:&nbsp;
            </span>
            <span style={{ fontSize: "12pt" }}>………………………………………………………</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Sau khi hoàn thành công việc, bên A tiến hành nghiệm thu và đánh
              giá chất lượng công việc. Sau khi nhận biên bản nghiệm thu, thanh
              lý hợp đồng, hóa đơn VAT, bên A có trách nhiệm thanh toán cho bên
              B số tiền là 90% giá trị hợp đồng còn lại.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>4.3. Hình thức thanh toán</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Trực tiếp bằng tiền mặt cho đại điện bên B &nbsp; &nbsp; &nbsp;
              &nbsp;&nbsp;
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
              - Chuyển khoản qua ngân hàng
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
                Điều 5: ĐIỀU KHOẢN THI HÀNH
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
                Điều 6. HIỆU LỰC HỢP ĐỒNG
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
                Điều 7. ĐIỀU KHOẢN VÀ ĐIỀU KIỆN CHUNG
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
              <span style={{ fontSize: "12pt" }}>CHUYỂN NHÀ TRỌN GÓI</span>
            </strong>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Số:……./</span>
            <span style={{ fontSize: "12pt" }}>HĐ….</span>
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
                Hôm nay, ngày...tháng...năm.... tại……………………….Chúng tôi gồm:
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
              <span style={{ fontSize: "12pt" }}>Bên A:</span>
            </strong>
            <span style={{ fontSize: "12pt" }}>&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>MSDN:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
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
              …………………………………………………………………………….
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Tài khoản:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Đại diện:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
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
              …………………………………………………………………………….
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
              <span style={{ fontSize: "12pt" }}>Bên B:&nbsp;</span>
            </strong>
            <span style={{ fontSize: "12pt" }}>………</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………….
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>MSDN:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
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
              …………………………………………………………………………….
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Đại diện:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              …………………………………………………………………………….
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
              …………………………………………………………………………….
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
                Điều 1: NỘI DUNG CÔNG VIỆC
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
              của bên A (được liệt kê trong danh mục vận chuyển kèm theo hợp
              đồng này).
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
                Điều 2: THỜI GIAN VÀ ĐỊA ĐIỂM THỰC HIỆN
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
              - Bên B thực hiện tháo gỡ và đóng gói đồ vào ..... giờ,
              ngày...tháng...năm...
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
            <span style={{ fontSize: "12pt" }}>
              Thời gian thực hiện công việc có sự thay đổi:&nbsp;
            </span>
            <span style={{ fontSize: "12pt" }}>……………………………………</span>
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
            <span style={{ fontSize: "12pt" }}>……………………………………</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>- Đến địa chỉ:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>……………………………………</span>
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
                Điều 3: TRÁCH NHIỆM CỦA CÁC BÊN
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
                Điều 4. GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN
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
            <span style={{ fontSize: "12pt" }}>&nbsp;…………………..</span>
            <span style={{ fontSize: "12pt" }}>
              &nbsp;(Đơn vị: VNĐ, chưa bao gồm 10% thuế VAT)
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>Viết bằng chữ:&nbsp;</span>
            <span style={{ fontSize: "12pt" }}>
              ……………………………………………………………………..
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
              4.2. Phương thức thanh toán
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
              - Ngay sau khi hai bên thống nhất khối lượng công việc, giá cả và
              ký hợp đồng, bên A đặt cọc trước cho bên B là 10% giá trị hợp
              đồng. Số tiền đặt trước là:
            </span>
            <span style={{ fontSize: "12pt" }}>&nbsp;……………</span>
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
              Số tiền viết bằng chữ:&nbsp;
            </span>
            <span style={{ fontSize: "12pt" }}>………………………………………………………</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Sau khi hoàn thành công việc, bên A tiến hành nghiệm thu và đánh
              giá chất lượng công việc. Sau khi nhận biên bản nghiệm thu, thanh
              lý hợp đồng, hóa đơn VAT, bên A có trách nhiệm thanh toán cho bên
              B số tiền là 90% giá trị hợp đồng còn lại.
            </span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>4.3. Hình thức thanh toán</span>
          </p>
          <p
            style={{
              textAlign: "justify",
              color: "rgb(0, 0, 0)",
              fontSize: "12pt",
            }}
          >
            <span style={{ fontSize: "12pt" }}>
              - Trực tiếp bằng tiền mặt cho đại điện bên B &nbsp; &nbsp; &nbsp;
              &nbsp;&nbsp;
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
              - Chuyển khoản qua ngân hàng
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
                Điều 5: ĐIỀU KHOẢN THI HÀNH
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
                Điều 6. HIỆU LỰC HỢP ĐỒNG
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
                Điều 7. ĐIỀU KHOẢN VÀ ĐIỀU KIỆN CHUNG
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
            height: "400px",
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
                color: orderData.electronic_signature == null ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {orderData.electronic_signature == null ? "Chưa ký" : "Đã ký"}
            </span>
          </div>
          {/* Lưu ý */}
          <div>
            <p style={{ fontStyle: "italic", fontWeight: "bold" }}>
              Đọc kỹ nội dung bên trong hợp đồng và ký tên vào bên dưới <br />
              (Xác nhận hợp đồng với chữ ký điện tử){" "}
            </p>
          </div>

          <div style={{ border: "2px solid #ccc", borderRadius:"10px" }}>
            <SignaturePad ref={sigPad} penColor="black" />
          </div>

          {/* Nút nhấn */}
          <div
            style={{
              display:
                orderData.electronic_signature != null ? "none" : "block",
            }}
          >
            <button
              className="btn btn-warning text-white"
              onClick={clearSign}
              style={{ marginRight: "20px" }}
            >
              Xóa
            </button>
            <button className="btn btn-success text-white" onClick={finishSign}>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContractDelivery;
