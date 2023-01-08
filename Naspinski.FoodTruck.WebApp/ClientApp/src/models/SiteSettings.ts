import { Schedule } from './Schedule';

export class SiteSettings {
    isBrickAndMortar: boolean = false;
    isOrderingOn: boolean = false;
    isApplyOn: boolean = false;
    isValidTimeForOnlineOrder: boolean = false;
    title: string = 'loading';
    subTitle: string = '';
    tagLine: string = '';
    description: string = '';
    author: string = '';
    keywords: string = ''
    logoImageUrl: string = '';
    bannerImageUrl: string = '';
    faviconImageUrl: string = '';
    contactPhone: string = '';
    minutesUntilClose: number = 0;
    merchUrl: string = '';
    debug: object = {};

    deliveryServiceImageToUrl: Object = {};
    schedule: Object = {};
    googleMapsApiKey: string = '';
    social: Object = {};

    square: SquareLocation[] = [];
    
    public get deliveryServiceImageToUrlMap(): Map<string, string> {
        return new Map<string, string>(Object.entries(this.deliveryServiceImageToUrl));
    }
    public get scheduleMap(): Map<string, Schedule> {
        return new Map<string, Schedule>(Object.entries(this.schedule));
    }
    public get socialMap(): Map<string, string> {
        return new Map<string, string>(Object.entries(this.social));
    }
    public get showCart(): boolean {
        return (!this.isBrickAndMortar || this.isValidTimeForOnlineOrder) && this.isOrderingOn;
    }

    constructor(init?: Partial<SiteSettings>) {
        Object.assign(this, init);
    }
}

export class SquareLocation {

    name: string = '';
    applicationId: string = '';
    locationId: string = '';

    constructor(init?: Partial<SquareLocation>) {
        Object.assign(this, init);
    }
}