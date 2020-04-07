import * as React from "react";
import { SiteSettings } from './SiteSettings';

const SettingsContext = React.createContext(new SiteSettings);
export default SettingsContext;