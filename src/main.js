import { render, RenderPosition } from './render';
import TripInfoView from './view/trip-info-view.js';
import TripFiltersView from './view/filters-view.js';
import TripSortView from './view/sorting-view.js';
import EventsListView from './view/events-list-view.js';
import EditFormView from './view/edit-form-view.js';
import WaypointView from './view/waypoint-view.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');

render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new TripFiltersView(), tripControlsFiltersElement,RenderPosition.AFTERBEGIN);

const tripEventsSection = document.querySelector('.trip-events');

render(new TripSortView(), tripEventsSection);
render(new EventsListView(), tripEventsSection);

const eventsListElement = document.querySelector('.trip-events__list');

render(new EditFormView(), eventsListElement, RenderPosition.AFTERBEGIN);
render(new WaypointView(), eventsListElement);
render(new WaypointView(), eventsListElement);
render(new WaypointView(), eventsListElement);


