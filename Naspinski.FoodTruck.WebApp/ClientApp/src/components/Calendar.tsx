import React, { Component } from 'react';
import { Event } from '../models/Event';
import CalendarEvent from './CalendarEvent';

interface IState {
    events: Event[],
    isLoaded: boolean
}

export class Calendar extends Component<{}, IState> {

    constructor(props: any) {
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
        return (
            <div id='calendar'>
                <h2>Calendar</h2>
                {
                    !this.state.isLoaded
                        ? <p><em>Loading...</em></p>
                        : this.state.events.length === 0
                            ? <div>no events scheduled</div>
                            : <div>{this.state.events.map(event => <CalendarEvent event={event} />)}</div>
                }
            </div>
        )
    }

    async populate() {
        const response = await fetch('api/events');
        const data = await response.json();
        this.setState({ events: data, isLoaded: true });
    }
}
