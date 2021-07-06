export type IContextProviderInjector = () => unknown;

export interface IContextProviderInjectorConfig {
    exported: boolean;
    inject: IContextProviderInjector;
}
