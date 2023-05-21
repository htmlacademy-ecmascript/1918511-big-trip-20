import { render, RenderPosition, remove } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
// import TripFiltersView from '../view/filters-view.js';
import TripSortView from '../view/sorting-view.js';
// import WaypointPresenter from './waypoint-presenter.js';
import { SortType , UpdateType, UserAction, FiltersType } from '../const.js';
import { sortWaypointsByTime , sortWaypointsByPrice, filter} from '../utils.js';
import EventsListView from '../view/events-list-view.js';
import NotificationNewEventView from '../view/notification-new-event-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';
import FilterPresenter from './filter-presenter.js';

export default class MainPresenter {
  #tripMain = null;
  #tripControlsFilters = null;
  #tripEventsSection = null;
  #sortComponent = null;
  #currentSortType = SortType.DATE;

  #eventComponent = new EventsListView();
  #notiComponent = null;
  #infoViewComponent = new TripInfoView();
  #waypointModel = null;
  #filterModel = null;
  #filterType = FiltersType.EVERYTHING;

  #pointPresenters = new Map();

  constructor({tripMain, tripControlsFiltres, tripEventsSection, waypointModel, filterModel}) {
    this.#tripMain = tripMain;
    this.#tripControlsFilters = tripControlsFiltres;
    this.#tripEventsSection = tripEventsSection;

    this.#waypointModel = waypointModel;
    this.#waypointModel.addObserver(this.#handleModelEvent);
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);

  }

  init() {
    this.#renderTripInfo();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#waypointModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType){
      case SortType.DAY:
        return filteredPoints;
      case SortType.TIME:
        return filteredPoints.sort(sortWaypointsByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortWaypointsByPrice);
    }
    return filteredPoints;
  }

  #renderFilters() {
    const filtersPresenter = new FilterPresenter({
      filterContainer: this.#tripControlsFilters,
      filterModel: this.#filterModel,
      waypointsModel: this.#waypointModel,
    });
    filtersPresenter.init();
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
    if (this.points.length === 0) {
      this.#renderNoPoints();
    }
    if (this.points.length) {
      render(this.#infoViewComponent, this.#tripMain, RenderPosition.AFTERBEGIN);
      this.#renderSortOptions();
    }
    render(this.#eventComponent, this.#tripEventsSection);
    this.points.forEach((point) => this.#renderWaypoint(point));
  }

  #renderNoPoints() {
    this.#notiComponent = new NotificationNewEventView({filterType: this.#filterType});
    render(this.#notiComponent, this.#eventComponent.element);
  }

  #clearPoints () {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#notiComponent);
    remove(this.#infoViewComponent);
    remove(this.#sortComponent);
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
