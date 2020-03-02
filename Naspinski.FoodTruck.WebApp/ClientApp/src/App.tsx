import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Faq } from './components/Faq';
import { Main } from './components/Main';
import { SystemState } from './models/SystemState'

import './custom.css'
import { SiteSettings } from './models/SiteSettings';
import Home from './components/Home';


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
            <Layout title={this.state.settings.title} logo={this.state.settings.logoImageUrl} >
                <Route path='/' exact={true} render={props => <Main settings={this.state.settings} />} />
                <Route path='/faq' component={Faq} />
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
