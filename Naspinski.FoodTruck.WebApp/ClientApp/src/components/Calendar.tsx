import { Component } from 'react';
import * as React from 'react';
import { Event } from '../models/Event';
import { CalendarEvent } from './CalendarEvent';

interface IProps {
    googleMapsApiKey: string
}

interface IState {
    events: Event[],
    isLoaded: boolean
}

export class Calendar extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            events: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        this.populate();
    }
    
    render() {
        let events = this.state.isLoaded
            ?   ((this.state.events.length > 0)
                ? this.state.events.map(event => <CalendarEvent key={event.id} event={event} googleMapsApiKey={this.props.googleMapsApiKey} />)
                : 'no events scheduled')
            : 'loading events';
        return (
            <div id='calendar'>
                <h2>Calendar</h2>
                <div id='events'>{events}</div>
            </div>
        )
    }

    async populate() {
        const response = await fetch('api/events');
        const data = await response.json();
        this.setState({ events: data, isLoaded: true });
    }
}
