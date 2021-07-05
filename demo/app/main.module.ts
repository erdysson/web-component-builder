import {Module, RouterModule} from 'web-component-builder';

import {appRoutes} from './app-routes';
import {App} from './components/app';
import {Home} from './components/home';
import {Profile} from './components/profile';
import {AppService} from './services/app.service';

@Module({
    imports: [RouterModule.withConfig(appRoutes)],
    components: [App, Home, Profile],
    providers: [AppService]
})
export class MainModule {}
