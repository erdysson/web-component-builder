import {CanActivate} from 'web-component-builder';

export class PersonGuard implements CanActivate {
    canActivate(): Promise<boolean> {
        return Promise.resolve(true);
    }
}
