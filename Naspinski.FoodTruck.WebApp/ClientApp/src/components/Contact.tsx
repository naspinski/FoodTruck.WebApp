import React from 'react';
import { Location } from '../models/Location';
import Address from './Address';

interface IProps {
    location: Location
}

const Contact = ({ location }: IProps) => {

    const address = location && location.address && location.address.length > 0
        ? <div>
            <h3>Location</h3>
            <div>MAP</div>
            <Address location={location} />
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
export default Contact;