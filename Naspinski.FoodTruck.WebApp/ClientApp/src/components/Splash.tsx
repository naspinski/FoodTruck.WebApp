import * as React from 'react';
import { SiteSettings } from '../models/SiteSettings';
import './NavMenu.scss';
import { MDBBtn, MDBRow, MDBCol } from 'mdbreact';
import { NavLink } from 'react-router-dom';

interface IProps {
  settings: SiteSettings
}

const Splash = ({ settings }: IProps) => {

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
                        <NavLink to='/#calendar'>
                            <MDBBtn color='pink'>Calendar</MDBBtn>
                        </NavLink>
                        <NavLink to='/menu'>
                            <MDBBtn color='default'>Menu</MDBBtn>
                        </NavLink>
                        <NavLink to='/contact'>
                            <MDBBtn color='amber'>Contact</MDBBtn>
                        </NavLink>
                    </p>
                </MDBCol>
            </MDBRow>
        </div>
    );

}
export default Splash;