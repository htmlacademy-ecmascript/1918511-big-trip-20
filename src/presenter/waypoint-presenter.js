import { render } from '../framework/render.js';
// import EditFormView from '../view/edit-form-view.js';
// import EditFormNoPhotosView from '../view/edit-form-no-photos-view.js';
// import WaypointView from '../view/waypoint-view.js';
import EventsListView from '../view/events-list-view.js';
import NotificationNewEventView from '../view/notification-new-event-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';

export default class WaypointPresenter{
  #eventComponent = new EventsListView();
  #waypoints = [];
  #waypointsInst = [];
  #waypointContainer = null;
  #waypointModel = null;

  constructor({waypointContainer, waypointModel}) {
    this.#waypointContainer = waypointContainer;
    this.#waypointModel = waypointModel;
  }

  init() {
    this.#waypoints = [...this.#waypointModel.points];
    if (this.#waypoints.length === 0) {
      render(new NotificationNewEventView(), this.#waypointContainer);
    }
    render(this.#eventComponent, this.#waypointContainer);
    for (let i = 0; i < this.#waypoints.length; i++) {
      const singleWaypointPresenter = new SingleWaypointPresenter(this.#waypoints[i], this.changeFav);
      this.#waypointsInst.push(singleWaypointPresenter);
      singleWaypointPresenter.renderWaypont(this.#eventComponent.element);
    }
  }

  changeFav = (id) => {
    this.#waypoints = this.#waypoints.map((elem) => {
      if (elem.id === id) {
        elem.isFavourite = !elem.isFavourite;
        return elem;
      }
      return elem;
    });
    this.#waypointsInst.forEach((elem) => {
      elem.destroy();
    });
    this.init();
  };
}


