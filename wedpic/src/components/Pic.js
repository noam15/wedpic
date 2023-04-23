import { FaTrash } from 'react-icons/fa';

const Pic = ({ src, onClick, onClose, deleteFile, isModal }) => {
	return (
		<div
			className='div-container'
			style={{
				maxWidth: '35vw',
				margin: 'auto',
				background: '#f6f6f6',
				height: '35vw',
				borderRadius: '1em',
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
					height: '35vw',
					objectFit: 'cover',
					borderRadius: '1em',
				}}
				src={src}
				alt='img'
			/>
		</div>
	);
};

export default Pic;
