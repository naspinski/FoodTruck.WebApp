import { Component } from 'react';
import * as React from 'react';
import './NavMenu.scss';
import { NavLink } from 'react-router-dom';
import { MDBNavbar, MDBNavLink, MDBNavItem, MDBNavbarBrand, MDBNavbarToggler, MDBNavbarNav, MDBCollapse, MDBDropdownToggle, MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBHamburgerToggler, MDBBtn } from 'mdbreact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Cart, CartAction } from '../models/CartModels';
import SettingsContext from '../models/SettingsContext';

interface IProps {
    cart: Cart,
    cartAction: (action: CartAction) => void,
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
        const settings = this.context;
        const cart = this.props.cart;
        let links = settings.links;

        const homeChild = settings.bannerImageUrl.length === 0
            ? <strong className='white-text'>{settings.title}</strong>
            : <img className='title-logo' src={settings.bannerImageUrl} alt={settings.title} />;
        
        const cartIndicator = !settings.isOrderingOn || cart.items.length === 0 ? '' :
                <MDBBtn  color='secondary' onClick={() => this.props.cartAction(new CartAction({ task: 'toggle' }))}>
                    <FontAwesomeIcon icon='shopping-cart' /> [{this.props.cart.itemCount}]
                </MDBBtn>;

        return (
            <MDBNavbar color='primary-color-dark' expand='md' scrolling fixed="top">
                <MDBHamburgerToggler id="hamburger" onClick={this.toggleCollapse} className='d-block d-md-none m-r-1' />
                <MDBNavbarBrand>
                    <NavLink to='/'>{homeChild}</NavLink>
                </MDBNavbarBrand>
                <div id='center-panel'>
                </div>
                <MDBCollapse id="navbarCollapse3" isOpen={!this.state.isMenuOpen} navbar className='nav-menu b ttu'>
                    <MDBNavbarNav right>
                        {Array.from(links.keys()).map((link: string) =>
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
                                        <FontAwesomeIcon icon='external-link-alt' />
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu right>
                                        {settings.siblings.map(x =>
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
}
NavMenu.contextType = SettingsContext;
