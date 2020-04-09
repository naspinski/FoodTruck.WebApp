import { Component, useState } from 'react';
import * as React from 'react';
import './NavMenu.scss';
import { NavLink } from 'react-router-dom';
import { MDBNavbar, MDBNavLink, MDBNavItem, MDBNavbarBrand, MDBNavbarToggler, MDBNavbarNav, MDBCollapse, MDBDropdownToggle, MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBHamburgerToggler, MDBBtn } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Cart, CartAction } from '../models/CartModels';
import SiteContext from '../models/SiteContext';
import { SiteSettings } from '../models/SiteSettings';
import { Utilities } from '../Utility';

interface IProps {
    cartAction: (action: CartAction) => void,
}

interface IState {
    isMenuOpen: boolean
}

const NavMenu = ({ cartAction }: IProps) => {

    const context = React.useContext(SiteContext);
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    const toggleCollapse = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const settings = context.settings;
    const cart = context.cart;
    const links = Utilities.getLinks(context);

    const homeChild = settings.bannerImageUrl.length === 0
        ? <strong className='white-text'>{settings.title}</strong>
        : <img className='title-logo' src={settings.bannerImageUrl} alt={settings.title} />;
        
    const cartIndicator = !settings.isOrderingOn || cart.items.length === 0 ? '' :
            <MDBBtn  color='secondary' onClick={() => cartAction(new CartAction({ task: 'toggle' }))}>
                <FontAwesomeIcon icon='shopping-cart' /> [{cart.itemCount}]
            </MDBBtn>;

    return (
        <MDBNavbar color='primary-color-dark' expand='md' scrolling fixed="top">
            <MDBHamburgerToggler id="hamburger" onClick={toggleCollapse} className='d-block d-md-none m-r-1' />
            <MDBNavbarBrand>
                <NavLink to='/'>{homeChild}</NavLink>
            </MDBNavbarBrand>
            <div id='center-panel'>
            </div>
            <MDBCollapse id="navbarCollapse3" isOpen={!isMenuOpen} navbar className='nav-menu b ttu'>
                <MDBNavbarNav right>
                    {links === undefined ? 'links is undefined' :
                        Array.from(links.keys()).map((link: string) =>
                        <MDBNavItem key={`header-link-${link}`}>
                            <MDBNavLink to={links.get(link)}
                                exact={link === 'home'}
                                activeClassName='primary-color'>{link}</MDBNavLink>
                        </MDBNavItem>
                    )}
                    {context.siblings.length === 0 ? '' :
                        <MDBNavItem>
                            <MDBDropdown>
                                <MDBDropdownToggle nav caret>
                                    <FontAwesomeIcon icon='external-link-alt' />
                                </MDBDropdownToggle>
                                <MDBDropdownMenu right>
                                    {context.siblings.map(x =>
                                        <MDBDropdownItem key={`goto-link-${x.url}`} href={x.url}>{x.name}</MDBDropdownItem>
                                    )}
                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </MDBNavItem>
                    }
                </MDBNavbarNav>
            </MDBCollapse>
            <div className='cart-indicator'>
                {cartIndicator}
            </div>
        </MDBNavbar>
    );
}
export default NavMenu;
