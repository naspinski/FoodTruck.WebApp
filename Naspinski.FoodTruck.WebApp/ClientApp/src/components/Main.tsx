import React, { Component } from 'react';
import StoreHours from './StoreHours';
import Home from './Home';
import { Calendar } from './Calendar';
import { SiteSettings } from '../models/SiteSettings';

interface IProps {
    settings: SiteSettings
}

export class Main extends Component<IProps> {

    render() {
        return (this.props.settings.isLoaded
            ? <div>loading</div>
            : <div>
                <Calendar />
                <StoreHours schedule={this.props.settings.scheduleMap} />
            </div>
        );
    }
}
