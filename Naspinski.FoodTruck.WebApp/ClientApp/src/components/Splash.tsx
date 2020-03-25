import * as React from 'react';
import { SiteSettings } from '../models/SiteSettings';
import { MDBBtn, MDBRow, MDBCol } from 'mdbreact';
import { NavLink } from 'react-router-dom';

interface IProps {
  settings: SiteSettings
}

const Splash = ({ settings }: IProps) => {

    const menuLink = !settings.links.has('menu') ? '' :
        <NavLink to='/menu'>
            <MDBBtn color='default'>Menu</MDBBtn>
        </NavLink>;

    const calendarLink = !settings.links.has('calendar') ? '' :
        <NavLink to='/#calendar'>
            <MDBBtn color='pink'>Calendar</MDBBtn>
        </NavLink>;

    return (
        <div className='primary-color'>
            <MDBRow className='inner-container'>
                <MDBCol md='6' className="tc pa5">
                    <img src={settings.logoImageUrl} alt={settings.title} />
                </MDBCol>
                <MDBCol md='6' className='white-text pa4'>
                    <h5 className='b i'>{settings.title}</h5>
                    <h3 className='b'>{settings.tagLine}</h3>
                    <p>{settings.description}</p>
                    <p>
                        {calendarLink}
                        {menuLink}
                        <NavLink to='/contact'>
                            <MDBBtn color='amber'>Contact{settings.isBrickAndMortar ? '' : '/Book'}</MDBBtn>
                        </NavLink>
                    </p>
                </MDBCol>
            </MDBRow>
        </div>
    );

}
export default Splash;