import { Component } from 'react';
import * as React from 'react';
import { MenuItem } from '../models/MenuItem';
import { MDBRow, MDBCol } from 'mdbreact';

interface IProps {
    item: MenuItem,
    key: string
}

export class Item extends Component<IProps> {
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
                        <select className='browser-default custom-select'>
                            {part.options.map(opt =>
                                <option key={`comboparts-option-${count++}`} value={opt.id}>{opt.name}</option>
                            )}
                        </select>
                    </div>
                )}
            </div>;

        const prices = item.prices.length === 0 ? '' :
            <div className='dib'>{item.prices.map(price =>
                <div className='price-container dib ml2' key={`item-${item.id}-price-${price.id}`}>
                    {price.priceTypeName !== null && price.priceTypeName.length > 0  ? <strong>{price.priceTypeName}: </strong> : ''}
                    {price.amountAsCurrency}
                </div>)}
            </div>;

        return (
            <div className='pa1'>
                <MDBRow>
                    <MDBCol md='6'>
                        <h5 className='b'>{item.name}</h5>
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
