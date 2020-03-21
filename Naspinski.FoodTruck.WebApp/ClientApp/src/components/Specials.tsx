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
                <div className='amber darken-2 pb2'>
                    <div className='inner-container'>
                        <h2 className='border-bottom'>Daily Specials</h2>
                        {Array.from(this.state.specials.keys()).map(day =>
                            <div key={'special-' + day} className='inner-container-row'>
                                <div className='left-frame'>{day}</div>
                                <div className='right-frame'>
                                {this.state.specials.get(day)?.map(special =>
                                    <div className='flex-grow' key={`spec-${day}-${(count++)}`} >
                                        <Special special={special} />
                                    </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>)
    }

    async populate() {
        const response = await fetch('api/specials');
        const data = await response.json();
        this.setState({ specials: new Map<string, SpecialModel[]>(Object.entries(data)) });
    }
}
