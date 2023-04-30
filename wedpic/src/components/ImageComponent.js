import "./ImageComponent.css";
import React from "react";
import { useState, useEffect } from "react";
import im1 from "../assets/try1.jpg";
import im3 from "../assets/try2.jpg";
import im2 from "../assets/try3.jpg";

const ImageComponent = () => {
  const [pics, setPics] = useState([im1, im2, im3]);
  // useEffect(() => {
  //   fetch("http://localhost:8080/getImages")
  //     .then((res) => res.json())
  //     .then((res) => setPics(res));
  // }, []);
  return (
    <div className="imggridComponent">
      {pics &&
        pics.map((pic, key) => (
          <img className="ImageComponent" src={pic} key={key} />
        ))}
    </div>
  );
};
export default ImageComponent;
