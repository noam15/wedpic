import './ImageComponent.css';
import React from 'react';
import { useState, useEffect } from 'react';
import fireworks from '../trypicfierwork.jpg';

const ImageComponent = () => {
  const [pics, setPics] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8080/getImages')
      .then((res) => res.json())
      .then((res) => setPics(res));
  }, []);
  return (
    <>
      {pics &&
        pics.map((pic, key) => (
          <img src={'data:image/png;base64,' + pic} key={key} />
        ))}
    </>
  );
};
export default ImageComponent;
