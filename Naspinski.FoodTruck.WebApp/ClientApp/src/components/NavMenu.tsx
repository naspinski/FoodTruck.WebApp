import React, { Component } from 'react';
import { Container, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
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
            <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
                <Container>
                    {this.props.logo.length === 0
                        ? <NavbarBrand tag={Link} to="/home">{this.props.title}</NavbarBrand>
                        : <img className='title-logo' src={this.props.logo} alt={this.props.title} />
                    }
                    <ul className="navbar-nav flex-grow">
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/contact">Contact</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/faq">FAQ</NavLink>
                        </NavItem>
                    </ul>
                </Container>
        </Navbar>
      </header>
    );
  }
}
