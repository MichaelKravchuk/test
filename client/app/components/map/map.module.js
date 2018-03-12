import angular from 'angular';
import mapComponent from './map.component';

import 'angular-yandex-map/ya-map-2.1.min';

const mapModule = angular.module('map', ['yaMap'])
	.component('map', mapComponent);

export default mapModule;