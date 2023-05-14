import FileButton from '../components/FileButton';
import ImageComponent from '../components/ImageComponent';
import './HomePage.css';
function HomePage() {
	const numOfUploadedPics = localStorage.getItem('numOfPics');
	return (
		<div className='HomePage'>
			<div className='imagediv'>
				<div className='squarediv'>
					<div className='App-header'>
						<a className='headlinestyle'> בר & ישי</a>
						<p>17.5.2023</p>
						<div className='explainingviv'>
							{' '}
							אז על מה לעזזל אתם מסתכלים? באתר זה נמצא האלבום הדיגיטלי של החתונה
							אז איך זה עובד? בעזרתכם כמובן, בכפתור מטה תוכלו להעלות עד 10
							תמונות שצילמתם באירוע ואם תשיכו ללגלול תוכלו לצפות באלבום שמתחיל
							להיווצר מהתמונות שעולות
						</div>
					</div>
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
