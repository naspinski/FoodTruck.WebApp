import * as React from 'react';
import CalendarEvent from './CalendarEvent';
import { useState, useEffect } from 'react';

interface IProps {
    googleMapsApiKey: string,
    isGoogleMapsLoaded: boolean,
    containerClassName: string
}

const Calendar = ({ googleMapsApiKey, isGoogleMapsLoaded, containerClassName }: IProps) => {

    const [events, setEvents] = useState([]);
    useEffect(() => {
        fetch('api/events')
            .then((resp) => resp.json())
            .then((data) => setEvents(data));
    }, []);

    let eventCount = 0;

    return events.length === 0 ? <React.Fragment></React.Fragment> :
        <div className={`${containerClassName} pb3`}>
            <div className='inner-container'>
                <h2 className='border-dotted bottom header'>Calendar</h2>
                {events.map(event =>
                    <CalendarEvent isGoogleMapsLoaded={isGoogleMapsLoaded} key={`event-${eventCount + 1}`} id={eventCount++} event={event} googleMapsApiKey={googleMapsApiKey} />
                )}
            </div>
        </div>;
}
export default Calendar;
