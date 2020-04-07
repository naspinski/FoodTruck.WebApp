import { Component } from 'react';
import * as React from 'react';
import { Special } from './Special';
import { SpecialModel } from '../models/SpecialModel';
import { MDBRow, MDBCol } from 'mdbreact';

interface IProps {
    containerClassName: string
}

interface IState {
    specials: Map<string, SpecialModel[]>
}

export class Specials extends Component<IProps, IState> {

    constructor(props: IProps) {
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
        return this.state.specials.size === 0 ? '' : (
            <div className={`${this.props.containerClassName} pb3`}>
                <div className='inner-container'>
                    <h2 className='border-dotted bottom header'>Daily Specials</h2>
                    {Array.from(this.state.specials.keys()).map((day: string) =>
                        <div key={'special-' + day} className='inner-container-row border-dotted bottom'>
                            <MDBRow>
                                <MDBCol md='3'>
                                    <div className='left-frame'>{day}</div>
                                </MDBCol>
                                <MDBCol md='9' className='pl0'>
                                    <div className='right-frame'>
                                    {this.state.specials.get(day)?.map(special =>
                                        <div className='flex-grow pr1' key={`spec-${day}-${(count++)}`} >
                                            <Special special={special} />
                                        </div>
                                        )}
                                        </div>
                                </MDBCol>
                            </MDBRow>
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
