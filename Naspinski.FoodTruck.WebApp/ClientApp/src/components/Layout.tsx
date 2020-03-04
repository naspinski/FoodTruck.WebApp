import React, { Component } from 'react';
import { NavMenu } from './NavMenu';

interface IProps {
    title: string,
    logo: string,
    children: Object[]
}

export class Layout extends Component<IProps> {
    render () {
        return (
            <div>
                <NavMenu title={this.props.title} logo={this.props.logo} />
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
