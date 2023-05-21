import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripFiltersView from '../view/filters-view.js';
import TripSortView from '../view/sorting-view.js';
// import WaypointPresenter from './waypoint-presenter.js';
import { SortType , UpdateType, UserAction } from '../const.js';
import { sortWaypointsByTime , sortWaypointsByPrice} from '../utils.js';
import EventsListView from '../view/events-list-view.js';
import NotificationNewEventView from '../view/notification-new-event-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';


export default class MainPresenter {
  #tripMain = null;
  #tripControlsFilters = null;
  #tripEventsSection = null;
  #sortComponent = null;
  #currentSortType = SortType.DATE;

  #eventComponent = new EventsListView();
  #notiComponent = new NotificationNewEventView();
  #waypointModel = null;

  #pointPresenters = new Map();

  constructor({tripMain, tripControlsFiltres, tripEventsSection, waypointModel}) {
    this.#tripMain = tripMain;
    this.#tripControlsFilters = tripControlsFiltres;
    this.#tripEventsSection = tripEventsSection;

    this.#waypointModel = waypointModel;
    this.#waypointModel.addObserver(this.#handleModelEvent);

  }

  init() {
    this.#renderTripInfo();
  }

  get points() {
    switch (this.#currentSortType){
      case SortType.DAY:
        return [...this.#waypointModel.points];
      case SortType.TIME:
        return [...this.#waypointModel.points].sort(sortWaypointsByTime);
      case SortType.PRICE:
        return [...this.#waypointModel.points].sort(sortWaypointsByPrice);
    }
    return this.#waypointModel.points;
  }


  #renderFilters() {
    render(new TripFiltersView(this.points), this.#tripControlsFilters, RenderPosition.AFTERBEGIN);
    if (this.points.length !== 0) {
      render(new TripInfoView(), this.#tripMain, RenderPosition.AFTERBEGIN);
      this.#renderSortOptions();
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderWaypoints(this.points);
  };

  #renderSortOptions() {
    this.#sortComponent = new TripSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#tripEventsSection);
  }

  #renderWaypoint(waypoint) {
    const singleWaypointPresenter = new SingleWaypointPresenter({
      pointsContainer: this.#eventComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    singleWaypointPresenter.init(waypoint);
    this.#pointPresenters.set(waypoint.id, singleWaypointPresenter);
  }

  #renderWaypoints() {
    render(this.#eventComponent, this.#tripEventsSection);
    if (this.points.length === 0) {
      this.#renderNoPoints();
    }
    this.points.forEach((point) => this.#renderWaypoint(point));
  }

  #renderNoPoints() {
    render(this.#notiComponent, this.#tripEventsSection);
  }

  #clearPoints () {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

  }

  #renderTripInfo() {
    this.#renderFilters();
    this.#renderWaypoints();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#waypointModel.addWaypoint(updateType, update);
        break;
      case UserAction.UPDATE_POINT:
        this.#waypointModel.updateWaypoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#waypointModel.deleteWaypoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderWaypoints();
        break;
      case UpdateType.MAJOR:
        this.#clearPoints({resetSortType: true});
        this.#renderWaypoints();
        break;
    }
  };
}
