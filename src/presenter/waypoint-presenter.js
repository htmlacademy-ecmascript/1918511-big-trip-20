import { render } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import EventsListView from '../view/events-list-view.js';


export default class WaypointPresenter{
  #eventComponent = new EventsListView();
  #waypoints = [];
  #waypointContainer = null;
  #waypointModel = null;

  constructor({waypointContainer, waypointModel}) {
    this.#waypointContainer = waypointContainer;
    this.#waypointModel = waypointModel;
  }

  init() {
    this.#waypoints = [...this.#waypointModel.points];

    render(this.#eventComponent, this.#waypointContainer);
    for (let i = 1; i < this.#waypoints.length; i++) {
      this.#renderWaypoints(this.#waypoints[i]);
      this.#renderEditFrom(this.#waypoints[i]);
    }
  }

  #renderWaypoints(waypoint) {
    const waypointComponent = new WaypointView({waypoint});
    render(waypointComponent, this.#eventComponent.element);
  }

  #renderEditFrom(waypoint) {
    const editFormComponent = new EditFormView({waypoint});
    render(editFormComponent, this.#eventComponent.element);

  }

}


