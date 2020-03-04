import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.css';

interface IProps {
    title: string,
    logo: string,
}

export class NavMenu extends Component<IProps> {
  
    render () {
        return (
        <header>
            
            <Link to='/home/'>{this.props.logo.length === 0
                ? <h1>{this.props.title}</h1>
                : <img className='title-logo' src={this.props.logo} alt={this.props.title} />
            }</Link>
            <ul className="navbar-nav flex-grow">
                <li>
                    <Link className="text-dark" to="/">Home</Link>
                </li>
                <li>
                    <Link className="text-dark" to="/contact">Contact</Link>
                </li>
                <li>
                    <Link className="text-dark" to="/faq">FAQ</Link>
                </li>
            </ul>
        </header>
    );
  }
}
