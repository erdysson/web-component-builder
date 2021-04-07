import {Module} from '../src/core/decorators';
import {TestService} from './services/test.service';
import {LogService} from './services/log.service';
import {AppComponent} from './components/app/app.component';
import {LoadingComponent} from './components/loading/loading.component';
import {TestComponent} from './components/test/test.component';

@Module({
    components: [AppComponent, LoadingComponent, TestComponent],
    providers: [TestService, LogService]
})
export class AppModule {}
