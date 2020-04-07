import { Component } from 'react';
import * as React from 'react';
import { NavMenu } from './NavMenu';
import Footer from './Footer';
import { MDBContainer } from 'mdbreact';
import { Cart, CartAction } from '../models/CartModels';
import { ShoppingCart } from './ShoppingCart';
import SettingsContext from '../models/SettingsContext';

interface IProps {
    cartAction: (action: CartAction) => void,
    cart: Cart,
    children: Object[]
}

export class Layout extends Component<IProps> {
    render () {
        return (
            <React.Fragment>
                <MDBContainer fluid className='ph0'>
                    <NavMenu cart={this.props.cart} cartAction={this.props.cartAction} />
                    <ShoppingCart cart={this.props.cart} cartAction={this.props.cartAction} />
                    <MDBContainer fluid className='pt5 ph0'>
                        {this.props.children}
                    </MDBContainer>
                    <Footer />
                </MDBContainer>
            </React.Fragment>
        );
    }
}
Layout.contextType = SettingsContext;
