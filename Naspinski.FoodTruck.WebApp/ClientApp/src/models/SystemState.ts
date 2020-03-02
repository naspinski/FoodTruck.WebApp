import { SiteSettings } from "./SiteSettings";

export class SystemState {
    settings: SiteSettings = new SiteSettings();

    constructor(init?: Partial<SystemState>) {
        Object.assign(this, init);
    }
}