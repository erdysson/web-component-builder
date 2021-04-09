import {Module} from 'web-component-builder/dist/main/lib/core/decorators';

import {App} from './components/app';
import {AppService} from './services/app.service';

@Module({
    components: [App],
    providers: [AppService]
})
export class MainModule {}
