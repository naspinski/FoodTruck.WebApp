import { Component } from 'react';
import * as React from 'react';
import { Event } from '../models/Event';
import Address from './Address';
import { Map } from './Map';

interface IProps {
    event: Event,
    key: string,
    googleMapsApiKey: string
}

interface IState {
    isMapHidden: boolean
}

export class CalendarEvent extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isMapHidden: true
        };
    }

    mapVisibilityChange = () => {
        this.setState({ isMapHidden: !this.state.isMapHidden });
    }

    render() {
        const mapKey = 'event-' + this.props.event.id;

        const time = this.props.event.beginsTime && this.props.event.beginsTime.length > 0
            ? <h5>{this.props.event.beginsTime}{this.props.event.endsTime && this.props.event.endsTime.length > 0 ? '-' + this.props.event.endsTime : ''}</h5>
            : '';

        const location = this.props.event.location;
        const mapButton = location && location.longitude !== 0 && location.latitude !== 0
            ? <button onClick={this.mapVisibilityChange}>{this.state.isMapHidden ? 'show on map' : 'hide map'}</button>
            : '';

        return (
            <div>
                <div className='flex'>
                    <div>
                        <h4>{this.props.event.beginsMonth} {this.props.event.beginsDay}</h4>
                        {time}
                    </div>
                    <div className='flex-column'>
                        <Address location={this.props.event.location} />
                        {mapButton}
                    </div>
                </div>
                <Map location={this.props.event.location}
                    key={mapKey}
                    googleMapsApiKey={this.props.googleMapsApiKey}
                    zoom={8}
                    isHidden={this.state.isMapHidden}
                />
            </div>
        );
    }
}