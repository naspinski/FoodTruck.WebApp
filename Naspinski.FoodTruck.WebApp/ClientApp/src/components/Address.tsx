import React from 'react';
import { Location } from '../models/Location';

interface IProps {
    location: Location
}

const Address = ({ location }: IProps) => {

    return location && location.address && location.address.length > 0
        ? 
            <address>
                <div>{location.address}</div>
                <div>
                {location.city ? (location.city + ', ') : ''}
                {location.state ? (location.state + ' ') : ''}
                {location.zip ? location.zip : ''}</div>
            </address>
        : <address></address>;
}
export default Address;