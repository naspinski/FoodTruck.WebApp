import { Component } from 'react';
import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NavMenu.scss';
import { SiteSettings } from '../models/SiteSettings';
import { MDBNavbar, MDBNavLink, MDBNavItem, MDBNavbarBrand, MDBNavbarToggler, MDBNavbarNav, MDBCollapse } from 'mdbreact';

interface IProps {
    settings: SiteSettings,
    menuCategoryCount: number
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
        
        const isHomeUrlInternal = this.props.settings.homeUrl == null || this.props.settings.homeUrl.length === 0;
        const homeChild = this.props.settings.logoImageUrl.length === 0
            ? <strong className='white-text'>{this.props.settings.title}</strong>
            : <img className='title-logo' src={this.props.settings.logoImageUrl} alt={this.props.settings.title} />;

        const homeLink = isHomeUrlInternal
            ? <MDBNavLink activeClassName='default-color' to='/home/'>{homeChild}</MDBNavLink>
            : <a className='white-text' href={this.props.settings.homeUrl}>{homeChild}</a>;

        const menuLink = this.props.menuCategoryCount === 0 ? '' :
            <MDBNavLink activeClassName='default-color' to="/menu">Menu</MDBNavLink>;

        return (
            <MDBNavbar color='default-color-dark' expand='md'>
                <MDBNavbarBrand>
                    {homeLink}
                </MDBNavbarBrand>
                <MDBNavbarToggler onClick={this.toggleCollapse} />
                <MDBCollapse id="navbarCollapse3" isOpen={this.state.isMenuOpen} navbar className='nav-menu'>
                    <MDBNavbarNav right>
                        <MDBNavItem>
                            <MDBNavLink exact activeClassName='default-color' to="/">Home</MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            {menuLink}
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink activeClassName='default-color' to="/contact">Contact</MDBNavLink>
                        </MDBNavItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
    );
  }
}
