import { SiteSettings } from "./SiteSettings";
import { Cart } from './CartModels';

export class SystemState {
    isLoaded: boolean = false;
    settings: SiteSettings = new SiteSettings();
    isGoogleMapsLoaded: boolean = false;
    cart: Cart = new Cart();

    constructor(init?: Partial<SystemState>) {
        Object.assign(this, init);
    }
}