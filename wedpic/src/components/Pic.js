import { FaTrash } from 'react-icons/fa';

const Pic = ({ src, onClick, onClose, deleteFile, isModal, index }) => {
  return (
    <div
      className='div-container'
      style={{
        maxWidth: '35vw',
        margin: 'auto',
        background: 'white',
        height: '25vh',
        borderRadius: '.1em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        border: 'solid 1em white',
      }}
      onClick={onClick}
    >
      {isModal && (
        <div
          className='buttons'
          style={{
            position: 'absolute',
            top: '1.2em',
            fontSize: '.8em',
            zIndex: '13',
            padding: 0,
            width: '100%',
          }}
        >
          <p
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              margin: 0,
              right: '1em',
              zIndex: '15',
            }}
          >
            X
          </p>
          <p
            onClick={deleteFile}
            style={{
              position: 'absolute',
              top: 0,
              margin: 0,
              left: '1em',
              zIndex: '15',
            }}
          >
            <FaTrash />
          </p>
        </div>
      )}
      <img
        style={{
          width: '35vw',
          minWidth: '35vw',
          padding: '.2em',
          height: '25vh',
          objectFit: 'cover',
          borderRadius: '.1em',
        }}
        src={src}
        data-pic-index={index}
        alt='img'
      />
    </div>
  );
};

export default Pic;
