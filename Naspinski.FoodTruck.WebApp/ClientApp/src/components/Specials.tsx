import { Component } from 'react';
import * as React from 'react';
import { Special } from './Special';
import { SpecialModel } from '../models/SpecialModel';
import { MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardHeader, MDBRow } from 'mdbreact';

interface IState {
    specials: Map<string, SpecialModel[]>
}

export class Specials extends Component<{}, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            specials: new Map<string, SpecialModel[]>()
        }
    }

    componentDidMount() {
        this.populate();
    }
    
    render() {
        let count = 0;
        return this.state.specials.size === 0 ? ''
            : (
                <MDBCard className='mt3'>
                    <MDBCardHeader color='primary-color-dark'>
                        <MDBCardTitle className='ma0 b'>Daily Specials</MDBCardTitle>
                    </MDBCardHeader>
                    <MDBCardBody>
                        <MDBRow className='flex items-stretch'>
                        {Array.from(this.state.specials.keys()).map(day =>
                            <MDBCol md='4' key={'special-' + day}>
                                <MDBCard className='h-100'>
                                    <MDBCardHeader color='default-color-dark' className='b'>{day}</MDBCardHeader>
                                    <MDBCardText>
                                    {this.state.specials.get(day)?.map(special =>
                                        <Special special={special} key={'spec-' + day + '-' + (count++)} />
                                        )}
                                    </MDBCardText>
                                </MDBCard>
                            </MDBCol>
                            )}
                        </MDBRow>
                    </MDBCardBody>
                </MDBCard>)
    }

    async populate() {
        const response = await fetch('api/specials');
        const data = await response.json();
        this.setState({ specials: new Map<string, SpecialModel[]>(Object.entries(data)) });
    }
}
