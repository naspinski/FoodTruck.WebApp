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
            <span className='db mt1'>
                <span className='brown lighten-2 text-white pa2 db flex justify-between'>
                    <span>{special.timeDisplay}</span>
                    <span className='b'>{special.name}</span>
                </span>
                <span className='p2 brown lighten-4 pa2 db'>{special.description}</span>
            </span>
        )
    }
}
