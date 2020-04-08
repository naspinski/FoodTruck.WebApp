import { Component } from 'react';
import * as React from 'react';
import Calendar from './../components/Calendar';
import { Specials } from '../components/Specials';
import Splash from '../components/Splash';
import SettingsContext from '../models/SettingsContext';

interface IProps {
    googleMapsApiKey: string,
    isGoogleMapsLoaded: boolean
}

export class Main extends Component<IProps> {

    static contextType = SettingsContext;

    render() {

        const secondPane = this.context.isBrickAndMortar
            ? <Specials containerClassName='panel-2' />
            : <Calendar isGoogleMapsLoaded={this.props.isGoogleMapsLoaded} googleMapsApiKey={this.props.googleMapsApiKey} containerClassName='amber darken-2' />
        return (
            <div>
                <Splash />
                {secondPane}
            </div>
        );
    }
}
Main.contextType = SettingsContext;
