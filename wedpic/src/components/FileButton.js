import './FileButton.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FileButton = () => {
  let navigate = useNavigate();
  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    if (chosenFiles.length > 10 || !chosenFiles.length)
      alert(`You can only add a maximum of 10 files`);
    else {
      navigate('/pics', { state: { chosenFiles } });
    }
  };

  return (
    <>
      <button className='filebutton'>
        <input
          type='file'
          multiple
          accept='image/png'
          className='transperentbutton'
          onChange={handleFileEvent}
        />
      </button>
    </>
  );
};
export default FileButton;
