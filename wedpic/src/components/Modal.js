import Pic from './Pic';
import styled from 'styled-components';
import { useState } from 'react';

const StyledModal = styled.div`
  height: ${(props) => (props.open ? '100%' : 0)};
  width: ${(props) => (props.open ? '100%' : 0)};
  background: rgba(0, 0, 0, 0.4);
  padding: 3vw;
  position: relative;
  z-index: 5;
  &:hover ${Pic} {
    filter: blur(50%) brightness(25%);
  }
  &:hover .overlay {
    opacity: 1;
  }
  p {
    position: absolute;
    top: 1em;
    right: 1em;
    z-index: 11;
  }
  .overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 0;
    transition: 0.5s ease;
    z-index: 10;
  }
`;

const Modal = ({ src, open, onClose, setPics, index }) => {
  const [file, setFile] = useState(src);
  const changeFile = () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.onChange = () => {
      const selectedFile = Array.from(input.files)[0];
      setFile(selectedFile);
      setPics((pics) => (pics[index] = file));
    };
    input.click();
  };

  const deleteFile = () => {
    setPics((pics) => {
      pics.splice(index, index);
      return pics;
    });
    onClose();
  };

  return (
    <StyledModal open={open}>
      <p onClick={onClose}>X</p>
      <Pic src={file} />
      <div className='overlay'>
        <p onClick={changeFile}> Change</p> |{' '}
        <p onClick={deleteFile}> Delete</p>
      </div>
    </StyledModal>
  );
};

export default Modal;
