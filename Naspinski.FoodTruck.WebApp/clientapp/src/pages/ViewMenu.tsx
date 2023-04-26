import { MDBCol, MDBRow } from 'mdbreact';
import * as React from 'react';
import SiteContext from '../models/SiteContext';

const ViewMenu = () => {

    const context = React.useContext(SiteContext);
    const settings = context.settings;

    const menuImage = settings.imageMenuUrl === null || settings.imageMenuUrl.length < 4 ? 'No Menu Image Uploaded' :
        (
            <div id='image menu'>
                <img src={settings.imageMenuUrl} title="menu" />
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