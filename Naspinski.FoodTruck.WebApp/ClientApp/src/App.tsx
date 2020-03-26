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

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCommentAlt, faDownload, faMapMarkerAlt, faCalendar, faHamburger, faEnvelope, faChevronCircleRight, faStar, faInfoCircle, faExclamationCircle, faThumbsUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faInstagramSquare, faTwitterSquare, faPinterestSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { Specials } from './components/Specials';
import { Calendar } from './components/Calendar';
library.add(faCommentAlt, faDownload, faMapMarkerAlt, faCalendar, faHamburger, faEnvelope, faStar, faChevronCircleRight, faInfoCircle, faExclamationCircle, faThumbsUp, faTimes, faFacebookSquare, faInstagramSquare, faTwitterSquare, faPinterestSquare, faLinkedin);


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
                <Route path='/menu' component={Menu} />
                <Route path='/specials' render={x => <Specials containerClassName='primary-color' />} />
                <Route path='/calendar' render={x => <Calendar isGoogleMapsLoaded={this.state.isGoogleMapsLoaded} googleMapsApiKey={this.state.settings.googleMapsApiKey} containerClassName='primary-color' />} />
                <Route path='/contact' render={x => <Contact googleMapsApiKey={this.state.settings.googleMapsApiKey} settings={this.state.settings} isGoogleMapsLoaded={this.state.isGoogleMapsLoaded} />} />
            </Layout>
        );
    }

    async populate() {
        this.populateSettings();
        this.populateLinks();
    }

    async populateSettings() {
        await fetch('api/settings')
            .then((resp) => resp.json())
            .then((data) => {
                const settings = new SiteSettings(data);
                settings.links = this.state.settings.links;
                this.setState({ settings: settings });

                const options: LoaderOptions = { /* todo */ };
                const loader = new Loader(settings.googleMapsApiKey, options);
                loader.load().then(() => this.setState({ isGoogleMapsLoaded: true }));
            });
    }

    async populateLinks() {
        await fetch('api/sections')
            .then((resp) => resp.json())
            .then((data: string[]) => {
                let links = new Map<string, string>();
                links.set('home', '/');
                data.forEach((link) => links.set(link, `/${link}`));
                links.set('contact', '/contact');
                let settings = this.state.settings;
                settings.links = links;
                this.setState({ settings: settings })
            });
    }
}
