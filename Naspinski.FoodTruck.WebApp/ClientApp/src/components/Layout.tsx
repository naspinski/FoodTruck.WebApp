import * as React from 'react';
import NavMenu from './NavMenu';
import Footer from './Footer';
import { MDBContainer } from 'mdbreact';
import { CartAction } from '../models/CartModels';
import { ShoppingCart } from './ShoppingCart';
import SiteContext from '../models/SiteContext';

interface IProps {
    cartAction: (action: CartAction) => void,
    children: Object[]
}

const Layout = ({ cartAction, children }: IProps) => {

    const context = React.useContext(SiteContext);

    return (
        <React.Fragment>
            <MDBContainer fluid className='ph0'>
                <NavMenu cartAction={cartAction} />
                <ShoppingCart cartAction={cartAction} />
                <MDBContainer fluid className='pt5 ph0'>
                    {children}
                </MDBContainer>
                <Footer />
            </MDBContainer>
        </React.Fragment>
    );
}
export default Layout;
