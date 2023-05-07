import { Card, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const TimeFrame = ({ name, startTime, endTime, id }) => {
	const [start, setStart] = useState(startTime);
	const [end, setEnd] = useState(endTime);
	const changeHandler = async (input, newValue) => {
		let body;
		if (input === 'startTime') {
			setStart(newValue);
			body = {
				_id: id,
				change: {
					startTime: dayjs(newValue)
						.set('date', 14)
						.set('month', 4)
						.set('year', 2023)
						.valueOf()
						.toString(),
				},
			};
		} else {
			setEnd(newValue);
			body = {
				_id: id,
				change: {
					endTime: dayjs(newValue)
						.set('date', 14)
						.set('month', 4)
						.set('year', 2023)
						.valueOf()
						.toString(),
				},
			};
		}
		fetch('https://wedpic-server.onrender.com/editTimeFrame', {
			method: 'PUT',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	};
	return (
		<Card title={name}>
			<div>
				<label>התחלה - </label>
				<TimePicker
					defaultValue={dayjs(startTime)}
					format={'HH:mm'}
					onChange={(value) => changeHandler('startTime', value)}
					disabledTime={() => {
						return {
							disabledHours: () =>
								Array.from(
									{ length: 23 - dayjs(end).hour() },
									(x, i) => i + dayjs(end).hour() + 1
								),
							disabledMinutes: (hour) => {
								if (hour === dayjs(end).hour()) {
									return Array.from(
										{ length: 59 - dayjs(end).minute() },
										(x, i) => i + dayjs(end).minute()
									);
								} else {
									return [];
								}
							},
						};
					}}
				/>{' '}
				- <label>סיום - </label>
				<TimePicker
					defaultValue={dayjs(endTime)}
					format={'HH:mm'}
					onChange={(value) => changeHandler('endTime', value)}
					disabledTime={() => {
						return {
							disabledHours: () =>
								Array.from({ length: dayjs(start).hour() }, (x, i) => i),
							disabledMinutes: (hour) => {
								if (hour === dayjs(start).hour()) {
									return Array.from(
										{ length: dayjs(start).minute() },
										(x, i) => i + 1
									);
								} else {
									return [];
								}
							},
						};
					}}
				/>
			</div>
		</Card>
	);
};

export default TimeFrame;
