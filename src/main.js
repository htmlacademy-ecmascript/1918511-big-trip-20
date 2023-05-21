import MainPresenter from './presenter/main-presenter.js';
import WaypointModel from './model/waypoint-model.js';
import FilterModel from './model/filter-model.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const waypointModel = new WaypointModel();
const filterModel = new FilterModel();
const mainPresenter = new MainPresenter({tripMain: tripMainElement, tripControlsFiltres: tripControlsFiltersElement, tripEventsSection: tripEventsSection, waypointModel, filterModel});

mainPresenter.init();

