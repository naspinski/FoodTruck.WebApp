import { SiteSettings } from "./SiteSettings";
import { Cart } from './CartModels';
import { EventModel } from "./Event";
import { SiblingSite } from "./SiblingSite";
import { MenuCategory } from "./MenuModels";
import { SpecialModel } from "./SpecialModel";

export class SiteState {
    isLoaded: boolean = false;
    settings: SiteSettings = new SiteSettings();
    isGoogleMapsLoaded: boolean = false;
    cart: Cart = new Cart();
    events: EventModel[] = [];
    siblings: SiblingSite[] = [];
    specials: Map<string, SpecialModel[]> = new Map<string, SpecialModel[]>();
    menu: MenuCategory[] = [];

    constructor(init?: Partial<SiteState>) {
        Object.assign(this, init);
    }
}