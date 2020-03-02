import { SiteSettings } from "./SiteSettings";

export class SystemState {
    settings: SiteSettings = new SiteSettings();
    faq: string = '[faq text placeholder]';

    constructor(init?: Partial<SystemState>) {
        Object.assign(this, init);
    }
}