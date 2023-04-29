import { WAYPOINT_OPTIONS, TRAVEL_WAYPOINTS } from '../const.js';
import { getRandomElem } from '../utils.js';


const mapWaypoints = new Map();
const mapOptions = new Map();

TRAVEL_WAYPOINTS.forEach((elem) => {
  mapWaypoints.set(elem, {
    'id': 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    'description': `THERE SHOULD BE DESCTRIPTION OF ${elem}`,
    'name': elem,
    'pictures': Array.from({ length: Math.floor(Math.random() * 10) }, () => ({
      src: `https://loremflickr.com/248/152?random=${Math.floor(
        Math.random() * 100
      )}`,
      description: `${elem} parliament building`,
    })),
  });
});

WAYPOINT_OPTIONS.forEach((elem) => {
  mapOptions.set(elem,
    [
      {
        'id': 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        'title': 'Just pay us ',
        'price': Math.floor(Math.random() * 100)
      }
    ],

  );

});

export const getRandomData = () => {
  const type = getRandomElem(WAYPOINT_OPTIONS);
  return {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    'basePrice': Math.floor(Math.random() * 1000),
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-07-11T11:22:13.375Z',
    'destination': mapWaypoints.get(getRandomElem(TRAVEL_WAYPOINTS)),
    'isFavorite': [true,false][Math.floor(Math.random() * 2)],
    'offers': mapOptions.get(type),
    'type': type,
  };

};


// const mockPoints = [
//   {
//     'id': 'f4b62099-293f-4c3d-a702-94eec4a2808c',
//     'basePrice': Math.floor(Math.random() * 1000),
//     'dateFrom': '2019-07-10T22:55:56.845Z',
//     'dateTo': '2019-07-11T11:22:13.375Z',
//     'destination': {
//       'id': 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
//       'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam culpa quae voluptate officia perspiciatis.',
//       'name': getRandomElem(TRAVEL_WAYPOINTS),
//       'pictures': [
//         {
//           'src': `https://loremflickr.com/248/152?random=${Math.floor(Math.random() * 10)}`,
//           'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam culpa quae voluptate officia perspiciatis.'
//         }]
//     },
//     'isFavorite': false,
//     'offers': [
//       {
//         'id': 'b4c3e4e6-9053-42ce-b747-e281314baa31',
//         'title': 'Upgrade to a business class',
//         'price': Math.floor(Math.random() * 10)
//       }
//     ],
//     'type': getRandomElem(WAYPOINT_OPTIONS)
//   },


// ];

