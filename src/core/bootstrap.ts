import {Class} from './interfaces';
import {Runtime} from './runtime';

export const bootstrap = (moduleClass: Class): void => {
    const runtime = new Runtime();
    runtime.init(moduleClass);
};
