import { Component } from 'react';
import * as React from 'react';
import { Event } from '../models/Event';
import Address from './Address';
import { Map } from './Map';
import { MDBBtn, MDBRow, MDBCol } from 'mdbreact';

interface IProps {
    event: Event,
    id: number,
    googleMapsApiKey: string,
    isGoogleMapsLoaded: boolean
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

        const time = this.props.event.beginsTime && this.props.event.beginsTime.length > 0 ?
            <div className='f5'>
                {this.props.event.beginsTime}{this.props.event.endsTime && this.props.event.endsTime.length > 0 ? ' - ' + this.props.event.endsTime : ''}
            </div> : '';

        const location = this.props.event.location;
        const mapButton = location && location.longitude === 0 || location.latitude === 0 ? '' :
            <div className='pl1'>
                <MDBBtn size='sm' onClick={this.mapVisibilityChange}>{this.state.isMapHidden ? 'show on map' : 'hide map'}</MDBBtn>
            </div>;

        return (
            <div className='border-dotted bottom pa2'>
                <MDBRow>
                    <MDBCol md='2'>
                        <div className='left-frame'>
                            <h4 className='b'>{this.props.event.beginsMonth} {this.props.event.beginsDay}</h4>
                            {time}
                        </div>
                    </MDBCol>
                    <MDBCol md='4'>
                        <Address location={this.props.event.location} />
                        {mapButton}
                    </MDBCol>
                    <MDBCol md='6' className='pb1'>
                        <Map location={this.props.event.location}
                            id={`calendar-map-${this.props.id}`}
                            key={mapKey}
                            googleMapsApiKey={this.props.googleMapsApiKey}
                            isGoogleMapsLoaded={this.props.isGoogleMapsLoaded}
                            zoom={8}
                            isHidden={this.state.isMapHidden}
                        />
                    </MDBCol>
                </MDBRow>
            </div>
        );
    }
}