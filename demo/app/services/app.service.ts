import {Injectable} from 'web-component-builder';

@Injectable()
export class AppService {
    getLanguage(): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(window.navigator.language);
            }, 3000);
        });
    }
}
