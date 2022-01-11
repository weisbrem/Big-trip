import CreateEditPoint from '../view/edit-point-view.js';
import {RenderPosition, render, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';

export default class PointNewPresenter {
  #listPointContainer = null;
  #editPointComponent = null;
  #changeDate = null;

  constructor(listPointContainer, changeData) {
    this.#listPointContainer = listPointContainer;
    this.#changeDate = changeData;
  }

  init(point, OFFERS, DESTINATION) {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new CreateEditPoint(point, OFFERS, DESTINATION);
    this.#editPointComponent.setOnFormSubmit(this.#onClickToSave);
    this.#editPointComponent.setOnEditPointClick(this.#onClickToDelete);
    this.#editPointComponent.setOnDeleteClick(this.#onClickToDelete);
    this.#editPointComponent.setDatepickerTimeStart();
    this.#editPointComponent.setDatepickerTimeEnd();

    render(this.#listPointContainer, this.#editPointComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  destroy = () => {
    if (this.#editPointComponent === null) {
      return;
    }

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  setSaving = () => {
    this.#editPointComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#editPointComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }

  #onClickToSave = (point) => {
    this.#changeDate(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #onClickToDelete = () => {
    this.destroy();
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
