import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Pic from '../components/Pic';
import Modal from '../components/Modal';

const Button = styled.button``;
const PicsGrid = styled.div``;
const Buttons = styled.div``;
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
	};
	return (
		<>
			{/* <Modal
        open={showPic}
        src={selectedPic.src}
        onClose={() => setShowPic(false)}
        setPics={setPics}
        index={selectedPic.index}
      /> */}
			<PicsGrid>
				{currPics.map((src, key) => (
					<Pic key={key} src={src} onCLick={openModal} />
				))}
			</PicsGrid>
			<Buttons>
				{currPage !== paginatedPics.length - 1 && (
					<p className='next' onClick={() => setCurrPage((curr) => curr + 1)}>
						next
					</p>
				)}
				{currPage !== 0 && (
					<p className='prev' onClick={() => setCurrPage((curr) => curr - 1)}>
						prev
					</p>
				)}
			</Buttons>
			<Button onClick={submitHandler}>Submit</Button>
		</>
	);
};

export default Pics;
