import { Component } from 'react';
import * as React from 'react';
import { MenuItem } from '../models/MenuItem';

interface IProps {
    item: MenuItem,
    key: string
}

export class Item extends Component<IProps> {

    render() {
        return (
            <div key={'item-' + this.props.item.id}>
                <h4>{this.props.item.name}</h4>
            </div>
        )
    }
}
