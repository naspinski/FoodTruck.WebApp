import React, { Component } from 'react';
import { Route } from 'react-router';

import './custom.css'
import { Layout } from './components/Layout';
import { Faq } from './pages/Faq';
import { Main } from './pages/Main';
import { Contact } from './pages/Contact';
import { SystemState } from './models/SystemState'
import { SiteSettings } from './models/SiteSettings';
import { MapLoader } from './components/Map';


export default class App extends Component<{}, SystemState> {

    constructor(props: any) {
        super(props);
        this.state = new SystemState();
    }

    static displayName = App.name;

    componentDidMount() {
      this.populate();
    }

    render() {
        return (
            <Layout homeUrl={this.state.settings.homeUrl} title={this.state.settings.title} logo={this.state.settings.logoImageUrl} >
                <Route path='/' exact={true} render={x => <Main settings={this.state.settings} />} />
                <Route path='/contact' render={x => <Contact googleMapsApiKey={this.state.settings.googleMapsApiKey} />} />
                <Route path='/faq' component={Faq} />
            </Layout>
        );
    }

    async populate() {
        this.populateSettings();
    }

    async populateSettings() {
        await fetch('api/settings')
            .then((resp) => resp.json())
            .then((data) => {
                const settings = new SiteSettings(data);
                this.setState({ settings: settings });
                MapLoader.loadGoogleMaps(settings.googleMapsApiKey);
            });
    }
}
