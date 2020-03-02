export class Event {

    id: string = '';
    name: string = '';

    constructor(init?: Partial<Event>) {
        Object.assign(this, init);
    }
}