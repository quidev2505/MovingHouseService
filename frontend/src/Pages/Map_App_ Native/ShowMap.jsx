import * as React from "react";
import { useState, useEffect } from "react";

// app.js
import "@goongmaps/goong-js/dist/goong-js.css";

import polyline from "@mapbox/polyline";

import goongjs from "@goongmaps/goong-js";

import { useNavigate, useParams } from "react-router-dom";

function ShowMap() {
  const params = useParams();

  const get_from_location = () => {
    const location = params.location;
    console.log(location)
    goongjs.accessToken = "e463pcPnhB8NBBERWcmjUyA3C2aNrE3PPb6uONZu";
    var map = new goongjs.Map({
      container: "map",
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [105.864323, 20.981971],
      zoom: 10,
    });

    var size = 200;

    // implementation of CustomLayerInterface to draw a pulsing dot icon on the map
    // see https://docs.goong.io/javascript/properties/#customlayerinterface for more info
    var pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // get rendering context for the map canvas when layer is added to the map
      onAdd: function() {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
      },

      // called once before every frame where the icon will be used
      render: function() {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 100, 100, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      },
    };

    map.on("load", function() {
      map.addImage("pulsing-dot", pulsingDot, {
        pixelRatio: 2,
      });

      map.addSource("points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                message: "Foo",
                iconSize: [60, 60],
              },
              geometry: {
                type: "Point",
                coordinates: [105.7652286, 10.0165936],
              },
            },
          ],
        },
      });
      map.addLayer({
        id: "points",
        type: "symbol",
        source: "points",
        layout: {
          "icon-image": "pulsing-dot",
        },
      });

      // var popup = new goongjs.Popup({ closeOnClick: false })
      //   .setLngLat([105.7652286, 10.0165936])
      //   .setHTML("<h1>Đây là vị trí của bạn</h1>")
      //   .addTo(map);

      // Add zoom and rotation controls to the map.
      map.addControl(new goongjs.NavigationControl());
    });
  };

  useEffect(() => {
    get_from_location();
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

export default ShowMap;
