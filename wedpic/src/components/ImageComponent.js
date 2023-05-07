import './ImageComponent.css';
import React from 'react';
import { useState, useEffect } from 'react';

const ImageComponent = () => {
	const [pics, setPics] = useState([]);
	useEffect(() => {
		fetch('https://wedpic-server.onrender.com/getImages')
			.then((res) => res.json())
			.then((res) => setPics(res));
	}, []);
	return <>{pics && pics.map((pic, key) => <img src={pic} key={key} />)}</>;
};
export default ImageComponent;
