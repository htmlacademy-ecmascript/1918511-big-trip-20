import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { humanizeDate } from '../utils.js';
import he from 'he';

function createTripInfoElement(model) {

  if (model.points.length) {
    const firstPointName = model.points[0].destination.name;
    const lastPointName = model.points[model.points.length - 1].destination.name;

    const isSameMonth = dayjs(model.points[0].dateFrom).month() === dayjs(model.points[model.points.length - 1].dateTo).month();

    const startingDate = humanizeDate(model.points[0].dateFrom, `${isSameMonth ? 'MMM DD' : 'DD MMM'}`);
    const endingDate = humanizeDate(model.points[model.points.length - 1].dateTo, `${isSameMonth ? 'DD' : 'DD MMM'}`);

    const totalPrice = model.points.reduce((accumulator, currentValue) => (accumulator += currentValue.basePrice), 0);

    const totalOffersPrice = model.points.reduce((accumulator, currentValue) => {
      const sum = currentValue.offers.reduce((acc, current) => (acc += current.price), 0);
      accumulator += sum;
      return accumulator;
    }, 0);

    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title"> ${model.points.length > 3 ? `${he.encode(`${firstPointName}`)} &mdash; . . . &mdash; ${he.encode(`${lastPointName}`)}` : model.points.map((elem) => elem.destination.name).join(' &mdash; ')} </h1>

      <p class="trip-info__dates">${startingDate}&nbsp;&mdash;&nbsp;${endingDate}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${he.encode(`${totalPrice + totalOffersPrice}`)}</span>
    </p>
  </section>`;
  }

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title"></h1>

      <p class="trip-info__dates"></p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value"></span>
    </p>
  </section>`;

}

export default class TripInfoView extends AbstractView {
  #waypointModel = null;

  constructor ({ waypointModel }) {
    super();
    this.#waypointModel = waypointModel;
  }

  get template() {
    return createTripInfoElement(this.#waypointModel);
  }
}
