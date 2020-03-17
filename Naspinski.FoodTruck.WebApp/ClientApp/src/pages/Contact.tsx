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
    attachment: File | null
}

export class Contact extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            location: new Location(),
            googleMapsApiKey: props.googleMapsApiKey,
            type: 'Contact',
            email: '',
            message: '',
            attachment: null
        }
    }

    apply = () => { this.setState({ type: 'Apply' }); }
    contact = () => { this.setState({ type: 'Contact' }); }
    book = () => { this.setState({ type: 'Booking' }); }
    changeEmail = (event: any) => { this.setState({ email: event.target.value }); }
    changeMessage = (event: any) => { this.setState({ message: event.target.value }); }
    changeAttachment = (event: any) => { if (event.target.files) this.setState({ attachment: event.target.files[0] }); }

    handleSubmit = (event: any) => {
        event.preventDefault();

        const payload = {
            email: this.state.email,
            message: this.state.message,
            type: this.state.type
        }

        let options: any = {
            method: 'post'
        };

        if (this.state.attachment !== null) {
            let formData = new FormData();
            formData.append('email', payload.email);
            formData.append('message', payload.message);
            formData.append('type', payload.type);
            formData.append('attachment', this.state.attachment);
            options.body = formData;
        } else {
            options.body = JSON.stringify(payload);
            options.headers = { 'Content-Type': 'application/json' };
        }

        console.log(options);
        fetch('api/contact', options);
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
                <button className={this.state.type === 'Contact' ? 'selected' : ''} onClick={this.contact}>Info</button>
                <button className={this.state.type === 'Booking' ? 'selected' : ''} onClick={this.book}>Book</button>
                <button className={this.state.type === 'Apply' ? 'selected' : ''} onClick={this.apply}>Apply</button>
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
                    <div>
                        <label>
                            Attachment
                            <input id='attachment' name='attachment' type='file' onChange={this.changeAttachment} />
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