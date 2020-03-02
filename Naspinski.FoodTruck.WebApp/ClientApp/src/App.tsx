import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import Home from './components/Home';
import StoreHours from './components/StoreHours';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { SystemState } from './models/SystemState'

import './custom.css'
import { SiteSettings } from './models/SiteSettings';


export default class App extends Component<{}, SystemState> {

    constructor(props: any) {
        super(props);
        this.state = new SystemState();
    }

    static displayName = App.name;

    componentDidMount() {
      this.populate();
    }

    render () {
        return (
            <Layout>
                <Home settings={this.state.settings} />
                <Route path='/counter' component={Counter} />
                <Route path='/fetch-data' component={FetchData} />
                <StoreHours schedule={this.state.settings.scheduleMap} />
            </Layout>
        );
    }

    async populate() {
      this.populateSettings();
    }

    async populateSettings() {
        const response = await fetch('api/settings');
        const data = await response.json();
        this.setState({ settings: new SiteSettings(data) });
    }
}
