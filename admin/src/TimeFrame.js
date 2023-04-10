import { Card, TimePicker } from 'antd';
import dayjs from 'dayjs';

const TimeFrame = ({ name, startTime, endTime, id }) => {
  const changeHandler = async (input, newValue) => {
    const body =
      input === 'startTime'
        ? { _id: id, change: { startTime: dayjs(newValue).valueOf().toString() } }
        : { _id: id, change: { endTime: dayjs(newValue).valueOf().toString() } };
    fetch('http://localhost:8080/editTimeFrame', {
      method: 'put',
      body: body,
    })
      .then((res) => res.text())
      .then((res) => console.log(res, body));
  };
  return (
    <Card title={name} editable>
      <div>
        <TimePicker
          defaultValue={dayjs(startTime)}
          format={'HH:mm'}
          onChange={(value) => changeHandler('startTime', value)}
        />{' '}
        -{' '}
        <TimePicker
          defaultValue={dayjs(endTime)}
          format={'HH:mm'}
          onChange={(value) => changeHandler('endTime', value)}
        />
      </div>
    </Card>
  );
};

export default TimeFrame;
