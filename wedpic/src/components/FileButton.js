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
					accept='image/*'
					className='transperentbutton'
					onChange={handleFileEvent}
				/>
				<p
					style={{
						position: 'absolute',
						top: '25%',
						left: '50%',
						width: '100%',
						transform: 'translate(-50%, -50%)',
						zIndex: -3,
					}}
				>
					העלאת תמונות
				</p>
			</button>
		</>
	);
};
export default FileButton;
