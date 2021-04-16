import {Module} from 'web-component-builder';

import {App} from './components/app';
import {Test} from './components/test';
import {AppService} from './services/app.service';

@Module({
    components: [App, Test],
    providers: [AppService]
})
export class MainModule {}
