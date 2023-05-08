import EditFormNoPhotosView from '../view/edit-form-no-photos-view.js';
import WaypointView from '../view/waypoint-view.js';
import { render, remove, replace } from '../framework/render.js';

export default class SingleWaypointPresenter {
  #waypointComponent = null;
  #waypointEditComponent = null;
  #elem = null;

  constructor(elem, changeFav) {
    this.#elem = elem;
    this.changeFav = changeFav;

    const ecsKeydownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.replaceEditToInfo();
        document.removeEventListener('keydown', ecsKeydownHandler);
      }
    };

    this.#waypointComponent = new WaypointView ({
      waypoint: this.#elem,
      onEditClick: () => {
        this.replaceInfoToEdit();
        document.addEventListener('keydown', ecsKeydownHandler);
      },
      handleFavourite: () => {
        this.changeFav(this.#elem.id);
      }
    });

    this.#waypointEditComponent = new EditFormNoPhotosView({
      waypoint: this.#elem,
      onFormSubmit: () => {
        this.replaceEditToInfo();
        document.removeEventListener('keydown', ecsKeydownHandler);
      },
      onFormCancel: () => {
        this.replaceEditToInfo();
        document.removeEventListener('keydown', ecsKeydownHandler);
      }
    });
  }


  replaceEditToInfo() {
    replace(this.#waypointComponent, this.#waypointEditComponent);
  }

  replaceInfoToEdit() {
    replace(this.#waypointEditComponent, this.#waypointComponent);
  }

  destroy() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  }

  renderWaypont(place) {
    render(this.#waypointComponent, place);
  }
}
