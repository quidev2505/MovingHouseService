import * as React from "react";
import { useEffect, useState } from "react";
import ReactMapGL, {
  GeolocateControl,
  FullscreenControl,
  ScaleControl,
  NavigationControl,
  Marker,
  FlyToInterpolator,
} from "@goongmaps/goong-map-react";

// app.js
import "@goongmaps/goong-js/dist/goong-js.css";





const geolocateStyle = {
  top: 0,
  left: 0,
  padding: "10px",
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: "10px",
};

const navStyle = {
  top: 72,
  left: 0,
  padding: "10px",
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: "10px",
};

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 20;

function MapBox({ fromLocation, toLocation }) {
  const [viewport, setViewport] = React.useState({
    latitude: 10.0165936,
    longitude: 105.7652286,
    zoom: 12,
  }); //Địa điểm hiện tại ở Đại học Cần Thơ

  //Mark From DOM
  const [markDOM_From, setMarkDOM_From] = useState();
  const [markDOM_To, setMarkDOM_To] = useState();
  //FROM
  const mark_from_location = () => {
    let data_init_lat = 0;
    let data_init_long = 0;

    if (fromLocation.lat !== undefined) {
      data_init_long = fromLocation.lng;
      data_init_lat = fromLocation.lat;
      setViewport({
        ...viewport,
        longitude: data_init_long,
        latitude: data_init_lat,
        zoom: 14,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
        transitionDuration: "auto",
      });
    }

    const DOM_FROM_LOCATION = (
      <>
        <Marker
          key={`marker-1`}
          longitude={data_init_long}
          latitude={data_init_lat}
        >
          <span style={{ color: "red" }}>
            {fromLocation.name ? "1." + fromLocation.name : ""}
          </span>

          <svg
            height={SIZE}
            viewBox="0 0 24 24"
            style={{
              cursor: "pointer",
              fill: "#d00",
              stroke: "none",
              transform: `translate(${-SIZE / 2}px,${-SIZE}px)`,
            }}
          >
            <path d={ICON} />
          </svg>
        </Marker>
      </>
    );

    setMarkDOM_From(DOM_FROM_LOCATION);
  };

  //TO
  const mark_to_location = () => {
    let data_init_lat = 0;
    let data_init_long = 0;

    if (toLocation.lat !== undefined) {
      data_init_long = toLocation.lng;
      data_init_lat = toLocation.lat;
      setViewport({
        ...viewport,
        longitude: data_init_long,
        latitude: data_init_lat,
        zoom: 14,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
        transitionDuration: "auto",
      });
    }

    const DOM_TO_LOCATION = (
      <>
        <Marker
          key={`marker-1`}
          longitude={data_init_long}
          latitude={data_init_lat}
        >
          <span style={{ color: "#00bab3" }}>
            {toLocation.name ? "2." + toLocation.name : ""}
          </span>

          <svg
            height={SIZE}
            viewBox="0 0 24 24"
            style={{
              cursor: "pointer",
              fill: "#00bab3",
              stroke: "none",
              transform: `translate(${-SIZE / 2}px,${-SIZE}px)`,
            }}
          >
            <path d={ICON} />
          </svg>
        </Marker>
      </>
    );

    setMarkDOM_To(DOM_TO_LOCATION);
  };

  useEffect(() => {
    setTimeout(() => {
      mark_from_location();
    }, 1000);

    setTimeout(() => {
      mark_to_location();
    }, 2000);
  }, [fromLocation, toLocation]);


  return (
    <>
      <ReactMapGL
        goongApiAccessToken="e463pcPnhB8NBBERWcmjUyA3C2aNrE3PPb6uONZu"
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={(viewport) => setViewport(viewport)}
      >
        {markDOM_From ? markDOM_From : ""}
        {markDOM_To ? markDOM_To : ""}

        <GeolocateControl style={geolocateStyle} />
        <FullscreenControl style={fullscreenControlStyle} />
        <NavigationControl style={navStyle} />
        <ScaleControl style={scaleControlStyle} />
      </ReactMapGL>

    
    </>
  );
}

export default MapBox;
