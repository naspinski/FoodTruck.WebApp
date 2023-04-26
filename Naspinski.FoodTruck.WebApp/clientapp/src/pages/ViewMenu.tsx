import { MDBCol, MDBRow } from 'mdbreact';
import * as React from 'react';
import { useEffect, useState } from 'react';
//import SiteContext from '../models/SiteContext';

const ViewMenu = () => {

    //const context = React.useContext(SiteContext);
    console.log('ViewMenu')

    const [menuImageUrl, setMenuImageUrl] = useState(null);
    useEffect(() => {
        console.log('useEffect menu')
        fetch('api/menu-url/image')
            .then((response) => response.text())
            .then((data) => setMenuImageUrl(data));
    }, []);

    const menuImage = menuImageUrl === null || menuImageUrl.length < 4 ? 'No Menu Image Uploaded' :
        (
            <div id='image menu'>
                <img src={menuImageUrl} title="menu" />
            </div>
        )

    return <div id="view-menu" className='primary-color'>
        <MDBRow className='inner-container pt4'>
            <MDBCol md='12' className="tc ph3 pb3 center">
                {menuImage}
            </MDBCol>
        </MDBRow>
    </div>
}
export default ViewMenu;