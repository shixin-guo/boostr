import { waitForElement } from './utils.js';

const saveOptions = async () => {
  const options = {
    changeset: document.getElementById('changeset').checked,
    fieldset: document.getElementById('fieldset').checked,
    setupsearch: document.getElementById('setupsearch').checked,
    apiname: document.getElementById('apiname').checked,
    setupcheckall: document.getElementById('setupcheckall').checked,
    layoutuncheckall: document.getElementById('layoutuncheckall').checked,
    selectfailedtests: document.getElementById('selectfailedtests').checked,
    fieldhistorynumallowedfields: document.getElementById('fieldhistorynumallowedfields').value
  };

  await chrome.storage.sync.set(options);
  
  const status = document.getElementById('status');
  status.style.display = 'block';
  setTimeout(() => {
    status.style.display = 'none';
  }, 2000);
};

const restoreOptions = async () => {
  const defaults = {
    changeset: true,
    fieldset: true,
    setupsearch: true,
    apiname: false,
    setupcheckall: true,
    layoutuncheckall: false,
    selectfailedtests: true,
    fieldhistorynumallowedfields: 20
  };

  const items = await chrome.storage.sync.get(defaults);
  
  Object.entries(items).forEach(([key, value]) => {
    const element = document.getElementById(key);
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = value;
      } else {
        element.value = value;
      }
    }
  });
};

// Initialize options and event listeners
const init = async () => {
  await restoreOptions();
  const saveButton = await waitForElement('save');
  saveButton.addEventListener('click', saveOptions);
};

document.addEventListener('DOMContentLoaded', init);

// Keep jQuery modal functionality
$(function() {
  $('a.modalLink').click((e) => e.preventDefault());
});
