import MainPresenter from './presenter/main-presenter.js';
import WaypointPresenter from './presenter/waypoint-presenter.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');
const mainPresenter = new MainPresenter({tripMain: tripMainElement, tripControlsFiltres: tripControlsFiltersElement, tripEventsSection: tripEventsSection});
const waypointPresenter = new WaypointPresenter({waypointContainer: tripEventsSection});

mainPresenter.init();
waypointPresenter.init();

