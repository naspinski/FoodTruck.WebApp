import React, { Component } from 'react';
import { Location } from '../models/Location';
import { LoaderOptions, Loader } from 'google-maps';

interface IProps {
    location: Location,
    id?: string,
    zoom: number,
    googleMapsApiKey: string
}

export class Map extends Component<IProps> {

    elementId: string = `map-${this.props.id ?? 'default'}`;

    componentDidMount() {
        this.populate();
    }

    render() {
        return <div id={this.elementId} className='map'></div>
    }

    populate() {
        MapLoader.loadGoogleMaps(this.props.googleMapsApiKey)
            .then(() => {
                const uluru = { lat: this.props.location.latitude, lng: this.props.location.longitude };
                let element = document.getElementById(this.elementId);
                console.log(this.props.location, element);
                if (element !== null) {
                    const map = new google.maps.Map(element, {
                        zoom: this.props.zoom,
                        center: uluru
                    });
                    new google.maps.Marker({
                        position: uluru,
                        map: map
                    });
                } else {
                    console.warn('unable to find map element');
                }
            });
    }
}

export abstract class MapLoader {    
    public static async loadGoogleMaps(googleMapsApiKey: string) {
        if (typeof (google) === 'object' && typeof google.maps === 'object') {
            return;
        } else {
            const options: LoaderOptions = { /* todo */ };
            const loader = new Loader(googleMapsApiKey, options);
            await loader.load();
        }
    }
}