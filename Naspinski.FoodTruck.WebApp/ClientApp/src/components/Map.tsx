import { Component } from 'react';
import * as React from 'react';
import { Location } from '../models/Location';

interface IProps {
    location: Location,
    id?: string,
    zoom: number,
    googleMapsApiKey: string,
    isHidden?: boolean,
    isGoogleMapsLoaded: boolean
}

export class Map extends Component<IProps> {
    
    elementId: string = `map-${this.props.id ?? 'default'}`;
    isPopulated: boolean = false;

    componentDidMount() {
        this.populate();
    }

    render() {
        this.populate();
        return <div id={this.elementId} className={this.props.isHidden ? '' : 'map'}></div>
    }

    populate() {
        if (this.props.isGoogleMapsLoaded && !this.props.isHidden && !this.isPopulated) {
            const uluru = { lat: this.props.location.latitude, lng: this.props.location.longitude };
            let element = document.getElementById(this.elementId);
            if (element !== null) {
                const map = new window.google.maps.Map(element, {
                    zoom: this.props.zoom,
                    center: uluru
                });
                new window.google.maps.Marker({
                    position: uluru,
                    map: map
                });
                this.isPopulated = true;
            } else {
                console.warn('unable to find map element');
            }
        }
    }
}