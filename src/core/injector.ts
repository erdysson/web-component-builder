import {Class} from './interfaces';
import {IContextProviderInjectorConfig} from './runtime-interfaces';

export class Injector {
    constructor(private readonly injectors: Map<string, IContextProviderInjectorConfig>) {}

    inject<T>(token: string | Class): T {
        token = typeof token === 'function' ? token.name : token;
        if (!this.injectors.has(token)) {
            throw Error(`No provider found for ${token}`);
        }
        const injectorConfig = this.injectors.get(token) as IContextProviderInjectorConfig;
        return injectorConfig.inject() as T;
    }
}
