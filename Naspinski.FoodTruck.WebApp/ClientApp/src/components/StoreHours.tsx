import React from 'react';
import { Schedule } from '../models/Schedule';

interface IProps {
  schedule: Map<string, Schedule>
}

const StoreHours = ({ schedule }: IProps) => {
    return (<div>
        <h2>Store Hours</h2>
        {
            [...schedule.keys()].map(day =>
                (
                    <div key={day}>{day}: {schedule.get(day)?.hours}</div>
                )
            )
        }
    </div>);
}
export default StoreHours;