import {Params, QueryParams, Resolve} from './interfaces';

export class ActiveRoute {
    constructor(
        public params?: Params,
        public queryParams?: QueryParams,
        public resolve?: Resolve,
        public data?: any
    ) {}
}
