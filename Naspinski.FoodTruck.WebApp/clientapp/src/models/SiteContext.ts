import * as React from "react";
import { SiteState } from "./SiteState";

const SiteContext = React.createContext(new SiteState());
export default SiteContext;