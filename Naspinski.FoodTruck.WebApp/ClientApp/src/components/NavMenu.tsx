import { Component } from 'react';
import * as React from 'react';
import './NavMenu.scss';
import { NavLink } from 'react-router-dom';
import { SiteSettings } from '../models/SiteSettings';
import { MDBNavbar, MDBNavLink, MDBNavItem, MDBNavbarBrand, MDBNavbarToggler, MDBNavbarNav, MDBCollapse, MDBDropdownToggle, MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBHamburgerToggler } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
            ? <NavLink to='/'>{homeChild}</NavLink>
            : <a className='white-text' href={settings.homeUrl}>{homeChild}</a>;


        return (
            <MDBNavbar color='primary-color-dark' expand='md' scrolling fixed="top">
                <MDBNavbarBrand>
                    {returnLink}
                </MDBNavbarBrand>
                <MDBHamburgerToggler id="hamburger" onClick={this.toggleCollapse} className='d-block d-md-none' />
                <MDBCollapse id="navbarCollapse3" isOpen={!this.state.isMenuOpen} navbar className='nav-menu b ttu'>
                    <MDBNavbarNav right>
                        {Array.from(links.keys()).map(link =>
                            <MDBNavItem key={`header-link-${link}`}>
                                <MDBNavLink to={settings.links.get(link)}
                                    exact={link === 'home'}
                                    activeClassName='primary-color'>{link}</MDBNavLink>
                            </MDBNavItem>
                        )}
                        {settings.siblings.length === 0 ? '' :
                            <MDBNavItem>
                                <MDBDropdown>
                                    <MDBDropdownToggle nav caret>
                                        <FontAwesomeIcon icon='external-link-alt' /> <span className="mr-2">Go To</span>
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu right>
                                        {settings.siblings.map(x =>
                                            <MDBDropdownItem href={x.url}>{x.name}</MDBDropdownItem>
                                        )}
                                    </MDBDropdownMenu>
                                </MDBDropdown>
                            </MDBNavItem>
                        }
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
    );
  }
}
