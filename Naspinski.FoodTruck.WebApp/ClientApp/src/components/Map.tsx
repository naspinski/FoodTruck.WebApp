import { Component } from 'react';
import * as React from 'react';
import { Location } from '../models/Location';
import SiteContext from '../models/SiteContext';

interface IProps {
    location: Location,
    id: string,
    zoom: number
    isHidden?: boolean
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

    static contextType = SiteContext;

    populate() {
        const location = this.props.location;

        if (this.context.isGoogleMapsLoaded && !this.props.isHidden && !this.isPopulated) {
            const uluru = { lat: location.latitude, lng: location.longitude };
            let element = document.getElementById(this.elementId);
            if (element !== null) {
                if (uluru.lat === 0 || uluru.lng === 0) {
                    if (location.address === null || location.address.length === 0) {
                        console.warn('not a valid address');
                    } else {
                        fetch(`/api/events/map/${location.address}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.location !== null) {
                                    uluru.lat = data.location.latitude;
                                    uluru.lng = data.location.longitude;
                                    this.callMap(element, uluru);
                                } else {
                                    console.error('error loading map');
                                }
                            });
                    }
                } else {
                    this.callMap(element, uluru);
                }
            } else {
                console.warn('unable to find map element');
            }
        }
    }

    callMap(element: HTMLElement, uluru: any) {
        const map = new window.google.maps.Map(element, {
            zoom: this.props.zoom,
            center: uluru
        });
        new window.google.maps.Marker({
            position: uluru,
            map: map
        });
        this.isPopulated = true;
    }
}