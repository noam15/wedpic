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
<<<<<<< HEAD
					accept='image/png'
					className='transperentbutton'
					onChange={handleFileEvent}
					
=======
					accept='image/*'
					className='transperentbutton'
					onChange={handleFileEvent}
>>>>>>> 47df85a4245c0ac82d460da1b1a5e8c1c36a3121
				/>
			</button>
		</>
	);
};
export default FileButton;
