import { RenderPosition , render } from '../render.js';
import EditFormView from '../view/edit-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import EventsListView from '../view/events-list-view.js';


export default class WaypointPresenter{
  eventComponent = new EventsListView();

  constructor({waypointContainer}) {
    this.waypointContainer = waypointContainer;
  }

  init() {
    render(this.eventComponent, this.waypointContainer);
    render(new EditFormView(), this.eventComponent.getElement(), RenderPosition.AFTERBEGIN);
    for (let i = 0; i < 3 ; i ++) {
      render(new WaypointView(), this.eventComponent.getElement());
    }
  }
}


