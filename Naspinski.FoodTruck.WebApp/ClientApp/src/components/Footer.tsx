import { Component } from 'react';
import * as React from 'react';
import { SiteSettings } from '../models/SiteSettings';
import { MDBNavLink, MDBFooter, MDBContainer, MDBRow, MDBCol, MDBBtn, MDBIcon } from 'mdbreact';
import StoreHours from './StoreHours';

interface IProps {
    settings: SiteSettings
}

export class Footer extends Component<IProps> {
    
    render() {
        const settings = this.props.settings;
        
        var socialLinks = Array.from(settings.socialMap.keys()).map(network => {
            let icon: string = '';
            let social: string = '';
            switch (network) {
                case 'Instagram': social = 'ins'; icon = 'instagram'; break;
                case 'Facebook': social = 'fb'; icon = 'facebook-f'; break;
                case 'LinkedIn': social = 'li'; icon = 'linked-in-in'; break;
                case 'Pinterest': social = 'pin'; icon = 'pinterest'; break;
                case 'Twitter': social = 'tw'; icon = 'twitter'; break;
                default: social = 'comm'; icon = 'comments';
            }

            return (
                <a href={settings.socialMap.get(network)} key={`social-link-${network}`}>
                    <MDBBtn social={social}>
                        <MDBIcon fab icon={icon} className="pr-1" />{network}
                    </MDBBtn>
                </a>
            )
        });

        return (
            <MDBFooter color="primary-color" className="font-small pt-4 mt-4">
                <MDBContainer fluid className="text-center text-md-left">
                    <MDBRow>
                        <MDBCol md="3">
                            {socialLinks}
                        </MDBCol>
                        <MDBCol md="5"></MDBCol>
                        <MDBCol md="1">
                            <div className='tr'>
                                {Array.from(settings.links.keys()).map(link =>
                                    <React.Fragment key={`footer-link-${link}`}>
                                        <MDBNavLink to={settings.links.get(link)}
                                            className='dib'
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
