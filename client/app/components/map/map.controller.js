class mapController {

	constructor($scope) {
		'ngInject';
		this.name = 'map';
		this.$scope = $scope;

		this.map;
		this.collection;
		this.zoom = 8;
		this.distance = 0;
		this.halfDistance = 0;
		this.edges = [];
		this.route = {};
	}

	afterMapInit(target) {
		this.map = target;
		this.addSearchControl('arrival', 'Place arrival');
		this.addSearchControl('departure', 'Place departure');
	}

	afterInitCollection(collection) {
		this.collection = collection;
	}

	afterGeoObjectInit(obj, target, last) {
		target.distance = obj.distance;
		if (last) {
			this.changeColor();
		}
	}


	addSearchControl(vName, placeholder) {
		const mySearchControl = new ymaps.control.SearchControl({options: {noPlacemark: true, placeholderContent: placeholder}});

		this.map.controls.add(mySearchControl);

		mySearchControl.events.add('resultselect', evt => {
			const index = evt.get('index');
			mySearchControl.getResult(index).then(res => {
				this.route[`${vName}Coord`] = res.geometry._coordinates;
				this.changeRoute()
			});
		})
	}

	changeRoute() {
		if (!this.route.arrivalCoord || !this.route.departureCoord) { return null; }

		this.distance = 0;
		this.halfDistance = 0;

		ymaps.route([this.route.arrivalCoord, this.route.departureCoord]).then(
			res => {
				const pathsObjects = ymaps.geoQuery(res.getPaths());
				const edges = [];

				pathsObjects.each(path => {
					const coordinates = path.geometry.getCoordinates();
					for (let i = 1, l = coordinates.length; i < l; i++) {
						const newDistance = edges[0] ? ymaps.coordSystem.geo.getDistance(
							edges[0].geometry.coordinates[0],
							coordinates[i - 1]
						) : 0;

						edges.push({geometry:{
							type: 'LineString',
							coordinates: [coordinates[i], coordinates[i - 1]],
						}, distance: newDistance});

						if (this.distance < newDistance) {
							this.distance = newDistance;
						}
					}
				});

				this.halfDistance = this.distance / 2;

				this.edges = edges;
				this.$scope.$apply();
			}
		);
	}

	changeColor() {
		const objects = ymaps.geoQuery(this.collection).search(x => {
			return x.distance > this.halfDistance;
		});
		objects.setOptions(
			{
				strokeColor: '#ff0005',
				preset: 'islands#redIcon'
			}
		);
	}

}

export default mapController;