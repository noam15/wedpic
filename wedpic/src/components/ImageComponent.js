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
	return (
		<div className='imggridComponent'>
			{pics &&
				pics.map((pic, key) => (
					<img className='ImageComponent' src={pic} key={key} />
				))}
		</div>
	);
};
export default ImageComponent;
