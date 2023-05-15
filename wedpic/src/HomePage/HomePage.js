import FileButton from '../components/FileButton';
import ImageComponent from '../components/ImageComponent';
import './HomePage.css';
function HomePage() {
	const numOfUploadedPics = localStorage.getItem('numOfPics');
	return (
		<div className='HomePage'>
			<div className='squarediv'>
				<div className='container'>
					<img id='image1' className='image' />
					<img id='image2' className='image' />
					<img id='image3' className='image' />
				</div>
				<div className='App-header'>
					<a className='headlinestyle'>
						<p>ברוכים הבאים</p>
						<p>לחתונה של</p>
						<p>ישי ובר</p>
					</a>
					<div className='thanksstyle'>איזה כיף שבאתם</div>
					<div className='explainingviv'></div>
				</div>
			</div>

			<div className='Grid-page'>
				<ImageComponent></ImageComponent>
			</div>
			<FileButton numOfUploadedPics={numOfUploadedPics}></FileButton>
		</div>
	);
}

export default HomePage;
