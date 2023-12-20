import * as React from 'react';
import CalendarEvent from './CalendarEvent';
import SiteContext from '../models/SiteContext';

interface IProps {
    containerClassName: string
}

const Calendar = ({ containerClassName }: IProps) => {

    const context = React.useContext(SiteContext);
    const events = context.events;
    let keyCounter = 0;

    return events.length === 0 ? <React.Fragment></React.Fragment> :
        <div className={`${containerClassName} pb3`}>
            <div className='inner-container'>
                <h2 className='border-dotted bottom header'>Calendar</h2>
                {events.map(event =>
                    <CalendarEvent key={`event-${keyCounter + 1}`} id={keyCounter++} calendarEvent={event} />
                )}
            </div>
        </div>;
}
export default Calendar;
