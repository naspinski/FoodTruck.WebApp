import { Component } from 'react';
import * as React from 'react';
import { Location } from '../models/Location';
import Address from './../components/Address';
import { Map } from './../components/Map';
import './Contact.scss';
import { MDBRow, MDBCol, MDBBtnGroup, MDBBtn, MDBAlert } from 'mdbreact';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { SiteSettings } from '../models/SiteSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
    googleMapsApiKey: string,
    isGoogleMapsLoaded: boolean
    settings: SiteSettings
}

interface IState {
    location: Location,
    googleMapsApiKey: string,
    type:string,
    email: string,
    message: string,
    attachment: File | null,
    date: Date | null,
    sendingState: 'waiting' | 'sending' | 'sent' | 'error'
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
            attachment: null,
            date: null,
            sendingState: 'waiting'
        }
    }

    apply = () => { this.setState({ type: 'Apply' }); }
    contact = () => { this.setState({ type: 'Contact' }); }
    book = () => { this.setState({ type: 'Book' }); }

    handleEmailChange = (event: any) => { this.setState({ email: event.target.value }); }
    handleMessageChange = (event: any) => { this.setState({ message: event.target.value }); }
    handleAttachmentChange = (event: any) => { if (event.target.files) this.setState({ attachment: event.target.files[0] }); }
    handleDateChange = (date: any) => { this.setState({ date: date }); };

    handleSubmit = (event: any) => {
        event.preventDefault();
        this.setState({ sendingState: 'sending' });

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
            formData.append('Email', payload.email);
            formData.append('Message', payload.message);
            formData.append('Type', payload.type);
            formData.append('Attachment', this.state.attachment);
            options.body = formData;
        } else {
            options.body = JSON.stringify(payload);
            options.headers = { 'Content-Type': 'application/json' };
        }

        console.log(options);
        fetch('api/contact', options)
            .then(success => {
                console.log('success', success);
                this.setState({ sendingState: 'sent' })
            })
            .catch(error => {
                console.log('error', error);
                this.setState({ sendingState: 'error' })
            });
    }

    componentDidMount() {
        this.populate();
    }

    render() {
        const address = this.state.location && this.state.location.address && this.state.location.address.length > 0
            ? <div>
                <h3 className='b'>Location</h3>
                <Map location={this.state.location} zoom={15} googleMapsApiKey={this.state.googleMapsApiKey} isGoogleMapsLoaded={this.props.isGoogleMapsLoaded} />
                <Address location={this.state.location} />
            </div>
            : '';

        const dateTimePicker = this.state.type !== 'Book' ? '' :
            <div className='pt2 b'>
                <label htmlFor='date'>Date/Time</label>
                <DatePicker id='date'
                    showTimeSelect
                    dateFormat="MM/dd/yyyy HH:mm"
                    popperPlacement='top'
                    className='form-control'
                    selected={this.state.date}
                    onChange={this.handleDateChange}
                />
            </div>;

        const sending = this.state.sendingState !== 'sending' ? '' :
            <MDBAlert color='info' className='tl'>
                Sending...
            </MDBAlert>;

        const sent = this.state.sendingState !== 'sent' ? '' :
            <MDBAlert color='success' className='tl'>
                Message sent, we will be in touch shortly!
            </MDBAlert>;

        const error = this.state.sendingState !== 'error' ? '' :
            <MDBAlert color='danger' className='tl'>
                Error sending message
            </MDBAlert>;

        const disableSend = this.state.sendingState !== 'waiting' && this.state.sendingState !== 'error';

        return (
            <div id='contact' className='primary-color pb2'>
                <div className='inner-container'>
                <h2 className='border-dotted bottom'>Contact</h2>
                    <MDBRow>
                        <MDBCol md='6'>
                            <h3 className='b'>Get in touch</h3>
                            <MDBBtnGroup>
                                <MDBBtn active={this.state.type === 'Contact'} onClick={this.contact}>Info</MDBBtn>
                                <MDBBtn active={this.state.type === 'Book'} onClick={this.book}>Book</MDBBtn>
                                {this.props.settings.isApplyOn ? <MDBBtn active={this.state.type === 'Apply'} onClick={this.apply}>Apply</MDBBtn> : ''}
                            </MDBBtnGroup>                            
                            <form onSubmit={this.handleSubmit} className='ph1'>
                                <div className='pt2 b'>
                                    <label htmlFor="Email">Email Address</label>
                                    <input type="Email" id="Email" className="form-control" onChange={this.handleEmailChange} />
                                </div>
                                {dateTimePicker}
                                <div className='pt2 b'>
                                    <label htmlFor='Message'>Message</label>
                                    <textarea id='Message' name='Message' className='form-control' onChange={this.handleMessageChange} required />
                                </div>
                                <div className="input-group pt3 b">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="AttachmentPre">Upload</span>
                                    </div>
                                    <div className="custom-file">
                                        <input type='file'
                                            className='custom-file-input'
                                            id='Attachment' name='Attachment'
                                            aria-describedby="AttachmentPre"
                                            onChange={this.handleAttachmentChange} />
                                        <label className='custom-file-label' htmlFor='Attachment'>Attachment</label>
                                    </div>
                                </div>
                                <div className='pt2 flex justify-between'>
                                    <div className='pt1'>
                                        {sending}
                                        {sent}
                                        {error}
                                    </div>
                                    <div>
                                        <MDBBtn color='pink' type='submit' disabled={disableSend} >
                                            <FontAwesomeIcon icon='chevron-circle-right' /> Send
                                        </MDBBtn>
                                    </div>
                                </div>
                            </form>
                        </MDBCol>
                        <MDBCol md='6'>
                            {address}
                        </MDBCol>
                    </MDBRow>
                </div>
            </div>
        );
    }

    async populate() {
        await fetch('api/location')
            .then((resp) => resp.json())
            .then((data) => this.setState({ location: new Location(data) }));
    }
}