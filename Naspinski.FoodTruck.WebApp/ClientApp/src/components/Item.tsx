import { Component } from 'react';
import * as React from 'react';
import { MenuItem, MenuPrice, MenuOption, MenuComboPart } from '../models/MenuModels';
import ItemPriceButton from './ItemPriceButton';
import { MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import { CartAction } from '../models/CartModels';

interface IProps {
    item: MenuItem,
    cartAction: (action: CartAction) => void,
    showCart: boolean,
    disabled: boolean
}

export class Item extends Component<IProps> {

    constructor(props: IProps) {
        super(props);
        this.props.item.comboParts.filter(x => x.options.length > 0).forEach(cp => cp.options[0].selected = true);
    }

    handlePriceClick = (item: MenuItem, price: MenuPrice) => {
        let action = new CartAction();
        action.task = 'add';
        action.item = item;
        action.price = price;
        this.props.cartAction(action);
    }

    onOptionChange = (e: any, part: MenuComboPart) => {
        part.options.find(x => x.id.toString() === e.target.value).selected = true;
        part.options.filter(x => x.id.toString() !== e.target.value).forEach(x => x.selected = false);
    }

    render() {
        let count = 0;
        const item = this.props.item;

        const img = !item.hasImage ? '' :
            <MDBCol md='1'>
                <img className='menu-image' src={item.imageLocation} alt={item.name} />
            </MDBCol>

        const parts = !item.comboParts === null || item.comboParts.length === 0 ? '' :
            <div>
                {item.comboParts.map(part => 
                    <div className='dib pr2 pt1' key={`comboparts-options-${count++}`}>
                        <select className='browser-default custom-select' onChange={(e) => this.onOptionChange(e, part)}>
                            {part.options.map(opt =>
                                <option key={`comboparts-option-${count++}`} value={opt.id}>{opt.name}</option>
                            )}
                        </select>
                    </div>
                )}
            </div>;

        const prices = item.prices.length === 0 ? '' :
            <div className='dib'>{item.prices.map(price => {
                const prefix = price.priceTypeName === null || price.priceTypeName.length === 0 ? '' : <strong>{price.priceTypeName}: </strong>;
                const text = <React.Fragment>{prefix}{price.amountAsCurrency}</React.Fragment>;
                const fill = !this.props.showCart ? text
                    : <ItemPriceButton item={item} price={price} text={text} disabled={this.props.disabled} handlePriceClick={this.handlePriceClick} />;
                return (
                    <div className='price-container dib ml2' key={`item-${item.id}-price-${price.id}`}>
                        {fill}
                    </div>
                );
            })}
            </div>;

        return (
            <div className='pa1'>
                <MDBRow>
                    <MDBCol md='6'>
                        <h5 className='b serif'>{item.name}</h5>
                    </MDBCol>
                    <MDBCol md='6' className='tr'>
                        {prices}
                    </MDBCol>
                </MDBRow>
                
                <MDBRow className='pl2'>
                    {img}
                    <MDBCol md={item.hasImage ? '11' : '12'} className='tal'>
                        <div>{item.description}</div>
                        <div>{parts}</div>
                    </MDBCol>
                </MDBRow>
            </div>
        )
    }
}
