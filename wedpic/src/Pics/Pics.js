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
    })
      .then((res) => res.text())
      .then((res) => localStorage.setItem('numOfPics', (parseInt(localStorage.getItem('numOfPics'))+pics.length).toString()));
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
            <FaChevronLeft />{' '}
          </p>
        )}
        {currPage !== 0 && (
          <p className='prev' onClick={() => setCurrPage((curr) => curr - 1)}>
            <FaChevronRight />{' '}
          </p>
        )}
      </Buttons>
      <Button onClick={submitHandler}>העלה</Button>
    </>
  );
};

export default Pics;
