import { Component } from 'react';
import * as React from 'react';
import Item from './Item';
import { MenuCategory } from '../models/MenuModels';
import { CartAction } from '../models/CartModels';

interface IProps {
    category: MenuCategory,
    cartAction: (action: CartAction) => void
}

const Category = ({ category, cartAction }: IProps) => {

    category = new MenuCategory(category);

    const header = category.sanitizedNamed.length === 0 ? <div className='border-dotted bottom'></div> :
        <React.Fragment>
            <h3 className='b amber-text darken-2 pl1 pt3 mt2 border-dotted top serif'>{category.name}</h3>
            <div className='border-dotted bottom pa1'>{category.description}</div>
        </React.Fragment>;

    const items = category.menuItems === undefined ? '' :
        category.menuItems.map(item => <Item item={item} key={'item-' + item.id} cartAction={cartAction} />);

    return (category.excludeFromMenu ? <React.Fragment></React.Fragment> :
        <div className='ph1'>
            {header}
            <div className='pa2'>{items}</div>
        </div>
    )
}
export default Category;
