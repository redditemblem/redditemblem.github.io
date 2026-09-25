import { Routes } from '@angular/router';
import { Home } from './components/views/home/home';
import { MapView } from './components/views/map-view/map-view';
import { MapAnalysisView } from './components/views/map-analysis-view/map-analysis-view';
import { ConvoyView } from './components/views/convoy-view/convoy-view';
import { ShopView } from './components/views/shop-view/shop-view';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'Reddit Emblem Maps'
    },
    {
        path: ':teamName/map',
        component: MapView,
        title: 'Reddit Emblem Maps'
    },
    {
        path: ':teamName/map/analyze',
        component: MapAnalysisView,
        title: 'Reddit Emblem Maps'
    },
    {
        path: ':teamName/convoy',
        component: ConvoyView,
        title: 'Reddit Emblem Maps'
    },
    {
        path: ':teamName/shop',
        component: ShopView,
        title: 'Reddit Emblem Maps'
    },
    {
        path: '**',
        redirectTo: '',
    }
];
