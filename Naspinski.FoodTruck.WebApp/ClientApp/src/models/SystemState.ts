import { SiteSettings } from "./SiteSettings";

export class SystemState {
    isLoaded: boolean = false;
    settings: SiteSettings = new SiteSettings();
    isGoogleMapsLoaded: boolean = false;

    constructor(init?: Partial<SystemState>) {
        Object.assign(this, init);
    }
}