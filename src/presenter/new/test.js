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

  constructor({tripMain, tripControlsFiltres, tripEventsSection, waypointModel}) {
    this.#tripMain = tripMain;
    this.#tripControlsFilters = tripControlsFiltres;
    this.#tripEventsSection = tripEventsSection;

    this.#waypointModel = waypointModel;
    this.#waypointModel.addObserver(this.#handleModelEvent);

  }

  init() {
    this.#sourcedWaypoints = this.points;

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

  #renderWaypoint(waypoint, placeToRender) {
    const singleWaypointPresenter = new SingleWaypointPresenter(waypoint, this.changeFav, this.resetToClosed, this.updateWaypoint, this.#handleViewAction);
    this.#waypointsInst.push(singleWaypointPresenter);
    singleWaypointPresenter.renderWaypont(placeToRender);
  }

  #renderFilters() {
    render(new TripFiltersView(this.points), this.#tripControlsFilters, RenderPosition.AFTERBEGIN);
    if (this.points.length !== 0) {
      render(new TripInfoView(), this.#tripMain, RenderPosition.AFTERBEGIN);
      this.#renderSortOptions();
    }
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

  #renderWaypoints(waypoints) {
    if (waypoints.length === 0) {
      render(this.#notiComponent, this.#tripEventsSection);
    }
    render(this.#eventComponent, this.#tripEventsSection);
    for (let i = 0; i < waypoints.length; i++) {
      this.#renderWaypoint(waypoints[i], this.#eventComponent.element);
    }
  }

  #renderSortOptions() {
    this.#sortComponent = new TripSortView({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortComponent, this.#tripEventsSection);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.clearList();
    this.#renderWaypoints(this.points);
  };

  updateSourcedWaypoints = (newData) => {
    this.#sourcedWaypoints = [...newData];
  };

  clearList = () => {
    this.#waypointsInst.forEach((elem) => {
      elem.destroy();
    });
  };

  changeFav = (id) => {
    this.#waypoints = this.#sourcedWaypoints.map((elem) => {
      if (elem.id === id) {
        elem.isFavourite = !elem.isFavourite;
        return elem;
      }
      return elem;
    });
    this.clearList();
    this.updateSourcedWaypoints(this.#waypoints);
    this.#renderWaypoints(this.#sourcedWaypoints);
  };

  resetToClosed = () => {
    this.#waypointsInst.forEach((elem) => {
      elem.resetView();
    });
  };

  updateWaypoint = (updatedWaypoint) => {
    this.#waypoints = this.#sourcedWaypoints.map((elem) => {
      if (elem.id === updatedWaypoint.id) {
        return updatedWaypoint;
      }
      return elem;
    });
    this.clearList();
    this.updateSourcedWaypoints(this.#waypoints);
    this.#renderWaypoints(this.#sourcedWaypoints);
  };
}
