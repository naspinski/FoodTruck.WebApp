import { Component } from 'react';
import * as React from 'react';
import { MenuItem } from '../models/MenuItem';

interface IProps {
    item: MenuItem,
    key: string
}

export class Item extends Component<IProps> {

    render() {
        const img = !this.props.item.hasImage ? '' :
            <img className='menu-image' src={this.props.item.imageLocation} alt={this.props.item.name} />;

        const parts = !this.props.item.isCombo ? '' :
            <div>
                {this.props.item.comboParts.map(part =>
                    <select>
                        {part.options.map(opt => 
                            <option value={opt.id}>{opt.name}</option>
                        )}
                    </select>
                )}
            </div>;

        const numberOfPrices = this.props.item.prices.length;
        const prices = numberOfPrices === 0 ? '' :
            <div>{this.props.item.prices.map(price =>
                <span className='price-container' key={'price-' + price.id}>
                    {numberOfPrices === 1 ? <strong>{price.priceTypeName}</strong> : ''}
                    {price.amountAsCurrency}
                </span>)}
            </div>;

        return (
            <div key={'item-' + this.props.item.id}>
                <h4>{this.props.item.name}</h4>
                <div>{prices}</div>
                <div>
                    {img}
                    {this.props.item.description}
                </div>
                <div>{parts}</div>
            </div>
        )
    }
}
