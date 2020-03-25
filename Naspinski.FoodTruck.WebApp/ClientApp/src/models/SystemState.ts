import { SiteSettings } from "./SiteSettings";
import { MenuCategory } from "./MenuCategory";
import { CalendarEvent } from "../components/CalendarEvent";

export class SystemState {
    settings: SiteSettings = new SiteSettings();
    menuCategories: MenuCategory[] = [];
    events: CalendarEvent[] = [];
    faq: string = '[faq text placeholder]';
    isGoogleMapsLoaded: boolean = false;

    constructor(init?: Partial<SystemState>) {
        Object.assign(this, init);
    }
}