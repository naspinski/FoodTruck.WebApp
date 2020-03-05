import React, { Component } from 'react';
import { Location } from '../models/Location';
import Address from './../components/Address';
import { Map } from './../components/Map';

interface IProps {
    googleMapsApiKey: string
}

interface IState {
    location: Location,
    googleMapsApiKey: string
}

export class Contact extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            location: new Location(),
            googleMapsApiKey: props.googleMapsApiKey
        }
    }

    componentDidMount() {
        this.populate();
    }

    render() {
        const address = this.state.location && this.state.location.address && this.state.location.address.length > 0
            ? <div>
                <h3>Location</h3>
                <Map location={this.state.location} zoom={15} googleMapsApiKey={this.state.googleMapsApiKey} />
                <Address location={this.state.location} />
            </div>
            : '';

        return (
            <div id='contact' className='flex-container'>
                <div>
                    <h3>Get in touch</h3>
                [form here]
            </div>
                {address}
            </div>
        );
    }


    async populate() {
        await fetch('api/location')
            .then((resp) => resp.json())
            .then((data) => this.setState({ location: new Location(data) }));
    }

}