import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
// import { getRandomData } from '../mock/mocks.js';

// const WAYPOINTS_COUNT = 5;

export default class WaypointModel extends Observable {
  #pointsApiService = null;
  // #waypoints = Array.from({length: WAYPOINTS_COUNT}, getRandomData);
  #waypoints = [];
  #offers = [];
  #destinations = [];

  constructor ({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;

    // this.#pointsApiService.points.then((points) => {
    //   console.log(points.map(this.#adaptToClient));

    // });
  }

  get points() {
    return this.#waypoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init () {
    try {
      const points = await this.#pointsApiService.points;
      this.#waypoints = points.map(this.#adaptToClient);
    } catch(err) {
      this.#waypoints = [];
    }
    this._notify(UpdateType.INIT);
  }


  async updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update');
    }

    try {
      const response = await this.#pointsApiService.updateWaypoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        update,
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error ('cant update');
    }
  }

  async addWaypoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addWaypoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#waypoints = [newPoint, ...this.#waypoints];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error ('cant add');
    }
  }

  async deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete');
    }

    try {
      await this.#pointsApiService.deleteWaypoint(update);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error ('cant delete');
    }

  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavourite: point['is_favorite'],
      destination: 'chtoto pro destination',
      offers: 'chtoto pro offers',
    };

    //console.log("kek"); adaptedPoint.destination = this.destinations();


    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}


