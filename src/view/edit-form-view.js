import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDate , ucFirst } from '../utils.js';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';

function createEditForm(data, isNew, model) {
  const { destination, type, dateFrom, dateTo} = data;
  const pics = destination.pictures.length > 0
    ? `<div class="event__photos-container"><div class="event__photos-tape">
  ${destination.pictures.map((elem) => `<img class="event__photo" src=${he.encode(`${elem.src}`)} alt="Event photo">`).join('')}
  </div></div>` : '';

  const rollupBtn = `<button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span>
</button>`;

  const offersModelInfo = model.offers.find((option) => option.type === type);
  const deleteCase = data.isDeleting ? 'Deleting...' : 'Delete';

  const offersList = offersModelInfo.offers.length
    ? `<div class="event__available-offers">${offersModelInfo.offers
      .map((elem) => {
        const isChecked = data.offers.find(
          (oneOfferOfData) => oneOfferOfData.id === elem.id
        );
        return `<div class="event__offer-selector">
            <input ${isChecked ? 'checked' : ''}
             class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage">
            <label data-id="${he.encode(`${elem.id}`)}" class="event__offer-label" for="event-offer-luggage-1">
              <span class="event__offer-title">${he.encode(`${elem.title}`)}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${he.encode(`${elem.price}`)}</span>
            </label>
            </div>`;
      })
      .join('')}</div>`
    : '';


  return /*html*/`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(`${type}`)}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

    ${model.offers.map((elem) => `<div class="event__type-item">
            <input id="event-type-${elem.type.toLocaleLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${elem.type.toLocaleLowerCase()}" ${elem.type === type ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${elem.type.toLocaleLowerCase()}" for="event-type-${elem.type.toLocaleLowerCase()}-1">${ucFirst(elem.type)}</label>
          </div>`).join('')}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(`${destination.name}`)}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${model.destinations.map((elem) => `<option value="${he.encode(`${elem.name}`)}"></option>`)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${humanizeDate(dateFrom, 'DD/MM/YY HH:mm')}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${humanizeDate(dateTo, 'DD/MM/YY HH:mm')}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(`${data.basePrice}`)}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">${data.isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset">
      ${isNew ? 'Cancel' : deleteCase}
      </button>

      ${isNew ? '' : rollupBtn}
    </header>

    <section class="event__details">
      <section class="event__section  event__section--offers">

      ${data.offers.length > 0 ? '<h3 class="event__section-title  event__section-title--offers">Offers</h3>' : ''}

      ${offersList}

      </section>

      <section class="event__section  event__section--destination">
      ${destination.name ? '<h3 class="event__section-title  event__section-title--destination">Destination</h3>' : ''}

        <p class="event__destination-description">${he.encode(`${destination.description}`)}</p>

        ${pics}

      </section>
    </section>
  </form>
</li>`;
}

export default class EditFormView extends AbstractStatefulView {

  #handleSubmit = null;
  #handleCancel = null;
  #datepickerTo = null;
  #datepickerFrom = null;
  #handleDelete = null;
  #waypointModel = null;
  #isNew = false;

  constructor ({waypoint, onFormSubmit, onFormCancel, onFormDelete, isNew, waypointModel}) {
    super();
    this.#waypointModel = waypointModel;
    if (waypoint) {
      this._setState(EditFormView.parseWaypointToState(waypoint));
    } else {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 2);
      const fillerData = {
        basePrice: '',
        dateFrom: dateFrom,
        dateTo: new Date(),
        destination: {
          name: '',
          pictures: [],
          description: '',
        },
        isFavourite: false,
        offers: [],
        type: this.#waypointModel.offers[0].type,
      };

      this._setState(EditFormView.parseWaypointToState(fillerData));
    }
    this.#handleSubmit = onFormSubmit;
    this.#handleCancel = onFormCancel;
    this.#handleDelete = onFormDelete;
    this.#isNew = isNew;


    this._restoreHandlers();
  }

  get template () {
    return createEditForm(this._state, this.#isNew, this.#waypointModel);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(waypoint) {
    this.updateElement(
      EditFormView.parseWaypointToState(waypoint)
    );
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmit(EditFormView.parseStateToWaypoint(this._state));
  };

  #formCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancel();
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleDelete(EditFormView.parseStateToWaypoint(this._state));
  };

  #formEventChangeHandler = (evt) => {
    if(evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
        offers: [],
      });
    }
  };

  #formDestChangeHandler = (evt) => {
    if (this.#waypointModel.destinations.find((elem) => elem.name === evt.target.value)) {
      this.updateElement({
        destination: this.#waypointModel.destinations.find((elem) => elem.name === evt.target.value)
      });
      this.element.querySelector('.event__save-btn').removeAttribute('disabled', '');
    } else {
      this.element.querySelector('.event__save-btn').setAttribute('disabled', '');
    }
  };

  #formPriceChangeHandler = (evt) => {
    this.updateElement({
      basePrice: Number(evt.target.value)
    });
  };

  #fromDateSubmitHandler = ([userDateFrom]) => {
    if (userDateFrom === undefined) {
      this.#setDatepicker();
      return;
    }
    this.updateElement({
      dateFrom: userDateFrom,
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'LABEL') {
      const idOffer = evt.target.dataset.id;
      const currentTypeOffers = this.#waypointModel.offers.find((elem) => elem.type === this._state.type);

      const isActiveOffer = this._state.offers.find((elem) => elem.id === idOffer);

      if (isActiveOffer) {
        const newOffersArray = this._state.offers.filter((elem) => elem.id !== idOffer);
        this.updateElement({
          offers: newOffersArray,
        });
      }

      if (!isActiveOffer) {
        const newOffer = currentTypeOffers.offers.find((elem) => elem.id === idOffer);

        const newOffersArray = [...this._state.offers];
        newOffersArray.push(newOffer);
        this.updateElement({
          offers: newOffersArray,
        });
      }

    }
    if (evt.target.tagName === 'SPAN') {
      const idOffer = evt.target.parentElement.dataset.id;
      const currentTypeOffers = this.#waypointModel.offers.find((elem) => elem.type === this._state.type);

      const isActiveOffer = this._state.offers.find((elem) => elem.id === idOffer);

      if (isActiveOffer) {
        const newOffersArray = this._state.offers.filter((elem) => elem.id !== idOffer);
        this.updateElement({
          offers: newOffersArray,
        });
      }

      if (!isActiveOffer) {
        const newOffer = currentTypeOffers.offers.find((elem) => elem.id === idOffer);

        const newOffersArray = [...this._state.offers];
        newOffersArray.push(newOffer);
        this.updateElement({
          offers: newOffersArray,
        });
      }

    }

  };

  #toDateSubmitHandler = ([userDateTo]) => {
    if (userDateTo === undefined) {
      this.#setDatepicker();
      return;
    }
    this.updateElement({
      dateTo: userDateTo,
    });
  };

  #setDatepicker() {
    if (this._state.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          time_24hr: true, // eslint-disable-line
          maxDate: this._state.dateTo,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          onChange: this.#fromDateSubmitHandler,
        },
      );
    }
    if (this._state.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          time_24hr: true, // eslint-disable-line
          minDate:this._state.dateFrom,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          onChange: this.#toDateSubmitHandler,
        },
      );
    }
  }

  _restoreHandlers() {
    if (this.element.querySelector('.event__rollup-btn')) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#formCancelHandler);
    }
    this.element
      .querySelector('.event__save-btn')
      .addEventListener('click', this.#formSubmitHandler);
    if (this.element.querySelector('.event__rollup-btn')) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#formDeleteHandler);
    } else {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#formCancelHandler);
    }
    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#formEventChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#formDestChangeHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#formPriceChangeHandler);

    if (this.element.querySelector('.event__available-offers')){
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#offerClickHandler);
    }

    this.#setDatepicker();
  }

  static parseStateToWaypoint(waypoint) {
    const point = {...waypoint};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  static parseWaypointToState(state) {
    return { isDisabled: false, isSaving: false, isDeleting: false, ...state };
  }

}
