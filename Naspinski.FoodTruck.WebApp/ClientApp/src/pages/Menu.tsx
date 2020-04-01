import { Component } from 'react';
import * as React from 'react';
import { MenuCategory } from '../models/MenuModels';
import { Category } from '../components/Category';
import { CartAction, CartUtil } from '../models/CartModels';

interface IProps {
    cartAction: (action:CartAction) => void,
    isOrderingOn: boolean
}

interface IState {
    categories: MenuCategory[]
}

export class Menu extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            categories: []
        }
    }

    cartAction = (action: CartAction) => {
        this.props.cartAction(action);
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
                    {categories.map(category => <Category category={category} key={'cat-' + category.id} cartAction={this.cartAction} isOrderingOn={this.props.isOrderingOn} />)}
                </div>
            </div>
        );
    }

    async populate() {
        await fetch('api/menu')
            .then((resp) => resp.json())
            .then((data) => {
                const categories = data as MenuCategory[]
                this.setState({ categories: categories });
                this.cartAction(new CartAction({
                    task: 'populate-items',
                    categories: categories
                }));
            });
    }
}