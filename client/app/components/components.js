import angular from 'angular';
import MapModule from './map/map.module';

const ComponentsModule = angular.module('app.components', [
    MapModule.name,
]);

export default ComponentsModule;