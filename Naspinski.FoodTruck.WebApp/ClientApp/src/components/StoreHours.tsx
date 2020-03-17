import * as React from 'react';
import { Schedule } from '../models/Schedule';

interface IProps {
  schedule: Map<string, Schedule>
}

const StoreHours = ({ schedule }: IProps) => {
    return (<div>
        <h2>Store Hours</h2>
        {
            Array.from(schedule.keys()).map(day =>
                (
                    <div className='flex' key={'hours-' + day}>
                        <div className='day'>{day}</div>
                        <div>{schedule.get(day)?.hours}</div>
                    </div>
                )
            )
        }
    </div>);
}
export default StoreHours;