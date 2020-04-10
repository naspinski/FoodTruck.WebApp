export class RegularExpressions {
    public static phone: RegExp = /^\d{10}$/;
    public static email: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
}

export class Utilities {
    public static getLinks(context): Map<string, string> {
        const links = new Map<string, string>();
        links.set('home', '/');
        if (context.menu.length > 0 && context.menu.filter(x => x.menuItems && x.menuItems.length > 0).length > 0) {
            links.set('menu', '/menu');
        }
        if (context.events.length > 0) {
            links.set('calendar', '/calendar');
        }
        if (context.specials && context.specials.size > 0) {
            links.set('specials', '/specials');
        }
        links.set('contact', '/contact');
        return links;
    }
}