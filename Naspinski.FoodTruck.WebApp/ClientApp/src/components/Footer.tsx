import { Component } from 'react';
import * as React from 'react';
import { SiteSettings } from '../models/SiteSettings';
import { MDBNavLink, MDBFooter, MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from 'mdbreact';
import StoreHours from './StoreHours';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface IProps {
    settings: SiteSettings
}

export class Footer extends Component<IProps> {
    
    render() {
        const settings = this.props.settings;
        
        var socialLinks = Array.from(settings.socialMap.keys()).map(network => {
            let icon: IconProp;
            switch (network) {
                case 'Instagram': icon = 'instagram-square'; break;
                case 'Facebook': icon = 'facebook-square'; break;
                case 'LinkedIn': icon = 'linkedin'; break;
                case 'Pinterest': icon = 'pinterest-square'; break;
                case 'Twitter': icon = 'twitter-square'; break;
                default: icon = 'comment-alt';
            }

            return (
                <a key={`social-link-${network}`} href={settings.socialMap.get(network)} title={network}>
                    <FontAwesomeIcon className='f3' icon={['fab', icon]} /> <span className='pb1 pl1'>{network}</span>
                </a>
            )
        });

        return (
            <MDBFooter color="primary-color" className="font-small pt-4 mt-4">
                <MDBContainer fluid className="text-center text-md-left b">
                    <MDBRow>
                        <MDBCol md="6">
                            <div className='pl1'>
                                {socialLinks}
                            </div>
                        </MDBCol>
                        <MDBCol md="3">
                            Navigation
                            <div className='pt1'>
                                {Array.from(settings.links.keys()).map(link =>
                                    <React.Fragment key={`footer-link-${link}`}>
                                        <MDBNavLink to={settings.links.get(link)}
                                            className='dib pb0 pt0'
                                            exact={link === 'Home'}
                                            activeClassName='primary-color-dark'>{link}</MDBNavLink>
                                        <br />
                                    </React.Fragment>
                                )}
                            </div>
                        </MDBCol>
                        <MDBCol md="3">
                            <div className='pb3 pl3'>
                                <StoreHours schedule={this.props.settings.scheduleMap} />
                            </div>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <div className="footer-copyright text-center py-3 primary-color-dark">
                    <MDBContainer fluid>
                        &copy; {new Date().getFullYear()} Copyright {settings.title} | developed by <a href="https://naspinski.net">Stan Naspinski</a>
                    </MDBContainer>
                </div>
            </MDBFooter>
    );
  }
}