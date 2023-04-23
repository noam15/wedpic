import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Pic from '../components/Pic';
import Modal from '../components/Modal';
import exifr from 'exifr/dist/full.esm.mjs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Button = styled.button`
	position: fixed;
	left: 2em;
	right: 2em;
	bottom: 4em;
	border-radius: 5em;
	border: 0;
	height: 4em;
`;
const PicsGrid = styled.div`
	display: grid;
	grid-template-columns: 40vw 40vw;
	padding: auto;
	width: 80vw;
	margin: auto;
	margin-bottom: 30vh;
	margin-top: 10vh;
`;
const PicsTitle = styled.h1`
	text-align: center;
	padding-top: 5vh;
	color: aliceblue;
`;
const Buttons = styled.div`
	position: absolute;
	top: 44vh;
	margin: 0 5vw;
	font-size: 2em;
	width: 90vw;
	.next {
		position: absolute;
		left: 0;
	}
	.prev {
		position: absolute;
		right: 0;
	}
`;
const Pics = () => {
	const location = useLocation();
	const initialPics = location.state;
	let [currPage, setCurrPage] = useState(0);
	let [showPic, setShowPic] = useState(false);
	let [selectedPic, setSelectedPic] = useState({ src: '', index: -1 });
	let [currPics, setCurrPics] = useState([]);
	let [pics, setPics] = useState(initialPics);

	let paginatedPics = [];
	let fullArraysCount = Math.floor(pics.length / 4);
	let restOfPics = pics.length % 4;
	useEffect(() => {
		console.log(pics);
		paginatedPics = [];
		fullArraysCount = Math.floor(pics.length / 4);
		restOfPics = pics.length % 4;
		for (let i = 0; i < fullArraysCount; i++) {
			paginatedPics.push(pics.slice(i * 4, (i + 1) * 4));
		}
		if (restOfPics) paginatedPics.push(pics.slice(pics.length - restOfPics));
		if (!paginatedPics[currPage]) {
			setCurrPage(paginatedPics.length - 1);
			paginatedPics.pop();
		}
		setCurrPics(paginatedPics[currPage]);
	}, [pics]);
	for (let i = 0; i < fullArraysCount; i++) {
		paginatedPics.push(pics.slice(i * 4, (i + 1) * 4));
	}
	if (restOfPics) paginatedPics.push(pics.slice(pics.length - restOfPics));

	const openModal = (e) => {
		setSelectedPic({ src: e.target.src, index: pics.indexOf(e.target.src) });
		setShowPic(true);
	};
	const submitHandler = () => {
		//TODO: Add Cloudinary API support
		const data = new FormData();
		pics.forEach((item) => data.append('files', item, item.name));
		fetch('http://localhost:8080/addImages', {
			method: 'post',
			body: data,
		})
			.then((res) => res.text())
			.then((res) => console.log(res));
	};
	return (
		<>
			<Modal
				open={showPic}
				src={selectedPic.src}
				onClose={() => setShowPic(false)}
				setPics={setPics}
				index={selectedPic.index}
			/>
			<PicsGrid>
				{/* {currPics.map((src, key) => (
          <Pic key={key} src={src} onCLick={openModal} />
        ))} */}
			</PicsGrid>
			<Buttons>
				{currPage !== paginatedPics.length - 1 && (
					<p className='next' onClick={() => setCurrPage((curr) => curr + 1)}>
						הבא
					</p>
				)}
				{currPage !== 0 && (
					<p className='prev' onClick={() => setCurrPage((curr) => curr - 1)}>
						הקודם
					</p>
				)}
			</Buttons>
			<Button onClick={submitHandler}>העלה</Button>
		</>
	);
};

export default Pics;
