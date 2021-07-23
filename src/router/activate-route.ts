import {Params, QueryParams} from './interfaces';

export class ActiveRoute {
    constructor(
        public params: Params,
        public queryParams: QueryParams,
        public resolve?: unknown,
        public data?: unknown
    ) {}
}
