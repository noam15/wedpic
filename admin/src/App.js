import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import './App.css';
import TimeFrame from './TimeFrame';

const { Header, Content } = Layout;
function App() {
	const [data, setData] = useState([]);
	useEffect(() => {
		fetch('http://localhost:8080/getTimeFrames')
			.then((tf) => {
				return tf.json();
			})
			.then((tf) => {
				setData(tf);
				console.log(tf.map((i, j) => j));
			})
			.catch((e) => console.error(e));
	}, []);
	return (
		<div className='App'>
			<Layout>
				<Header>חלוקת לו"ז</Header>
				<Content>
					{data.map((timeFrame) => {
						return (
							<TimeFrame
								key={timeFrame._id}
								id={timeFrame._id}
								name={timeFrame.name}
								startTime={new Date(parseInt(timeFrame.startTime)).getTime()}
								endTime={new Date(parseInt(timeFrame.endTime)).getTime()}
							/>
						);
					})}
				</Content>
			</Layout>
		</div>
	);
}

export default App;
