import { Location } from './Location';
import { BaseModel } from './BaseModel';

export class EventModel extends BaseModel{

    location: Location = new Location();
    beginsDay: string = '';
    beginsMonth: string = '';
    beginsTime: string = '';
    endsTime: string = '';

    constructor(init?: Partial<EventModel>) {
        super(init);
        Object.assign(this, init);
    }
}