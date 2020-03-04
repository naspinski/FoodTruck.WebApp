import React from 'react';
import { Event } from '../models/Event';
import Address from './Address';

interface IProps {
    event: Event,
    key: string
}

const CalendarEvent = ({ event }: IProps) => {
    
    const time = event.beginsTime && event.beginsTime.length > 0
        ? <h5>{event.beginsTime}{event.endsTime && event.endsTime.length > 0 ? '-' + event.endsTime : ''}</h5>
        : '';

    return (<div className='flex'>
        <div>
            <h4>{event.beginsMonth} {event.beginsDay}</h4>
            {time}
        </div>
        <div className='flex items-center'>
            <Address location={event.location} />
        </div>
    </div>);
}
export default CalendarEvent;