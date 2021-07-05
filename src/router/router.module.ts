import {Module} from '../core/decorators';
import {IModuleWithProviders} from '../core/interfaces';

import {Routes} from './interfaces';
import {RouterComponent} from './router.component';
import {RouterService} from './router.service';

@Module({
    components: [RouterComponent],
    providers: [RouterService],
    exports: [RouterService],
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
