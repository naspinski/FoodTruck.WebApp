import * as React from 'react';
import { Schedule } from '../models/Schedule';
import { MDBCardHeader, MDBCardTitle, MDBCard, MDBCardBody } from 'mdbreact';

interface IProps {
  schedule: Map<string, Schedule>
}

const StoreHours = ({ schedule }: IProps) => {
    return (
        <MDBCard className='mt3'>
            <MDBCardHeader color='primary-color-dark'>
                <MDBCardTitle className='ma0 b'>Operating Hours</MDBCardTitle>
            </MDBCardHeader>
            <MDBCardBody className='flex-column'>{
                    Array.from(schedule.keys()).map(day =>
                        (
                            <span className='flex justify-between' key={'hours-' + day}>
                                <span className='day'>{day}</span>
                                <span>{schedule.get(day)?.hours}</span>
                            </span>
                        )
                    )
                }
            </MDBCardBody>
        </MDBCard>);
}
export default StoreHours;