import { Component } from 'react';
import * as React from 'react';
import { Event } from '../models/Event';
import { CalendarEvent } from './CalendarEvent';

interface IProps {
    googleMapsApiKey: string,
    isGoogleMapsLoaded: boolean,
    containerClassName: string
}

interface IState {
    events: Event[]
}

export class Calendar extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            events: []
        }
    }

    componentDidMount() {
        this.populate();
    }
    
    render() {
        let eventCount = 0;

        return this.state.events.length === 0 ? '' :
            <div className={`${this.props.containerClassName} pb3`}>
                <div className='inner-container'>
                    <h2 className='border-dotted bottom header'>Calendar</h2>
                    {this.state.events.map(event =>
                        <CalendarEvent isGoogleMapsLoaded={this.props.isGoogleMapsLoaded} key={`event-${eventCount + 1}`} id={eventCount++} event={event} googleMapsApiKey={this.props.googleMapsApiKey} />
                    )}
                </div>
            </div>;
    }

    async populate() {
        await fetch('api/events')
            .then((resp) => resp.json())
            .then((data) => this.setState({ events: data }));
    }
}
