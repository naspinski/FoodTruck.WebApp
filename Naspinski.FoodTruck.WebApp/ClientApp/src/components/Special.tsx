import * as React from 'react';
import { SpecialModel } from '../models/SpecialModel';

interface IProps {
    special: SpecialModel
}

const Special = ({ special }: IProps) => {

    special = new SpecialModel(special);
    return (
        <div className='right-frame'>
            <div className='border-dotted left pl3'>
                <div className='flex justify-between'>
                    <div className='f3 b serif'>{special.name}</div>
                    <div className='pt2'>{special.timeDisplay}</div>
                </div>
                <div className='pl4'>
                    {special.description}
                </div>
            </div>
        </div>
    )
}
export default Special;
