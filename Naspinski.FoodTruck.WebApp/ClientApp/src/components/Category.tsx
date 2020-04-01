import { Component } from 'react';
import * as React from 'react';
import { Item } from './Item';
import { MenuCategory } from '../models/MenuModels';
import { CartAction } from '../models/CartModels';

interface IProps {
    category: MenuCategory,
    cartAction: (action: CartAction) => void,
    isOrderingOn: boolean
}

export class Category extends Component<IProps> {

    cartAction = (action: CartAction) => {
        this.props.cartAction(action);
    }

    render() {
        const category = new MenuCategory(this.props.category);
        const header = category.sanitizedNamed.length === 0 ? <div className='border-dotted bottom'></div> :
            <React.Fragment>
                <h3 className='b amber-text darken-2 pl1 pt3 mt2 border-dotted top serif'>{category.name}</h3>
                <div className='border-dotted bottom pa1'>{category.description}</div>
            </React.Fragment>;

        const items = category.menuItems === undefined ? '' :
            category.menuItems.map(item => <Item item={item} key={'item-' + item.id} cartAction={this.cartAction} isOrderingOn={this.props.isOrderingOn} />);

        return (category.excludeFromMenu ? '' :
            <div className='ph1'>
                {header}
                <div className='pa2'>{items}</div>
            </div>
        )
    }
}
