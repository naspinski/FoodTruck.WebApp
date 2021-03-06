import * as React from 'react';
import { Location } from '../models/Location';

interface IProps {
    location: Location
}

const Address = ({ location }: IProps) => {

    return location && location.address.length > 0
        ? 
            <address className='f4 pt2 left pl2 ttc'>
                <div>{location.address}</div>
                <div>
                {location.city ? (location.city + ', ') : ''}
                {location.state ? (location.state + ' ') : ''}
                {location.zip ? location.zip : ''}</div>
            </address>
        : <address></address>;
}
export default Address;