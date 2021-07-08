import {Params, QueryParams, Resolve} from './interfaces';

export class ActiveRoute {
    constructor(
        readonly params: Params,
        readonly queryParams: QueryParams,
        readonly resolve: Resolve,
        readonly data: any
    ) {}
}
