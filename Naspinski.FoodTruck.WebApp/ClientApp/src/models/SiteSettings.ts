import { Schedule } from "./Schedule";
import { Location } from "./Location";

export class SiteSettings {
    isLoaded: boolean = false;
    isBrickAndMortar: boolean = false;
    isOrderingOn: boolean = false;
    isApplyOn: boolean = false;
    title: string = 'loading';
    tagLine: string = '';
    description: string = '';
    logoImageUrl: string = '';
    homeUrl: string = '';
    deliveryServiceImageToUrl: Object = {};
    location: Location = new Location();
    schedule: Object = {};

    public get deliveryServiceImageToUrlMap(): Map<string, string> {
        return new Map<string, string>(Object.entries(this.deliveryServiceImageToUrl));
    }
    public get scheduleMap(): Map<string, Schedule> {
        return new Map<string, Schedule>(Object.entries(this.schedule));
    }

    constructor(init?: Partial<SiteSettings>) {
        Object.assign(this, init);
    }
}