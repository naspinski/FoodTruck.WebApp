import { Component } from 'react';
import * as React from 'react';
import { Item } from './Item';
import { MenuCategory } from '../models/MenuCategory';

interface IProps {
    category: MenuCategory
}

export class Category extends Component<IProps> {
        
    render() {
        const category = new MenuCategory(this.props.category);
        const header = category.sanitizedNamed.length === 0 ? <div className='border-dotted bottom'></div> :
            <React.Fragment>
                <h3 className='b amber-text darken-2 pl1 pt3 mt2 border-dotted top'>{category.name}</h3>
                <div className='border-dotted bottom pa1'>{category.description}</div>
            </React.Fragment>;

        const items = category.menuItems === undefined ? '' :
            category.menuItems.map(item => <Item item={item} key={'item-' + item.id} />);

        return (category.excludeFromMenu ? '' :
            <div>
                {header}
                <div className='pa1'>{items}</div>
            </div>
        )
    }
}
