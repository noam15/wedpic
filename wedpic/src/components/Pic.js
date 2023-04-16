const Pic = ({ src, onClick }) => {
	const arrayBufferToBase64 = (buffer) => {
		let binary = '';
		let bytes = new Uint8Array(buffer);
		let len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	};
	return <img src={URL.createObjectURL(src)} alt='img' onClick={onClick} />;
};

export default Pic;
