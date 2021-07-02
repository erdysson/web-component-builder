import {Module} from '../core/decorators';

import {RouterComponent} from './router.component';
import {RouterService} from './router.service';

@Module({
    components: [RouterComponent],
    providers: [RouterService],
    exports: [RouterService],
    declarations: [RouterComponent]
})
export class RouterModule {}
