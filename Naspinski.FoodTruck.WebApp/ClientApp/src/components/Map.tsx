import React, { Component } from 'react';
import { Location } from '../models/Location';
import { LoaderOptions, Loader } from 'google-maps';

interface IProps {
    location: Location,
    id?: string,
    zoom: number,
    googleMapsApiKey: string,
    isHidden?: boolean
}

export class Map extends Component<IProps> {
    
    elementId: string = `map-${this.props.id ?? 'default'}`;
    public populated: boolean = false;
    public mounted: boolean = false;
    
    componentDidMount() {
        this.populate();
        this.mounted = true;
    }

    render() {
        if (this.mounted)
            this.populate();
        return <div id={this.elementId} className={this.props.isHidden ? '' : 'map'}></div>
    }

    populate() {
        if (!this.props.isHidden && !this.populated) {
            MapLoader.loadGoogleMaps(this.props.googleMapsApiKey)
                .then(() => {
                    const uluru = { lat: this.props.location.latitude, lng: this.props.location.longitude };
                    let element = document.getElementById(this.elementId);
                    if (element !== null) {
                        const map = new google.maps.Map(element, {
                            zoom: this.props.zoom,
                            center: uluru
                        });
                        new google.maps.Marker({
                            position: uluru,
                            map: map
                        });
                        this.populated = true;
                    } else {
                        console.warn('unable to find map element');
                    }
                });
        }
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