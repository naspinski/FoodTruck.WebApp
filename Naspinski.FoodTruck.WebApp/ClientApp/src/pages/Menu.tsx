import { Component } from 'react';
import * as React from 'react';
import { MenuCategory } from '../models/MenuCategory';
import { Category } from '../components/Category';

interface IProps {
    menuCategories: MenuCategory[]
}

export class Menu extends Component<IProps> {

    render() {
        return ( 
            <div id='menu'>
                <h2>Menu</h2>
                {this.props.menuCategories.map(category => <Category category={category} key={'cat=' + category.id} />)}
            </div>
        );
    }
}