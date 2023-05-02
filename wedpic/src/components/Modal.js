import Pic from './Pic';
import styled from 'styled-components';

const StyledModal = styled.div`
  height: fill-available;
  top: 0;
  width: fill-available;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  position: fixed;
  z-index: 5;
  img {
    width: 80vw !important;
    z-index: 11;
    object-fit: initial !important;
    height: initial !important;
  }
  .div-container {
    max-width: 85vw !important;
    height: initial !important;
    padding: 1em;
    padding-top: 4em;
  }
  p {
    position: absolute;
    top: 58vw;
    right: 15vw;
    z-index: 11;
    font-size: 2em;
    font-weight: bold;
  }
  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 1;
    transition: 0.5s ease;
    z-index: 10;
    p {
      left: 15vw;
      right: auto;
      top: 62vw;
      font-size: 1.5em;
    }
  }
`;

const Modal = ({ src, onClose, setPics, index }) => {
  const deleteFile = () => {
    setPics((pics) => {
      console.log(index);
      console.log(pics);
      pics.splice(index, index);
      return pics;
    });
    onClose();
  };

  return (
    <StyledModal>
      <Pic src={src} onClose={onClose} deleteFile={deleteFile} isModal={true} />
      <div className='overlay' onClick={onClose}></div>
    </StyledModal>
  );
};

export default Modal;
