import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
  isLoading: boolean
}

const Spinner = ({ isLoading }: IProps) => {
    return !isLoading ? <React.Fragment></React.Fragment> :
        <div className='loader-container'>
            <div className='loader'>
                <FontAwesomeIcon icon='cog' spin />
            </div>
        </div>;
}
export default Spinner;