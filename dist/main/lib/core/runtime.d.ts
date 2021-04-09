import { IClass } from './interfaces';
export declare class Runtime {
    private readonly providerInstanceMap;
    initModule(moduleClass: IClass): void;
    initProvider(providerClass: IClass): void;
    initComponent(componentClass: IClass): void;
    private createProviderInstance;
    private getHostClassConstructorParams;
    private getComponentFactory;
}
