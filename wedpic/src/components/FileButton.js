import './FileButton.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FileButton = () => {
  const MAX_COUNT = 10;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  let navigate = useNavigate();
  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };

  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
    navigate('/pics', { state: uploadedFiles });
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
          disabled={fileLimit}
        />
      </button>
    </>
  );
};
export default FileButton;
