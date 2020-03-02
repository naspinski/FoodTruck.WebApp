import React, { Component } from 'react';
import { Container } from 'reactstrap';
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
                <Container>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
