import {Class} from './interfaces';
import {Runtime} from './runtime';

export const bootstrap = (moduleClass: Class): void => {
    const runtime = new Runtime();
    runtime.createRuntimeContext(moduleClass);

    console.log('runtime context map', runtime.runtimeContextMap);
};
