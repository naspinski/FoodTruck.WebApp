import { Component } from 'react';
import * as React from 'react';
import { SpecialModel } from '../models/SpecialModel';

interface IProps {
    special: SpecialModel
}

export class Special extends Component<IProps> {
    render() {
        const special = new SpecialModel(this.props.special);
        return (
            <React.Fragment>
                <div className='flex justify-between b'>
                    <div className='f3'>{special.name}</div>
                    <div>{special.timeDisplay}</div>
                </div>
                <span className='stylish-color-text'>{special.description}</span>
            </React.Fragment>
        )
    }
}
