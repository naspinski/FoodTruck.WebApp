import * as React from 'react';
import { SiteSettings } from '../models/SiteSettings';

interface IProps {
  settings: SiteSettings
}

const Splash = ({ settings }: IProps) => {

    return (
      <div>
        <h1>{settings.title}</h1>
            <p>{settings.tagLine}</p>
      </div>
    );

}
export default Splash;