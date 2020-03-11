import { Component } from 'react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { SiteSettings } from '../models/SiteSettings';

interface IProps {
    settings: SiteSettings,
    menuCategoryCount: number
}

export class NavMenu extends Component<IProps> {

    render () {

        const isHomeUrlInternal = this.props.settings.homeUrl == null || this.props.settings.homeUrl.length === 0;
        const homeChild = this.props.settings.logoImageUrl.length === 0
            ? <h1>{this.props.settings.title}</h1>
            : <img className='title-logo' src={this.props.settings.logoImageUrl} alt={this.props.settings.title} />;

        const homeLink = isHomeUrlInternal
            ? <Link to='/home/'>{homeChild}</Link>
            : <a href={this.props.settings.homeUrl}>{homeChild}</a>;

        const menuLink = this.props.menuCategoryCount === 0 ? '' :
            <li>
                <Link to="/menu">Menu</Link>
            </li>

        return (
        <header>
            {homeLink}
            <ul className="navbar-nav flex-grow">
                <li>
                    <Link to="/">Home</Link>
                    </li>
                    {menuLink}
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
                <li>
                    <Link to="/faq">FAQ</Link>
                </li>
            </ul>
        </header>
    );
  }
}
