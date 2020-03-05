import React, { Component } from 'react';
import StoreHours from './../components/StoreHours';
import { Calendar } from './../components/Calendar';
import { SiteSettings } from '../models/SiteSettings';

interface IProps {
    settings: SiteSettings,
    googleMapsApiKey: string
}

export class Main extends Component<IProps> {

    render() {
        return (this.props.settings.isLoaded
            ? <div>loading</div>
            : <div>
                <Calendar googleMapsApiKey={this.props.googleMapsApiKey} />
                <StoreHours schedule={this.props.settings.scheduleMap} />
            </div>
        );
    }
}
