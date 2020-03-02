export class Schedule {
    open: string = '';
    close: string = '';
    hours: string = '';
    
    constructor(init?: Partial<Schedule>) {
        Object.assign(this, init);
    }
}