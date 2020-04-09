import * as React from 'react';
import { MenuCategory } from '../models/MenuModels';
import Category from '../components/Category';
import { CartAction, CartUtil } from '../models/CartModels';
import SiteContext from '../models/SiteContext';

interface IProps {
    cartAction: (action:CartAction) => void
}

interface IState {
    categories: MenuCategory[]
}

const Menu = ({ cartAction }: IProps) => {

    const context = React.useContext(SiteContext);
    const categories = context.menu.map(x => new MenuCategory(x));

    return (
        <div id='menu' className='primary-color pb2'>
            <div className='inner-container border-dotted bottom mb2'>
                <h2>Menu</h2>
                {categories.map(category => <Category category={category} key={'cat-' + category.id} cartAction={cartAction} />)}
            </div>
        </div>
    );
}
export default Menu;