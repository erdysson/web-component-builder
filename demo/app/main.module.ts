import {Module} from 'web-component-builder';

import {App} from './components/app';
import {Test} from './components/test';
import {AppService} from './services/app.service';
import {App2Service} from './services/app2.service';

@Module({
    components: [App, Test],
    providers: [AppService, App2Service]
})
export class MainModule {}
