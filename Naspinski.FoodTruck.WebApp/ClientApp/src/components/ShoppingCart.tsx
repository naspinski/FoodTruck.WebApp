import { Component } from 'react';
import * as React from 'react';
import './ShoppingCart.scss';
import { CartAction, Cart, CartItem } from '../models/CartModels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
    cart: Cart,
    cartAction: (action: CartAction) => void
}

export class ShoppingCart extends Component<IProps> {

    toggle = () => this.props.cartAction(new CartAction({ task: 'toggle' }));
    
    render() {
        const cart = this.props.cart;
        const items = cart.items.sort(function (a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });

        return (cart.isHidden ? '' :
            <div id='cart'>
                <a id='cart-closer' onClick={this.toggle}>
                    <FontAwesomeIcon icon='caret-down' />
                </a>
                <ul className='cart-section'>
                    {items.map(item => {
                        const remove = new CartAction({
                            task: 'remove',
                            key: item.key
                        });
                        const itemKey = `cart-item-${item.key}`;
                        const size = item.priceTypeName.length === 0 ? '' : <span className='normal f7'> ({item.priceTypeName})</span>

                        return (
                            <li key={itemKey}>
                                <div className='flex justify-between'>
                                    <strong>
                                        [{item.quantity}] {item.name}{size}
                                    </strong>
                                    <span>
                                        {item.totalCost} <FontAwesomeIcon icon='trash' onClick={() => this.props.cartAction(remove)} />
                                    </span>
                                </div>
                                <div className='f7 pl2'>{item.parts}</div>
                            </li>
                        )
                    })}
                </ul>
                <div id='cart-total' className='cart-section'>
                    <strong>Total:</strong>
                    <span>{cart.totalCost}</span>
                </div>
            </div>
        )
    }
}
