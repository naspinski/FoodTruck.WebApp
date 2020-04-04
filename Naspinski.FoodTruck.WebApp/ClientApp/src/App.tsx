import { Component } from 'react';
import * as React from 'react';
import { Route } from 'react-router';
import { Helmet } from 'react-helmet';
import { LoaderOptions, Loader } from 'google-maps';

import './custom.scss'
import { Layout } from './components/Layout';
import { Faq } from './pages/Faq';
import { Main } from './pages/Main';
import { Contact } from './pages/Contact';
import { Menu } from './pages/Menu';
import { SystemState } from './models/SystemState'
import { SiteSettings } from './models/SiteSettings';
import Spinner from './components/Spinner';

import { library } from '@fortawesome/fontawesome-svg-core';
import { Specials } from './components/Specials';
import { Calendar } from './components/Calendar';
import { CartAction } from './models/CartModels';

import {
    faCommentAlt, faDownload, faMapMarkerAlt, faCalendar, faHamburger, faEnvelope, faTrashAlt, faPhone, faShoppingCart, faCog,
    faExternalLinkAlt, faChevronCircleRight, faChevronCircleLeft, faStar, faInfoCircle, faExclamationCircle, faThumbsUp, faTimes, faCaretDown
} from '@fortawesome/free-solid-svg-icons';

library.add(faCommentAlt, faDownload, faMapMarkerAlt, faCalendar, faHamburger, faEnvelope, faTrashAlt, faPhone, faShoppingCart, faCog,
    faExternalLinkAlt, faStar, faChevronCircleRight, faChevronCircleLeft, faInfoCircle, faExclamationCircle, faThumbsUp, faTimes, faCaretDown);

export default class App extends Component<{}, SystemState> {

    constructor(props: any) {
        super(props);
        this.state = new SystemState();
    }

    cartActionHandler = (action: CartAction) => {
        console.log('App.cartActionHandler', action);
        this.state.cart.action(action);
        this.setState({ cart: this.state.cart });
    }

    componentDidMount() {
        this.populate();
    }

    render() {
        return (
            <React.Fragment>
                <Spinner isLoading={!this.state.isLoaded} />
                <Helmet>
                    <title>{this.state.settings.title}</title>
                    <link rel='shortcut icon' data-react-helmet='true' href={this.state.settings.faviconImageUrl} />
                    <link rel='icon' type='image/x-icon' data-react-helmet='true' href={this.state.settings.faviconImageUrl} />
                    <meta name='Keywords'content={this.state.settings.keywords} />
                    <meta name='Author'content={this.state.settings.author}  />
                </Helmet>
                <Layout settings={this.state.settings} cart={this.state.cart} cartAction={this.cartActionHandler}>
                    <Route path='/' exact={true} render={x => <Main isGoogleMapsLoaded={this.state.isGoogleMapsLoaded} settings={this.state.settings} googleMapsApiKey={this.state.settings.googleMapsApiKey} />} />
                    <Route path='/menu' render={x => <Menu cartAction={this.cartActionHandler} isOrderingOn={this.state.settings.isOrderingOn} />} />
                    <Route path='/specials' render={x => <Specials containerClassName='primary-color' />} />
                    <Route path='/calendar' render={x => <Calendar isGoogleMapsLoaded={this.state.isGoogleMapsLoaded} googleMapsApiKey={this.state.settings.googleMapsApiKey} containerClassName='primary-color' />} />
                    <Route path='/contact' render={x => <Contact googleMapsApiKey={this.state.settings.googleMapsApiKey} settings={this.state.settings} isGoogleMapsLoaded={this.state.isGoogleMapsLoaded} />} />
                </Layout>
            </React.Fragment>
        );
    }

    async populate() {
        this.populateSettings();
        this.populateLinks();
        this.populateSiblings();
    }

    async populateSettings() {
        await fetch('api/settings')
            .then((resp) => resp.json())
            .then((data) => {
                const settings = new SiteSettings(data);
                settings.links = this.state.settings.links;
                settings.siblings = this.state.settings.siblings;
                this.setState({ settings: settings });

                const options: LoaderOptions = { /* todo */ };
                const loader = new Loader(settings.googleMapsApiKey, options);
                loader.load().then(() => this.setState({ isGoogleMapsLoaded: true, isLoaded: true }));

                if (settings.isOrderingOn) {
                    let cart = this.state.cart;
                    cart.load();
                    this.setState({ cart: cart });
                }
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
                settings.siblings = this.state.settings.siblings;
                this.setState({ settings: settings })
            });
    }
    async populateSiblings() {
        await fetch('api/siblings')
            .then((resp) => resp.json())
            .then((data) => {
                let settings = this.state.settings;
                settings.siblings = data;
                settings.links = this.state.settings.links;
                this.setState({ settings: settings })
            });
    }
}
