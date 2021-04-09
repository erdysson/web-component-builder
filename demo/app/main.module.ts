import {Module} from 'web-component-builder';

import {App} from './components/app';
import {AppService} from './services/app.service';

@Module({
    components: [App],
    providers: [AppService]
})
export class MainModule {}
