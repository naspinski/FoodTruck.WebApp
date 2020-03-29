import { Schedule } from './Schedule';
import { SiblingSite } from './SiblingSite'

export class SiteSettings {
    isBrickAndMortar: boolean = false;
    isOrderingOn: boolean = false;
    isApplyOn: boolean = false;
    title: string = 'loading';
    subTitle: string = '';
    tagLine: string = '';
    description: string = '';
    author: string = '';
    keywords: string = ''
    logoImageUrl: string = '';
    bannerImageUrl: string = '';
    faviconImageUrl: string = '';
    homeUrl: string = '';

    deliveryServiceImageToUrl: Object = {};
    schedule: Object = {};
    googleMapsApiKey: string = '';
    links: Map<string, string> = new Map<string, string>();
    siblings: SiblingSite[] = [];
    social: Object = {};
    
    public get deliveryServiceImageToUrlMap(): Map<string, string> {
        return new Map<string, string>(Object.entries(this.deliveryServiceImageToUrl));
    }
    public get scheduleMap(): Map<string, Schedule> {
        return new Map<string, Schedule>(Object.entries(this.schedule));
    }
    public get socialMap(): Map<string, string> {
        return new Map<string, string>(Object.entries(this.social));
    }

    constructor(init?: Partial<SiteSettings>) {
        Object.assign(this, init);
    }
}