import * as React from 'react';
import { Schedule } from '../models/Schedule';
import { MDBCardHeader, MDBCardTitle, MDBCard, MDBCardBody } from 'mdbreact';

interface IProps {
  schedule: Map<string, Schedule>
}

const StoreHours = ({ schedule }: IProps) => {
    return (<React.Fragment>
        {Array.from(schedule.keys()).map(day =>
            (
                <span className='flex justify-between' key={`hours-${day}`}>
                    <span className='day pr1'>{day}</span>
                    <span>{schedule.get(day)?.hours}</span>
                </span>
            )
        )}
    </React.Fragment>);
}
export default StoreHours;