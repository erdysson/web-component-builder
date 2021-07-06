export type IContextProviderInjector = () => void;

export interface IContextProviderInjectorConfig {
    exported: boolean;
    injector: IContextProviderInjector;
}
