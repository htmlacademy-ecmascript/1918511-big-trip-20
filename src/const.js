export const TRAVEL_WAYPOINTS = [
  'Amsterdam',
  'Chamonix',
  'Geneva',
  'New York',
  'Moscow',
  'Tokyo',
];

export const WAYPOINT_OPTIONS = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

export const FILTERS_OPTIONS = [
  'Everything',
  'Future',
  'Present',
  'Past'
];

export const Mode = {
  OPENED: 'opened',
  CLOSED: 'closed',
};

export const FiltersType = {
  EVERYTHING: 'default',
  FUTURE: 'date-future',
  PRESENT: 'date-present',
  PAST: 'date-past',
};

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};
