import { Component } from 'react';
import * as React from 'react';
import './NavMenu.scss';
import { SiteSettings } from '../models/SiteSettings';
import { MDBNavbar, MDBNavLink, MDBNavItem, MDBNavbarBrand, MDBNavbarToggler, MDBNavbarNav, MDBCollapse } from 'mdbreact';

interface IProps {
    settings: SiteSettings
}

interface IState {
    isMenuOpen: boolean
}

export class NavMenu extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            isMenuOpen: true
        };
    }

    toggleCollapse = () => {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    render() {
        const settings = this.props.settings;
        let links = settings.links;

        const isHomeUrlInternal = settings.homeUrl == null || settings.homeUrl.length === 0;
        const homeChild = settings.bannerImageUrl.length === 0
            ? <strong className='white-text'>{settings.title}</strong>
            : <img className='title-logo' src={settings.bannerImageUrl} alt={settings.title} />;

        const returnLink = isHomeUrlInternal
            ? <MDBNavLink activeClassName='primary-color' to='/home/'>{homeChild}</MDBNavLink>
            : <a className='white-text' href={settings.homeUrl}>{homeChild}</a>;


        return (
            <MDBNavbar color='primary-color-dark' expand='md'>
                <MDBNavbarBrand>{returnLink}</MDBNavbarBrand>
                <MDBNavbarToggler onClick={this.toggleCollapse} />
                <MDBCollapse id="navbarCollapse3" isOpen={this.state.isMenuOpen} navbar className='nav-menu b ttu'>
                    <MDBNavbarNav right>
                        {Array.from(links.keys()).map(link =>
                            <MDBNavItem key={`header-link-${link}`}>
                                <MDBNavLink to={settings.links.get(link)}
                                    exact={link === 'home'}
                                    activeClassName='primary-color'>{link}</MDBNavLink>
                            </MDBNavItem>
                        )}
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
    );
  }
}
