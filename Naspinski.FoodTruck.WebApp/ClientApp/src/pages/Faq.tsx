import { Component } from 'react';
import * as React from 'react';

interface IProps {
    text: string
}

export class Faq extends Component<IProps> {

    render() {
        return (
            <div>
                <h3>FAQ</h3>
                {this.props.text}.
            </div>
        );
    }
}
