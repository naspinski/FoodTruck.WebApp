import React from 'react';
import { Schedule } from '../models/Schedule';

interface IProps {
  schedule: Map<string, Schedule>
}

const StoreHours = ({ schedule }: IProps) => {
    return (<div>
        {
            [...schedule.keys()].map(day =>
                (
                    <div>{day}: {schedule.get(day)?.hours}</div>
                )
            )
        }
    </div>);
}
export default StoreHours;