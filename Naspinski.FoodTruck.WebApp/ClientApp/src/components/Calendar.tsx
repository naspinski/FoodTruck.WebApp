import { Component } from 'react';
import * as React from 'react';
import { Event } from '../models/Event';
import { CalendarEvent } from './CalendarEvent';

interface IProps {
    googleMapsApiKey: string,
    isGoogleMapsLoaded: boolean
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
        return this.state.events.length === 0 ? '' :
            <div id='calendar'>
                <h2>Calendar</h2>
                <div id='events'>
                    {this.state.events.map(event =>
                        <CalendarEvent isGoogleMapsLoaded={this.props.isGoogleMapsLoaded} key={event.id} event={event} googleMapsApiKey={this.props.googleMapsApiKey} />
                    )}
                </div>
            </div>;
    }

    async populate() {
        const response = await fetch('api/events');
        const data = await response.json();
        this.setState({ events: data });
    }
}
