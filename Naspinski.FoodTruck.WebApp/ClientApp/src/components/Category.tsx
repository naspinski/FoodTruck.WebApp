import { Component } from 'react';
import * as React from 'react';
import { Item } from './Item';
import { MenuCategory } from '../models/MenuCategory';

interface IProps {
    category: MenuCategory,
    key: string
}

export class Category extends Component<IProps> {
        
    render() {

        const items = this.props.category.menuItems === undefined ? '' :
            this.props.category.menuItems.map(item => <Item item={item} key={'item-' + item.id} />);

        return (this.props.category.excludeFromMenu ? '' :
            <div>
                <h3>{this.props.category.name}</h3>
                <div>{this.props.category.description}</div>
                {items}
            </div>
        )
    }
}
