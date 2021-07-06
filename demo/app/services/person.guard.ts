import {CanActivate} from 'web-component-builder';

export class PersonGuard implements CanActivate {
    canActivate(): Promise<boolean> {
        console.log('person guard can activate called');
        return Promise.resolve(true);
    }
}
