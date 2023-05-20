import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripFiltersView from '../view/filters-view.js';
import TripSortView from '../view/sorting-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import { SortType } from '../const.js';
import { sortWaypointsByTime , sortWaypointsByPrice} from '../utils.js';

export default class MainPresenter {

  #tripMain = null;
  #tripControlsFilters = null;
  #tripEventsSection = null;
  #sortComponent = null;
  #currentSortType = SortType.DATE;

  #waypointModel = '';
  // #waypoints = [];
  #sourcedWaypoints = [];
  #waypointsInst = null;

  constructor({tripMain, tripControlsFiltres, tripEventsSection, waypointModel}) {
    this.#tripMain = tripMain;
    this.#tripControlsFilters = tripControlsFiltres;
    this.#tripEventsSection = tripEventsSection;
    // this.#waypoints = waypoints;
    this.#waypointModel = waypointModel;

    this.#waypointModel.addObserver(this.#handleModelEvent);
  }

  init() {
    // this.#waypoints = [...this.#waypointModel.points];
    this.#sourcedWaypoints = [...this.#waypointModel.points];

    this.#renderFilters();
    this.#renderWaypoints();

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

  #renderWaypoints() {
    const waypointPresenter = new WaypointPresenter({
      waypointContainer: this.#tripEventsSection,
      newSourcedWaypoints: this.updateSourcedWaypoints,
      waypointModel: this.#waypointModel,
    });
    this.#waypointsInst = waypointPresenter;
    waypointPresenter.init(this.points);
  }

  #deleteWaypoints() {
    this.#waypointsInst.clearList();
  }

  #renderSortOptions() {
    this.#sortComponent = new TripSortView({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortComponent, this.#tripEventsSection);
  }

  // #sortOptions(sortType) {
  //   switch (sortType) {
  //     case SortType.DAY:
  //       this.#waypoints = [...this.#sourcedWaypoints];
  //       break;
  //     case SortType.TIME:
  //       this.#waypoints.sort(sortWaypointsByTime);
  //       break;
  //     case SortType.PRICE:
  //       this.#waypoints.sort(sortWaypointsByPrice);
  //       break;
  //     default:
  //       return;

  //   }
  //   this.#currentSortType = sortType;
  // }

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

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    // this.#sortOptions(sortType);
    this.#currentSortType = sortType;
    this.#deleteWaypoints();
    this.#renderWaypoints();
  };

  updateSourcedWaypoints = (newData) => {
    this.#sourcedWaypoints = [...newData];
  };

}
