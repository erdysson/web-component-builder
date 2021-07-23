import {Module} from '../core/decorators';
import {IModuleWithProviders} from '../core/interfaces';

import {ActivatedRoute} from './activated-route';
import {Routes} from './interfaces';
import {Location} from './location';
import {RouteMatcher} from './route-matcher';
import {Router} from './router';
import {RouterComponent} from './router.component';

@Module({
    components: [RouterComponent],
    providers: [Location, RouteMatcher, Router, ActivatedRoute],
    exports: [Router, ActivatedRoute],
    declarations: [RouterComponent]
})
export class RouterModule {
    static withConfig(routes: Routes): IModuleWithProviders {
        return {
            module: RouterModule,
            providers: [{provide: 'Routes', useValue: routes}]
        };
    }
}
