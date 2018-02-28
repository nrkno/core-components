import {name, version} from './package.json'
import {registerElements, registerEvent} from '../utils'

export default {}

const aria = window.aria = {}

aria.ListboxCombobox = function (
  comboboxNode,
  input,
  listbox,
  searchFn,
  shouldAutoSelect,
  onShow,
  onHide
) {
  this.combobox = comboboxNode;
  this.input = input;
  this.listbox = listbox;
  this.searchFn = searchFn;
  this.shouldAutoSelect = shouldAutoSelect;
  this.onShow = onShow || function () {};
  this.onHide = onHide || function () {};
  this.activeIndex = -1;
  this.resultsCount = 0;
  this.shown = false;
  this.hasInlineAutocomplete =
    input.getAttribute('aria-autocomplete') === 'both';

  this.setupEvents();
};

aria.ListboxCombobox.prototype.setupEvents = function () {
  document.body.addEventListener('click', this.checkHide.bind(this));
  this.input.addEventListener('keyup', this.checkKey.bind(this));
  this.input.addEventListener('keydown', this.setActiveItem.bind(this));
  this.input.addEventListener('focus', this.checkShow.bind(this));
  this.input.addEventListener('blur', this.checkSelection.bind(this));
  this.listbox.addEventListener('click', this.clickItem.bind(this));
};

aria.ListboxCombobox.prototype.checkKey = function (event) {
  switch (event.keyCode) {
    case 38: // Up
    case 40: // Down
    case 27: // ESC
    case 13: // Enter
      return event.preventDefault();
    default: this.updateResults(false);
  }

  if (this.hasInlineAutocomplete) {
    if (event.keyCode !== 8) this.autocompleteItem(); // Not backspace
  }
};

aria.ListboxCombobox.prototype.updateResults = function (shouldShowAll) {
  var searchString = this.input.value;
  var results = this.searchFn(searchString);

  this.hideListbox();

  if (!shouldShowAll && !searchString) {
    results = [];
  }

  if (results.length) {
    for (var i = 0; i < results.length; i++) {
      var resultItem = document.createElement('li');
      resultItem.className = 'result';
      resultItem.setAttribute('role', 'option');
      resultItem.setAttribute('id', 'result-item-' + i);
      resultItem.innerText = results[i];
      if (this.shouldAutoSelect && i === 0) {
        resultItem.setAttribute('aria-selected', 'true');
        resultItem.classList.add('focused');
        this.activeIndex = 0;
      }
      this.listbox.appendChild(resultItem);
    }
    this.listbox.classList.remove('hidden');
    this.combobox.setAttribute('aria-expanded', 'true');
    this.resultsCount = results.length;
    this.shown = true;
    this.onShow();
  }
};

aria.ListboxCombobox.prototype.setActiveItem = function (evt) {
  var key = evt.which || evt.keyCode;
  var activeIndex = this.activeIndex;

  if (key === 27) {
    this.hideListbox();
    setTimeout((function () {
      // On Firefox, input does not get cleared here unless wrapped in
      // a setTimeout
      this.input.value = '';
    }).bind(this), 1);
    return;
  }

  if (this.resultsCount < 1) {
    if (this.hasInlineAutocomplete && (key === 40 || key === 38)) {
      this.updateResults(true);
    }
    else {
      return;
    }
  }

  var prevActive = this.getItemAt(activeIndex);
  var activeItem;

  switch (key) {
    case 38:
      if (activeIndex <= 0) {
        activeIndex = this.resultsCount - 1;
      }
      else {
        activeIndex--;
      }
      break;
    case 40:
      if (activeIndex === -1 || activeIndex >= this.resultsCount - 1) {
        activeIndex = 0;
      }
      else {
        activeIndex++;
      }
      break;
    case 13:
      activeItem = this.getItemAt(activeIndex);
      this.selectItem(activeItem);
      return;
    case 9:
      this.checkSelection();
      this.hideListbox();
      return;
    default:
      return;
  }

  evt.preventDefault();

  activeItem = this.getItemAt(activeIndex);
  this.activeIndex = activeIndex;

  if (prevActive) {
    prevActive.classList.remove('focused');
    prevActive.setAttribute('aria-selected', 'false');
  }

  if (activeItem) {
    this.input.setAttribute(
      'aria-activedescendant',
      'result-item-' + activeIndex
    );
    activeItem.classList.add('focused');
    activeItem.setAttribute('aria-selected', 'true');
    if (this.hasInlineAutocomplete) {
      this.input.value = activeItem.innerText;
    }
  }
  else {
    this.input.setAttribute(
      'aria-activedescendant',
      ''
    );
  }
};

aria.ListboxCombobox.prototype.getItemAt = function (index) {
  return document.getElementById('result-item-' + index);
};

aria.ListboxCombobox.prototype.clickItem = function (evt) {
  if (evt.target && evt.target.nodeName == 'LI') {
    this.selectItem(evt.target);
  }
};

aria.ListboxCombobox.prototype.selectItem = function (item) {
  if (item) {
    this.input.value = item.innerText;
    this.hideListbox();
  }
};

aria.ListboxCombobox.prototype.checkShow = function (evt) {
  this.updateResults(false);
};

aria.ListboxCombobox.prototype.checkHide = function (evt) {
  if (evt.target === this.input || this.combobox.contains(evt.target)) {
    return;
  }
  this.hideListbox();
};

aria.ListboxCombobox.prototype.hideListbox = function () {
  this.shown = false;
  this.activeIndex = -1;
  this.listbox.innerHTML = null;
  this.listbox.classList.add('hidden');
  this.combobox.setAttribute('aria-expanded', 'false');
  this.resultsCount = 0;
  this.input.setAttribute(
    'aria-activedescendant',
    ''
  );
  this.onHide();
};

aria.ListboxCombobox.prototype.checkSelection = function () {
  if (this.activeIndex < 0) {
    return;
  }
  var activeItem = this.getItemAt(this.activeIndex);
  this.selectItem(activeItem);
};

aria.ListboxCombobox.prototype.autocompleteItem = function () {
  var autocompletedItem = this.listbox.querySelector('.focused');
  var inputText = this.input.value;

  if (!autocompletedItem || !inputText) {
    return;
  }

  var autocomplete = autocompletedItem.innerText;
  if (inputText !== autocomplete) {
    this.input.value = autocomplete;
    this.input.setSelectionRange(inputText.length, autocomplete.length);
  }
};
