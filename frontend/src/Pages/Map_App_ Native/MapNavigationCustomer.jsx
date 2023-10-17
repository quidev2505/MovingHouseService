import * as React from "react";
import { useState, useEffect } from "react";

import database from "../../firebase";
// app.js
import "@goongmaps/goong-js/dist/goong-js.css";

import polyline from "@mapbox/polyline";

import goongjs from "@goongmaps/goong-js";

import { useNavigate, useParams } from "react-router-dom";

function MapNavigationCustomer() {
  const params = useParams();

  const draw_two_location = async () => {
    var id_order = params.id_order;
    // var latStart = location.split("-")[0];
    // var lonStart = location.split("-")[1];
    // var latEnd = location.split("-")[2];
    // var lonEnd = location.split("-")[3];

    database.ref(`/deliveryMap/${id_order}`).on("value", (snapshot) => {
      // Dữ liệu mới
      const data = snapshot.val();
      console.log(data);

      var latStart = data.lat;
      var lonStart = data.lon;
      var status = data.status;

      goongjs.accessToken = "e463pcPnhB8NBBERWcmjUyA3C2aNrE3PPb6uONZu";
      var map = new goongjs.Map({
        container: "map",
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [lonStart, latStart],
        zoom: 12,
      });

      //Thiết lập điểm bắt đầu -> Điểm lấy hàng
      var marker = new goongjs.Marker({
        color: "orange",
      })
        .setLngLat([lonStart, latStart])
        .addTo(map);

      var navi_map = setInterval(() => {
        if (status === "Đã kết thúc") {
          alert("Đã đến điểm dừng !");
          clearInterval(navi_map);
        } else {
          var marker = new goongjs.Marker()
            .setLngLat([lonStart, latStart])
            .addTo(map);

          map.flyTo({
            center: [lonStart, latStart],
            zoom: 20,
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          });
        }
      }, 3000);
    });
  };

  useEffect(() => {
    setInterval(() => {
      draw_two_location();
    },3000);
  }, []);

  return (
    <div
      className="container showMap"
      style={{
        overFlow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        id="map"
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      ></div>
    </div>
  );
}

export default MapNavigationCustomer;
