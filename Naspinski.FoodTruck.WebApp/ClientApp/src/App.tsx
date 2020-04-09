import { Component } from 'react';
import * as React from 'react';
import { Route } from 'react-router';
import { Helmet } from 'react-helmet';
import { LoaderOptions, Loader } from 'google-maps';

import SiteContext from './models/SiteContext';

import './custom.scss'
import Layout from './components/Layout';
import Main from './pages/Main';
import { Contact } from './pages/Contact';
import Menu from './pages/Menu';
import { SiteState } from './models/SiteState'
import Spinner from './components/Spinner';

import { library } from '@fortawesome/fontawesome-svg-core';
import Specials from './components/Specials';
import Calendar from './components/Calendar';
import { CartAction } from './models/CartModels';

import {
    faCommentAlt, faDownload, faMapMarkerAlt, faCalendar, faHamburger, faEnvelope, faTrashAlt, faPhone, faShoppingCart, faCog,
    faExternalLinkAlt, faChevronCircleRight, faChevronCircleLeft, faStar, faInfoCircle, faExclamationCircle, faThumbsUp, faTimes, faCaretDown
} from '@fortawesome/free-solid-svg-icons';
import { SpecialModel } from './models/SpecialModel';
import { SiteSettings } from './models/SiteSettings';

library.add(faCommentAlt, faDownload, faMapMarkerAlt, faCalendar, faHamburger, faEnvelope, faTrashAlt, faPhone, faShoppingCart, faCog,
    faExternalLinkAlt, faStar, faChevronCircleRight, faChevronCircleLeft, faInfoCircle, faExclamationCircle, faThumbsUp, faTimes, faCaretDown);


export default class App extends Component<{}, SiteState> {

    constructor(props: any) {
        super(props);
        this.state = new SiteState();
    }

    cartActionHandler = (action: CartAction) => {
        this.state.cart.action(action);
        this.setState({ cart: this.state.cart });
    }

    componentDidMount() {
        this.populate();
    }

    render() {
        return (
            <SiteContext.Provider value={this.state}>
                <React.Fragment>
                    <Spinner isLoading={!this.state.isLoaded} />
                    <Helmet>
                        <title>{this.state.settings.title}</title>
                        <link rel='shortcut icon' data-react-helmet='true' href={this.state.settings.faviconImageUrl} />
                        <link rel='icon' type='image/x-icon' data-react-helmet='true' href={this.state.settings.faviconImageUrl} />
                        <meta name='Keywords'content={this.state.settings.keywords} />
                        <meta name='Author'content={this.state.settings.author}  />
                    </Helmet>
                    <Layout cartAction={this.cartActionHandler}>
                        <Route path='/' exact={true} component={Main} />
                        <Route path='/menu' render={x => <Menu cartAction={this.cartActionHandler} />} />
                        <Route path='/specials' render={x => <Specials containerClassName='primary-color' />} />
                        <Route path='/calendar' render={x => <Calendar containerClassName='primary-color' />} />
                        <Route path='/contact' component={Contact} />
                    </Layout>
                </React.Fragment>
            </SiteContext.Provider>
        );
    }

    async populate() {
        this.populateSettings();
        this.populateSiblings();
        this.populateMenu();
        this.populateEvents();
        this.populateSpecials();
    }

    async populateSettings() {
        fetch('api/settings')
            .then((resp) => resp.json())
            .then((data) => {
                this.setState({ settings: new SiteSettings(data) });

                const options: LoaderOptions = { /* todo */ };
                const loader = new Loader(data.googleMapsApiKey, options);
                loader.load().then(() => this.setState({ isGoogleMapsLoaded: true, isLoaded: true }));
            });
    }

    async populateEvents() {
        fetch('api/events')
            .then((resp) => resp.json())
            .then((data) => {
                this.setState({ events: data })
            });
    }

    async populateMenu() {
        fetch('api/menu')
            .then((resp) => resp.json())
            .then((data) => { this.setState({ menu: data }) });
    }

    async populateSiblings() {
        fetch('api/siblings')
            .then((resp) => resp.json())
            .then((data) => { this.setState({ siblings: data }) });
    }

    async populateSpecials() {
        fetch('api/specials')
            .then((resp) => resp.json())
            .then((data) => {
                this.setState({ specials: new Map<string, SpecialModel[]>(Object.entries(data)) });
            });
    }
}
