import { Component } from 'react';
import * as React from 'react';
import { Location } from '../models/Location';
import Address from './../components/Address';
import { Map } from './../components/Map';

interface IProps {
    googleMapsApiKey: string,
    isGoogleMapsLoaded: boolean
}

interface IState {
    location: Location,
    googleMapsApiKey: string,
    type:string,
    email: string,
    message: string,
}

export class Contact extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            location: new Location(),
            googleMapsApiKey: props.googleMapsApiKey,
            type: 'Contact',
            email: '',
            message: ''
        }
    }

    changeEmail = (event: any) => { this.setState({ email: event.target.value }); }
    changeMessage = (event: any) => { this.setState({ message: event.target.value }); }

    handleSubmit = (event: any) => {
        event.preventDefault();
        const payload = {
            email: this.state.email,
            message: this.state.message,
            type: 'Contact'
        }
        console.log(payload);

        fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    componentDidMount() {
        this.populate();
    }

    render() {
        const address = this.state.location && this.state.location.address && this.state.location.address.length > 0
            ? <div>
                <h3>Location</h3>
                <Map location={this.state.location} zoom={15} googleMapsApiKey={this.state.googleMapsApiKey} isGoogleMapsLoaded={this.props.isGoogleMapsLoaded} />
                <Address location={this.state.location} />
            </div>
            : '';

        return (
            <div id='contact' className='flex-container'>
                <form onSubmit={this.handleSubmit}>
                    <h3>Get in touch</h3>
                    <div>
                        <label>
                            Email Address
                            <input id='email' name='email' type='email' onChange={this.changeEmail} required />
                        </label>
                    </div>
                    <div>
                        <label>
                            Message
                            <textarea id='message' name='message' onChange={this.changeMessage} required />
                        </label>
                    </div>
                    <button type='submit'>Send</button>
                </form>
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