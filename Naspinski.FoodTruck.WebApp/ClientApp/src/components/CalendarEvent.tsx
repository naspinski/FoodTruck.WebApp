import React from 'react';
import { Event } from '../models/Event';

interface IProps {
    event: Event
}

const CalendarEvent = ({ event }: IProps) => {
    return (<div key={event.id}>
        {event.name}
    </div>);
}
export default CalendarEvent;