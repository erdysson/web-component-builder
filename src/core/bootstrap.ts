import {IClass} from './interfaces';
import {Runtime} from './runtime';

export const bootstrap = (moduleClass: IClass): void => {
    const runtime = new Runtime();
    runtime.initModule(moduleClass);
};
