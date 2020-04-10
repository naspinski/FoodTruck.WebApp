import * as React from 'react';
import { MDBNavLink, MDBFooter, MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import StoreHours from './StoreHours';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFacebookSquare, faInstagramSquare, faTwitterSquare, faPinterestSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import SiteContext from '../models/SiteContext';
import { Utilities } from '../Utility';
import { NavLink } from 'react-router-dom';


const Footer = () => {

    const context = React.useContext(SiteContext);
    const settings = context.settings;
    const links = Utilities.getLinks(context);
        
    const socialLinks = !settings || !settings.socialMap ? [] : Array.from(settings.socialMap.keys()).map((network: string) => {
        let icon: IconDefinition;
        switch (network) {
            case 'Instagram': icon = faInstagramSquare; break;
            case 'Facebook': icon = faFacebookSquare; break;
            case 'LinkedIn': icon = faLinkedin; break;
            case 'Pinterest': icon = faPinterestSquare; break;
            case 'Twitter': icon = faTwitterSquare; break;
            default: icon = faCommentAlt;
        }

        return (
            <a key={`social-link-${network}`} href={settings.socialMap.get(network)} title={network} className='db'>
                <FontAwesomeIcon className='f3' icon={icon} /> <span className='pb1 pl1'>{network}</span>
            </a>
        )
    });

    return (
        <MDBFooter color="primary-color-dark" className="font-small">
            <MDBContainer fluid className="text-center text-md-left b pt1">
                <MDBRow>
                    <MDBCol md='4' className='pv2'>
                        {!settings || !settings.socialMap || settings.socialMap.size === 0 ? '' :
                            <React.Fragment>
                                <div className='underline pb1'>Social</div>
                                <div className='pl2'>
                                    {socialLinks}
                                </div>
                            </React.Fragment>
                        }
                    </MDBCol>
                    <MDBCol md='4' className='pv2'>
                        <div className='underline'>Navigation</div>
                        <div className='pt1'>
                            {Array.from(links.keys()).map((link:string) =>
                                <React.Fragment key={`footer-link-${link}`}>
                                    <MDBNavLink to={links.get(link)}
                                        className='dib pb0 pt0'
                                        exact={link === 'home'}
                                        activeClassName='primary-color'>{link}</MDBNavLink>
                                    <br />
                                </React.Fragment>
                            )}
                        </div>
                    </MDBCol>
                    <MDBCol md='4' className='pv2'>
                        {!settings.isBrickAndMortar ? '' :
                            <React.Fragment>
                                <div className='underline'>Operating Hours</div>
                                <div className='pb3 pl3'>
                                    <StoreHours schedule={settings.scheduleMap} />
                                </div>
                            </React.Fragment>
                        }
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            <div className="footer-copyright text-center py-3 primary-color">
                <MDBContainer fluid>
                    &copy; {new Date().getFullYear()} Copyright {settings.title} | <NavLink to='/terms'>Terms</NavLink> | developed by <a href="https://naspinski.net">Stan Naspinski</a>
                </MDBContainer>
            </div>
        </MDBFooter>
    );
}
export default Footer;
