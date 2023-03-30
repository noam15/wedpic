import './ImageComponent.css';
import fireworks from '../trypicfierwork.jpg';

const ImageComponent = () => {
	return (
		<>
			<img src={fireworks} height={200} width={200}></img>
		</>
	);
};
export default ImageComponent;
