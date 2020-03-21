import { Component } from 'react';
import * as React from 'react';
import { Route } from 'react-router';

import './custom.scss'
import { Layout } from './components/Layout';
import { Faq } from './pages/Faq';
import { Main } from './pages/Main';
import { Contact } from './pages/Contact';
import { Menu } from './pages/Menu';
import { SystemState } from './models/SystemState'
import { SiteSettings } from './models/SiteSettings';
import { LoaderOptions, Loader } from 'google-maps';


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
            <Layout settings={this.state.settings}>
                <Route path='/' exact={true} render={x => <Main isGoogleMapsLoaded={this.state.isGoogleMapsLoaded} settings={this.state.settings} googleMapsApiKey={this.state.settings.googleMapsApiKey} />} />
                <Route path='/menu' render={x => <Menu menuCategories={this.state.menuCategories} />} />
                <Route path='/contact' render={x => <Contact googleMapsApiKey={this.state.settings.googleMapsApiKey} isGoogleMapsLoaded={this.state.isGoogleMapsLoaded} />} />
            </Layout>
        );
    }

    async populate() {
        this.populateSettings();
        this.populateMenu();
    }

    async populateSettings() {
        await fetch('api/settings')
            .then((resp) => resp.json())
            .then((data) => {
                const settings = new SiteSettings(data);
                this.setState({ settings: settings });

                const options: LoaderOptions = { /* todo */ };
                const loader = new Loader(settings.googleMapsApiKey, options);
                loader.load().then(() => this.setState({ isGoogleMapsLoaded: true }));
            });
    }

    async populateMenu() {
        await fetch('api/menu')
            .then((resp) => resp.json())
            .then((data) => {
                let settings = this.state.settings;
                settings.links = this.getNavLinks(data.length);
                this.setState({ menuCategories: data, settings: settings })
            });
    }

    getNavLinks = (menuCategoryCount: number): Map<string, string> => {

        let links = new Map<string, string>();

        links.set('Home', '/');
        if (menuCategoryCount > 0) {
            links.set('Menu', '/menu');
        }
        links.set('Contact', '/contact');

        return links;
    }
}
