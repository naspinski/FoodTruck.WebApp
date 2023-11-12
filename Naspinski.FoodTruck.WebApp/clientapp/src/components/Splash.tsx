import * as React from 'react';
import { MDBBtn, MDBRow, MDBCol } from 'mdbreact';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SiteContext from '../models/SiteContext';
import { Utilities } from '../Utility';

const Splash = () => {

    const context = React.useContext(SiteContext);
    const settings = context.settings;
    
    let serviceCount = 0;

    const menuDownload = settings.menuUrl === null || settings.menuUrl.length < 4 || settings.menuUrl.indexOf('.') === -1 ? '' :
        (
            settings.isLatestMenuImage ?
            (
                <NavLink to='/view-menu'>
                    <MDBBtn color='default'>
                        <FontAwesomeIcon icon='download' /> Download Menu
                    </MDBBtn>
                </NavLink>
            ) : (
                <a href={settings.menuUrl}>
                    <MDBBtn color='default'>
                        <FontAwesomeIcon icon='download' /> Download Menu
                    </MDBBtn>
                </a>
            )
        )

    const links = Utilities.getLinks(context);

    const menuLink = !links.has('menu') ? '' :
        <NavLink to='/menu'>
            <MDBBtn color='amber'>
                <FontAwesomeIcon icon='hamburger' /> {settings.showCart ? 'Order for Pickup!' : 'Menu'}
            </MDBBtn>
        </NavLink>;

    const conditionalLink = settings.isBrickAndMortar ?
        (
            !links.has('calendar') ? '' :
                <NavLink to='/calendar'>
                    <MDBBtn color='pink'>
                        <FontAwesomeIcon icon='calendar' /> Calendar
                    </MDBBtn>
                </NavLink>
        ) : (
            !links.has('specials') ? '' :
                <NavLink to='/specials'>
                    <MDBBtn color='pink'>
                        <FontAwesomeIcon icon='star' /> Specials
                    </MDBBtn>
                </NavLink>
        );

    const merchLink = !settings.merchUrl ? '' :
        <a href={settings.merchUrl} target="_blank">
            <MDBBtn color='deep-orange'>
                <FontAwesomeIcon icon='store' /> Merch
            </MDBBtn>
        </a>

    const hideDelivery = !settings.isBrickAndMortar || !settings.deliveryServiceImageToUrlMap || settings.deliveryServiceImageToUrlMap.size === 0 || !settings.isValidTimeForOnlineOrder;

    return <div className='primary-color'>
        <MDBRow className='inner-container pt4'>
            <MDBCol md='6' className="tc ph3 pb3 flex items-stretch">
                <div className='flex items-center'>
                    <img src={settings.logoImageUrl} alt={settings.title} />
                </div>
            </MDBCol>
            <MDBCol md='6' className='pa3'>
                <h5 className='b i serif'>{settings.tagLine}</h5>
                <h3 className='b'>{settings.subTitle}</h3>
                <p>{settings.description}</p>
                <p>
                    {menuLink}
                    {menuDownload}
                    {conditionalLink}
                    <NavLink to='/contact'>
                        <MDBBtn color='secondary'>
                            <FontAwesomeIcon icon='envelope' /> Contact{settings.isBrickAndMortar ? '' : '/Book'}
                        </MDBBtn>
                    </NavLink>
                    {merchLink}
                </p>
                <div className='pl1'>
                    {hideDelivery ? '' :
                        <React.Fragment>
                            <h5 className='b i serif'>Delivery</h5>
                            {Array.from(settings.deliveryServiceImageToUrlMap.keys()).map((svc: string) =>
                                <a key={`service-${serviceCount++}`} href={settings.deliveryServiceImageToUrlMap.get(svc)}>
                                    <img src={svc} />
                                </a>
                            )}
                        </React.Fragment>
                    }
                </div>
            </MDBCol>
        </MDBRow>
    </div>
}
export default Splash;