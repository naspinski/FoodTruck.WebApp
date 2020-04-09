import * as React from 'react';
import Calendar from './../components/Calendar';
import Specials from '../components/Specials';
import Splash from '../components/Splash';
import SiteContext from '../models/SiteContext';

const Main = () => {   

    const context = React.useContext(SiteContext);

    return (
        <div>
            <Splash />
            {context.settings.isBrickAndMortar
                ? <Specials containerClassName='panel-2' />
                : <Calendar containerClassName='amber darken-2' />}
        </div>
    );
}
export default Main;