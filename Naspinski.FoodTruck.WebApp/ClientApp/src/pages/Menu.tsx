import { Component } from 'react';
import * as React from 'react';
import { MenuCategory } from '../models/MenuCategory';
import { Category } from '../components/Category';

interface IProps {
    menuCategories: MenuCategory[]
}

export class Menu extends Component<IProps> {

    render() {

        const menu = this.props.menuCategories.length === 0
            ? <div>no menu items loaded</div>
            : <div>{this.props.menuCategories.length} menu items loaded</div>;

        return ( 
            <div id='menu'>
                <h2>Menu</h2>
                {this.props.menuCategories.map(category => <Category category={category} key={'cat=' + category.id} />)}
            </div>
        );
    }
}