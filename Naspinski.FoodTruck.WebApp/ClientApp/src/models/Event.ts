import { Location } from './Location';

export class Event {

    id: string = '';
    name: string = '';
    location: Location = new Location();
    beginsDay: string = '';
    beginsMonth: string = '';
    beginsTime: string = '';
    endsTime: string = '';

    constructor(init?: Partial<Event>) {
        Object.assign(this, init);
    }
}