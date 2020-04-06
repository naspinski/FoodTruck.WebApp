import * as React from 'react';
import { SiteSettings } from '../models/SiteSettings';
import { MDBBtn, MDBRow, MDBCol } from 'mdbreact';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
  settings: SiteSettings
}

interface IState {
    menuUrl: string
}

export class Splash extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            menuUrl: ''
        };
    }

    componentDidMount() {
        this.populate();
    }

    render() {
        const settings = this.props.settings;
        let serviceCount = 0;

        const menuDownload = this.state.menuUrl === null || this.state.menuUrl.length === 0 ? '' : 
            <a href={this.state.menuUrl}>
                <MDBBtn color='default'>
                    <FontAwesomeIcon icon='download' /> Download Menu
                </MDBBtn>
            </a>

        const menuLink = !settings.links.has('menu') ? '' :
            <NavLink to='/menu'>
                <MDBBtn color='secondary'>
                    <FontAwesomeIcon icon='hamburger' /> {settings.showCart ? 'Order for Pickup!' : 'Menu'}
                </MDBBtn>
            </NavLink>;

        const conditionalLink = settings.isBrickAndMortar ?
            (
                !settings.links.has('calendar') ? '' :
                    <NavLink to='/calendar'>
                        <MDBBtn color='pink'>
                            <FontAwesomeIcon icon='calendar' /> Calendar
                        </MDBBtn>
                    </NavLink>
            ) : (
                !settings.links.has('specials') ? '' :
                    <NavLink to='/specials'>
                        <MDBBtn color='pink'>
                            <FontAwesomeIcon icon='star' /> Calendar
                        </MDBBtn>
                    </NavLink>
            );

            

        return <div className='primary-color'>
            <MDBRow className='inner-container pt4'>
                <MDBCol md='6' className="tc ph3 pb3 flex items-stretch">
                    <div className='flex items-center'>
                        <img src={settings.logoImageUrl} alt={settings.title} />
                    </div>
                </MDBCol>
                <MDBCol md='6' className='pa3'>
                    <h5 className='b i serif'>{settings.tagLine}</h5>
                    <h3 className='b'>{settings.subTitle}</h3>
                    <p>{settings.description}</p>
                    <p>
                        {menuLink}
                        {menuDownload}
                        {conditionalLink}
                        <NavLink to='/contact'>
                            <MDBBtn color='amber'>
                                <FontAwesomeIcon icon='envelope' /> Contact{settings.isBrickAndMortar ? '' : '/Book'}
                            </MDBBtn>
                        </NavLink>
                    </p>
                    <p className='pl1'>
                        {settings.deliveryServiceImageToUrlMap.size === 0 ? '' : <h5 className='b i serif'>Delivery</h5>}
                        {Array.from(settings.deliveryServiceImageToUrlMap.keys()).map(svc =>
                            <a key={`service-${serviceCount++}`} href={settings.deliveryServiceImageToUrlMap.get(svc)}>
                                <img src={svc} />
                            </a>
                        )}
                    </p>
                </MDBCol>
            </MDBRow>
        </div>
    }

    async populate() {
        await fetch('api/menu-url')
            .then((response) => response.text())
            .then((data) => this.setState({ menuUrl: data }));
    }
}