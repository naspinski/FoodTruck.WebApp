import { Component } from 'react';
import * as React from 'react';
import { NavMenu } from './NavMenu';
import { SiteSettings } from '../models/SiteSettings';
import { MDBContainer } from 'mdbreact';

interface IProps {
    settings: SiteSettings,
    menuCategoryCount: number,
    children: Object[]
}

export class Layout extends Component<IProps> {
    render () {
        return (
            <MDBContainer fluid>
                <NavMenu settings={this.props.settings} menuCategoryCount={this.props.menuCategoryCount} />
                <MDBContainer fluid>
                    {this.props.children}
                </MDBContainer>
            </MDBContainer>
        );
    }
}
