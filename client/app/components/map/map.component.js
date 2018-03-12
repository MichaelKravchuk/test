import template from './map.component.html';
import controller from './map.controller.js';
import './map.component.scss';

let mapComponent = {
	restrict: 'E',
	bindings: {},
	template,
	controller,
	controllerAs: '$ctrl'
};
export default mapComponent;