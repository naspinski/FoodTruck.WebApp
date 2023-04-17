import * as React from 'react';
import { MDBBtn } from 'mdbreact';
import { MenuPrice, MenuItem } from '../models/MenuModels';

interface IProps {
    item: MenuItem,
    price: MenuPrice,
    text: JSX.Element,
    disabled: boolean,
    handlePriceClick: (item: MenuItem, price: MenuPrice) => void,
}


const ItemPriceButton = ({ item, price, disabled, text, handlePriceClick }: IProps) => {

    const handleClick = () => handlePriceClick(item, price)

    return <MDBBtn size='sm' disabled={disabled} onClick={handleClick}>{text}</MDBBtn>
}
export default ItemPriceButton;