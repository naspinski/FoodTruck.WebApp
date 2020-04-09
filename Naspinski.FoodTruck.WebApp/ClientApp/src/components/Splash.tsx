import * as React from 'react';
import { useState, useEffect } from 'react';
import { MDBBtn, MDBRow, MDBCol } from 'mdbreact';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SiteContext from '../models/SiteContext';
import { Utilities } from '../Utility';

const Splash = () => {

    const [menuUrl, setMenuUrl] = useState(null);
    useEffect(() => {
        fetch('api/menu-url')
            .then((response) => response.text())
            .then((data) => setMenuUrl(data));
    }, []);

    const context = React.useContext(SiteContext);
    const settings = context.settings;
    
    let serviceCount = 0;

    const menuDownload = menuUrl === null || menuUrl.length === 0 ? '' : 
        <a href={menuUrl}>
            <MDBBtn color='default'>
                <FontAwesomeIcon icon='download' /> Download Menu
            </MDBBtn>
        </a>

    const links = Utilities.getLinks(context);
    console.log(links);

    const menuLink = links.has('/menu') ? '' :
        <NavLink to='/menu'>
            <MDBBtn color='secondary'>
                <FontAwesomeIcon icon='hamburger' /> {settings.showCart ? 'Order for Pickup!' : 'Menu'}
            </MDBBtn>
        </NavLink>;

    const conditionalLink = settings.isBrickAndMortar ?
        (
            links.has('/calendar') ? '' :
                <NavLink to='/calendar'>
                    <MDBBtn color='pink'>
                        <FontAwesomeIcon icon='calendar' /> Calendar
                    </MDBBtn>
                </NavLink>
        ) : (
            links.has('/specials') ? '' :
                <NavLink to='/specials'>
                    <MDBBtn color='pink'>
                        <FontAwesomeIcon icon='star' /> Calendar
                    </MDBBtn>
                </NavLink>
        );

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
                        <MDBBtn color='amber'>
                            <FontAwesomeIcon icon='envelope' /> Contact{settings.isBrickAndMortar ? '' : '/Book'}
                        </MDBBtn>
                    </NavLink>
                </p>
                <p className='pl1'>
                    {!settings || !settings.deliveryServiceImageToUrlMap || settings.deliveryServiceImageToUrlMap.size === 0 || !settings.isValidTimeForOnlineOrder ? '' :
                        <React.Fragment>
                            <h5 className='b i serif'>Delivery</h5>
                            {Array.from(settings.deliveryServiceImageToUrlMap.keys()).map((svc: string) =>
                                <a key={`service-${serviceCount++}`} href={settings.deliveryServiceImageToUrlMap.get(svc)}>
                                    <img src={svc} />
                                </a>
                            )}
                        </React.Fragment>
                    }
                </p>
            </MDBCol>
        </MDBRow>
    </div>
}
export default Splash;