import { Component } from 'react';
import * as React from 'react';
import { MenuCategory } from '../models/MenuCategory';
import { Category } from '../components/Category';

interface IState {
    categories: MenuCategory[]
}

export class Menu extends Component<{}, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            categories: []
        }
    }

    componentDidMount() {
        this.populate();
    }

    render() {
        const categories = this.state.categories.map(x => new MenuCategory(x));

        return (
            <div id='menu' className='primary-color pb2'>
                <div className='inner-container border-dotted bottom mb2'>
                    <h2>Menu</h2>
                    {categories.map(category => <Category category={category} key={'cat-' + category.id} />)}
                </div>
            </div>
        );
    }

    async populate() {
        await fetch('api/menu')
            .then((resp) => resp.json())
            .then((data) => this.setState({ categories: data }));
    }
}