import { SiteSettings } from "./SiteSettings";
import { MenuCategory } from "./MenuCategory";

export class SystemState {
    settings: SiteSettings = new SiteSettings();
    menuCategories: MenuCategory[] = [];
    faq: string = '[faq text placeholder]';

    constructor(init?: Partial<SystemState>) {
        Object.assign(this, init);
    }
}