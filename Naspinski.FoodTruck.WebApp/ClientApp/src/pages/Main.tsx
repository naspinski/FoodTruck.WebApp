import { Component } from 'react';
import * as React from 'react';
import StoreHours from './../components/StoreHours';
import { Calendar } from './../components/Calendar';
import { SiteSettings } from '../models/SiteSettings';
import { Specials } from '../components/Specials';
import Splash from '../components/Splash';

interface IProps {
    settings: SiteSettings,
    googleMapsApiKey: string,
    isGoogleMapsLoaded: boolean
}

export class Main extends Component<IProps> {

    render() {
        return (this.props.settings.isLoaded
            ? <div>loading</div>
            : <div>
                <Splash settings={this.props.settings} />
                <Specials /> 
                <Calendar isGoogleMapsLoaded={this.props.isGoogleMapsLoaded} googleMapsApiKey={this.props.googleMapsApiKey} />
                <StoreHours schedule={this.props.settings.scheduleMap} />
            </div>
        );
    }
}
