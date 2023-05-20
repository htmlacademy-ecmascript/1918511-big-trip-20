import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripFiltersView from '../view/filters-view.js';
import TripSortView from '../view/sorting-view.js';
// import WaypointPresenter from './waypoint-presenter.js';
import { SortType } from '../const.js';
import { sortWaypointsByTime , sortWaypointsByPrice} from '../utils.js';
import EventsListView from '../view/events-list-view.js';
import NotificationNewEventView from '../view/notification-new-event-view.js';
import SingleWaypointPresenter from './test2.js';


export default class MainPresenter {
  #tripMain = null;
  #tripControlsFilters = null;
  #tripEventsSection = null;
  #sortComponent = null;
  #currentSortType = SortType.DATE;
  #sourcedWaypoints = [];
  #waypointsInst = [];

  #eventComponent = new EventsListView();
  #notiComponent = new NotificationNewEventView();
  #waypoints = [];
  #waypointModel = null;

  pointPresenters = new Map();

  constructor({tripMain, tripControlsFiltres, tripEventsSection, waypointModel}) {
    this.#tripMain = tripMain;
    this.#tripControlsFilters = tripControlsFiltres;
    this.#tripEventsSection = tripEventsSection;

    this.#waypointModel = waypointModel;
    this.#waypointModel.addObserver(this.#handleModelEvent);

  }

  init() {
    // this.#sourcedWaypoints = this.points;
    this.#renderFilters();
    this.#renderWaypoints(this.points);
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

  #handleModeChange() {
    this.pointPresenters.forEach((presenter) => presenter.resetView());
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderWaypoints(this.points);
  };

  #renderSortOptions() {
    this.#sortComponent = new TripSortView({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortComponent, this.#tripEventsSection);
  }

  #renderWaypoint(waypoint) {
    const singleWaypointPresenter = new SingleWaypointPresenter({
      pointsContainer: this.#eventComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    // this.#waypointsInst.push(singleWaypointPresenter);
    // singleWaypointPresenter.renderWaypont(placeToRender);
    singleWaypointPresenter.init(waypoint);
    this.pointPresenters.set(waypoint.id, singleWaypointPresenter);
  }

  #renderWaypoints(waypoints) {
    render(this.#eventComponent, this.#tripEventsSection);
    waypoints.forEach((point) => this.#renderWaypoint(point));
  }

  #renderNoPoints() {
    render(this.#notiComponent, this.#tripEventsSection);
  }

  #clearPoints () {
    this.pointPresenters.forEach((presenter) => presenter.destroy());
    this.pointPresenters.clear();
  }


  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
  };

  // updateSourcedWaypoints = (newData) => {
  //   this.#sourcedWaypoints = [...newData];
  // };


  // resetToClosed = () => {
  //   this.#waypointsInst.forEach((elem) => {
  //     elem.resetView();
  //   });
  // };

}
