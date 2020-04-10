import { Component, useEffect, useContext } from 'react';
import * as React from 'react';
import { Location } from '../models/Location';
import SiteContext from '../models/SiteContext';

interface IProps {
    location: Location,
    id: string,
    zoom: number
    isHidden?: boolean
}

const Map = ({ location, id, zoom, isHidden }: IProps) => {

    const context = useContext(SiteContext);

    useEffect(() => {
        populate()
    }, [isHidden]);

    const elementId: string = `map-${id ?? 'default'}`;
    let isPopulated: boolean = false;
       
    const populate = () => {
        if (context.isGoogleMapsLoaded && !isHidden && !isPopulated) {
            const uluru = { lat: location.latitude, lng: location.longitude };
            let element = document.getElementById(elementId);
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
                                    callMap(element, uluru);
                                } else {
                                    console.error('error loading map');
                                }
                            });
                    }
                } else {
                    callMap(element, uluru);
                }
            } else {
                console.warn('unable to find map element');
            }
        }
    }

    const callMap = (element: HTMLElement, uluru: any) => {
        const map = new window.google.maps.Map(element, {
            zoom: zoom,
            center: uluru
        });
        new window.google.maps.Marker({
            position: uluru,
            map: map
        });
        isPopulated = true;
    }

    return <div id={elementId} className={isHidden ? '' : 'map'}></div>
}
export default Map;