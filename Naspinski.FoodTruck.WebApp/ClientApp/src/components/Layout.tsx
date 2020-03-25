import { Component } from 'react';
import * as React from 'react';
import { NavMenu } from './NavMenu';
import { Footer } from './Footer';
import { SiteSettings } from '../models/SiteSettings';
import { MDBContainer } from 'mdbreact';

interface IProps {
    settings: SiteSettings,
    children: Object[]
}

export class Layout extends Component<IProps> {
    render () {
        return (
            <MDBContainer fluid>
                <NavMenu settings={this.props.settings} />
                <MDBContainer fluid>
                    {this.props.children}
                </MDBContainer>
                <Footer settings={this.props.settings} />
            </MDBContainer>
        );
    }
}
