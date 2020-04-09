import * as React from 'react';
import { Special } from './Special';
import { SpecialModel } from '../models/SpecialModel';
import { MDBRow, MDBCol } from 'mdbreact';
import SiteContext from '../models/SiteContext';

interface IProps {
    containerClassName: string
}

interface IState {
    specials: Map<string, SpecialModel[]>
}

const Specials =({ containerClassName }: IProps) => {

    const context = React.useContext(SiteContext);
    const specials = context.specials;

    let counter = 0;
    return specials.size === 0 ? <React.Fragment></React.Fragment> : (
        <div className={`${containerClassName} pb3`}>
            <div className='inner-container'>
                <h2 className='border-dotted bottom header'>Daily Specials</h2>
                {Array.from(specials.keys()).map((day: string) =>
                    <div key={'special-' + day} className='inner-container-row border-dotted bottom'>
                        <MDBRow>
                            <MDBCol md='3'>
                                <div className='left-frame'>{day}</div>
                            </MDBCol>
                            <MDBCol md='9' className='pl0'>
                                <div className='right-frame'>
                                {specials.get(day)?.map(special =>
                                    <div className='flex-grow pr1' key={`spec-${day}-${(counter++)}`} >
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
export default Specials;
