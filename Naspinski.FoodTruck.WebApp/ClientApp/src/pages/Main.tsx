import { Component } from 'react';
import * as React from 'react';
import { Calendar } from './../components/Calendar';
import { SiteSettings } from '../models/SiteSettings';
import { Specials } from '../components/Specials';
import { Splash } from '../components/Splash';

interface IProps {
    settings: SiteSettings,
    googleMapsApiKey: string,
    isGoogleMapsLoaded: boolean
}

export class Main extends Component<IProps> {

    render() {

        const secondPane = this.props.settings.isBrickAndMortar
            ? <Specials containerClassName='amber darken-2' />
            : <Calendar isGoogleMapsLoaded={this.props.isGoogleMapsLoaded} googleMapsApiKey={this.props.googleMapsApiKey} containerClassName='amber darken-2' />
        return (
            <div>
                <Splash settings={this.props.settings} />
                {secondPane}
            </div>
        );
    }
}
