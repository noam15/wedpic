import "./ThankYou.css"
import mimions from '../assets/minion-love-kevin-love.gif'

const ThankYou = () => {
	return <div className="placer">
		<p className="text1">תודה על העלאת התמונות</p>
		<img  className="imageminons" src={mimions} />
		<p className="text2">זהו, אתם יכולים לסגור את הדף </p>
		
	</div>
	
};

export default ThankYou;
