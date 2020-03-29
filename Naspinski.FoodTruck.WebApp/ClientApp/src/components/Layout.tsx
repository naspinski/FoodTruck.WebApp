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
            <React.Fragment>
                <MDBContainer fluid className='ph0'>
                    <NavMenu settings={this.props.settings} />
                    <MDBContainer fluid className='pt5 ph0'>
                        {this.props.children}
                    </MDBContainer>
                    <Footer settings={this.props.settings} />
                </MDBContainer>
            </React.Fragment>
        );
    }
}
