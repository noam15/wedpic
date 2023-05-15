import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Pic from '../components/Pic';
import Modal from '../components/Modal';
import exifr from 'exifr/dist/full.esm.mjs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

const Button = styled.button`
	position: fixed;
	font-family: 'suez';
	font-size: 1.3em;
	left: 12vh;
	right: 12vh;
	bottom: 6vh;
	border-radius: 5vh;
	border: 0;
	height: 8vh;
`;
const PicsGrid = styled.div`
	display: grid;
	grid-template-columns: 40vw 40vw;
	padding: auto;
	width: 80vw;
	margin: auto;
	margin-bottom: 30vh;
	overflow: hidden;
	margin-top: 10vh;
	grid-row-gap: 3vh;
	margin-top: 7vh;
`;
const PicsTitle = styled.h1`
	text-align: center;
	padding-top: 5vh;
	color: aliceblue;
	font-family: 'suez';
	margin-bottom: 2vh;
	font-weight: 100;
	font-size: 3em;
	letter-spacing: 2px;
`;
const Buttons = styled.div`
	position: absolute;
	top: 48vh;
	margin: 0 5vw;
	font-size: 2em;
	color: white;
	width: 90vw;
	.next {
		position: absolute;
		left: 0;
		margin-left: -4vw;
	}
	.prev {
		position: absolute;
		right: 0;
		margin-right: -4vw;
	}
`;
const Pics = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { chosenFiles: initialPics } = location.state;
	let [currPage, setCurrPage] = useState(0);
	let [showPic, setShowPic] = useState(false);
	let [selectedPic, setSelectedPic] = useState({ src: '', index: -1 });
	let [currPics, setCurrPics] = useState([]);
	let [pics, setPics] = useState(initialPics);

	let paginatedPics = [];
	let fullArraysCount = Math.floor(pics.length / 4);
	let restOfPics = pics.length % 4;
	useEffect(() => {
		(async () => {
			console.log(await exifr.parse(pics[0]));
		})();
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
	}, [pics, currPage]);
	for (let i = 0; i < fullArraysCount; i++) {
		paginatedPics.push(pics.slice(i * 4, (i + 1) * 4));
	}
	if (restOfPics) paginatedPics.push(pics.slice(pics.length - restOfPics));

	const openModal = (e) => {
		setSelectedPic({
			src: e.target.src,
			index: pics.indexOf(
				pics.filter(
					(item) => item.name == e.target.getAttribute('data-pic-index')
				)[0]
			),
		});
		setShowPic(true);
	};
	const submitHandler = () => {
		const data = new FormData();
		pics.forEach((item) => data.append('files', item, item.name));
		fetch('https://wedpic-server.onrender.com/addImages', {
			method: 'post',
			body: data,
		}).then((res) => res.text());
		localStorage.setItem(
			'numOfPics',
			(
				parseInt(
					Number.isInteger(localStorage.getItem('numOfPics'))
						? localStorage.getItem('numOfPics')
						: '0'
				) + pics.length
			).toString()
		);
		navigate('/thank-you');
	};
	return (
		<>
			{showPic && (
				<Modal
					src={selectedPic.src}
					onClose={() => setShowPic(false)}
					setPics={(pics) => {
						setPics(pics);
					}}
					index={selectedPic.index}
				/>
			)}
			<PicsTitle>אישור תמונות</PicsTitle>
			<p
				style={{
					textAlign: 'center',
					color: 'white',
					fontFamily: 'Gulash',
					fontSize: '5vh',
					marginTop: '-2vh',
				}}
			>
				אישור סופי ואחרון בלי חרטות
			</p>
			<PicsGrid>
				{currPics.map((src, key) => (
					<Pic
						key={key}
						index={src.name}
						src={URL.createObjectURL(src)}
						onClick={openModal}
					/>
				))}
			</PicsGrid>
			<Buttons>
				{currPage !== paginatedPics.length - 1 && (
					<p className='next' onClick={() => setCurrPage((curr) => curr + 1)}>
						<SlArrowLeft />{' '}
					</p>
				)}
				{currPage !== 0 && (
					<p className='prev' onClick={() => setCurrPage((curr) => curr - 1)}>
						<SlArrowRight />{' '}
					</p>
				)}
			</Buttons>
			<Button onClick={submitHandler}>העלאה</Button>
		</>
	);
};

export default Pics;
