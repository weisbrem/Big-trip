import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
//import dayjs from 'dayjs';

import ListPoinView from './view/list-point-view.js';
import CreateTripInfo from './view/trip-info-view.js';
import CreateSiteMenu from './view/menu-view.js';
import CreateFilters from './view/filter-view.js';
import {RenderPosition, render} from './render.js';

import CreateSort from './view/sort-view.js';
import CreateNoPointMessage from './view/no-point-message-view.js';

// import CreateNewPoint from './view/new-point-view.js';
// import {createPointWithoutOffersTemplate} from './view/new-point-without-destination-view.js';
// import {createPointWithoutDestinationTemplate} from './view/new-point-without-offers-view.js';

import CreateEditPoint from './view/edit-point-view.js';

import CreatePoint from './view/point-view.js';

import {generatePoint} from './mock/point.js';
//import {generateFilter} from './mock/filter.js';
import {DEFAULT_VALUE} from './const.js';

const TASK_COUNT = 20;

const tasks = Array.from({length: TASK_COUNT}, generatePoint);
// console.log(tasks);
//const filters = generateFilter(tasks);
//console.log(filters);
const tripInfoContainer = document.querySelector('.trip-main');
const siteMenuContainer = tripInfoContainer.querySelector('.trip-controls__navigation');
const tripFiltersContainer = tripInfoContainer.querySelector('.trip-controls__filters');

const tripEventsContainer = document.querySelector('.trip-events');

const renderPoint = (listPointContainer, point) => {
  const pointComponent = new CreatePoint(point);
  const pointEditComponent = new CreateEditPoint(point);

  const replacePointToForm = () => {
    listPointContainer.replaceChild(pointEditComponent.getElement, pointComponent.getElement);
  };

  const replaceFormToPoint = () => {
    listPointContainer.replaceChild(pointComponent.getElement, pointEditComponent.getElement);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  pointComponent.getElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.getElement.querySelector('.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.getElement.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(listPointContainer, pointComponent.getElement, RenderPosition.BEFOREEND);
};

render(tripInfoContainer, new CreateTripInfo().getElement, RenderPosition.AFTERBEGIN);
render(siteMenuContainer, new CreateSiteMenu(DEFAULT_VALUE.menu).getElement, RenderPosition.BEFOREEND);


if (tasks.length === 0) {
  render(tripEventsContainer, new CreateNoPointMessage().getElement, RenderPosition.BEFOREEND);
} else {
  render(tripFiltersContainer, new CreateFilters(DEFAULT_VALUE.filter).getElement, RenderPosition.BEFOREEND);
  render(tripEventsContainer, new CreateSort(DEFAULT_VALUE.sorting).getElement, RenderPosition.BEFOREEND);

  render(tripEventsContainer, new ListPoinView().getElement, RenderPosition.BEFOREEND);

  const listPointsContainer = document.querySelector('.trip-events__list');

  // render(listPointsContainer, new CreateEditPoint(tasks[0]).element, RenderPosition.AFTERBEGIN);
  // renderElement(listPointsContainer, new CreateNewPoint(tasks[1]).getElement, RenderPosition.BEFOREEND);
  // renderTemplate(listPointsContainer, createPointWithoutOffersTemplate(tasks[2]), RenderPosition.BEFOREEND);
  // renderTemplate(listPointsContainer, createPointWithoutDestinationTemplate(tasks[3]), RenderPosition.BEFOREEND);

  for (let i = 0; i < TASK_COUNT; i++) {
    renderPoint(listPointsContainer, tasks[i]);
  }

  //в качестве теста
  flatpickr('#event-start-time-1', {
    enableTime: true,
    altInput: true,
    // eslint-disable-next-line camelcase
    time_24hr: true,
    altFormat: 'd/m/y H:i',
    dateFormat: 'd-m-Y H:i',
  });

  flatpickr('#event-end-time-1', {
    enableTime: true,
    altInput: true,
    // eslint-disable-next-line camelcase
    time_24hr: true,
    altFormat: 'd/m/y H:i',
    dateFormat: 'd-m-Y H:i',
  });
}
