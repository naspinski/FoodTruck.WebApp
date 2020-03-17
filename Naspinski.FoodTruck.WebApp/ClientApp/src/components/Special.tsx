import { Component } from 'react';
import * as React from 'react';
import { SpecialModel } from '../models/SpecialModel';

interface IProps {
    special: SpecialModel
}

export class Special extends Component<IProps> {
        
    render() {
        return (
            <div>
                <h5>{this.props.special.name}</h5>
                <h6>{this.props.special.description}</h6>
                {this.props.special.timeDisplay}
            </div>
        )
    }
}
