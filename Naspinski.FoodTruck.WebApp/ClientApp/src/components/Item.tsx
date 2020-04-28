import * as React from 'react';
import { MenuItem, MenuPrice, MenuComboPart } from '../models/MenuModels';
import ItemPriceButton from './ItemPriceButton';
import { MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import { CartAction } from '../models/CartModels';
import SiteContext from '../models/SiteContext';
import ModalImage from "react-modal-image";

interface IProps {
    item: MenuItem,
    cartAction: (action: CartAction) => void
}

const Item = ({ item, cartAction }: IProps) => {

    const context = React.useContext(SiteContext);
    const cart = context.cart;
    const settings = context.settings;
    item.comboParts.filter(x => x.options.length > 0).forEach(cp => cp.options[0].selected = true);

    const handlePriceClick = (item: MenuItem, price: MenuPrice) => {
        let action = new CartAction();
        action.task = 'add';
        action.item = item;
        action.price = price;
        cartAction(action);
    }

    const onOptionChange = (e: any, part: MenuComboPart) => {
        part.options.find(x => x.id.toString() === e.target.value).selected = true;
        part.options.filter(x => x.id.toString() !== e.target.value).forEach(x => x.selected = false);
    }

    let count = 0;
    const img = !item.hasImage ? '' :
        <MDBCol md='1'>
            <ModalImage
                className='menu-image'
                small={item.imageLocation}
                large={item.imageLocation}
                alt={item.name} />
        </MDBCol>

    const parts = !item.comboParts === null || item.comboParts.length === 0 ? '' :
        <div>
            {item.comboParts.map(part => 
                <div className='dib pr2 pt1' key={`comboparts-options-${count++}`}>
                    <select className='browser-default custom-select' onChange={(e) => onOptionChange(e, part)}>
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
            const fill = !settings.showCart ? text
                : <ItemPriceButton item={item} price={price} text={text} disabled={cart.disabled} handlePriceClick={handlePriceClick} />;
            return (
                <div className='price-container dib ml2' key={`item-${item.id}-price-${price.id}`}>
                    {fill}
                </div>
            );
        })}
        </div>;

    const description = () => {
        return { __html: item.description };
    }

    return (
        <div className='pa1 pt3'>
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
                    <div dangerouslySetInnerHTML={description()}></div>
                    <div>{parts}</div>
                </MDBCol>
            </MDBRow>
        </div>
    );
}
export default Item;
