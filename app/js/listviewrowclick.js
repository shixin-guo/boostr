import { initJQueryExtensions } from './scripts.js';

// Initialize jQuery extensions
initJQueryExtensions();

const clickCheckboxFunction = (e) => {
  if (!$(e.target).is('input:checkbox')) {
    $(e.target).closest('tr').find('input:checkbox:first').click();
  }
};

const addClassicRowOnClickCheckBoxEventHandler = () => {
  // Setup Listview Rows
  $('tr.dataRow').has('td:first-child input[type="checkbox"]')
    .on('click', clickCheckboxFunction);

  // Object Listview Rows
  $('table.x-grid3-row-table tr').has('td:first-child input[type="checkbox"]')
    .on('click', clickCheckboxFunction);
};

const addRowOnClickCheckboxEventHandlerWhenListViewRowsAdded = (mutations) => {
  for (const mutation of mutations) {
    if (!mutation.addedNodes?.length) continue;

    for (const node of mutation.addedNodes) {
      if (node.className?.includes?.('x-grid3-row') ||
          node.className?.includes?.('dataRow') ||
          node.className?.includes?.('x-grid3-row-table')) {
        addClassicRowOnClickCheckBoxEventHandler();
        return;
      }
    }
  }
};

const addClassicMutationObserver = () => {
  const observer = new MutationObserver(
    addRowOnClickCheckboxEventHandlerWhenListViewRowsAdded
  );

  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
    attributeOldValue: false,
    characterDataOldValue: false
  });
};

const initOnCheckboxRowClickHandlers = () => {
  const someLightningElement = document.getElementById('auraAppcacheProgress');

  if (!someLightningElement) {
    // Use mutation observer for listviews dynamically added via AJAX.
    // Supposedly, .on('click'...) should work with dynamically added content
    // but it's not working here so mutation observer used instead.
    addClassicMutationObserver();

    // For setup list views that are added directly to the page and not
    // through AJAX.
    addClassicRowOnClickCheckBoxEventHandler();
  }
};

initOnCheckboxRowClickHandlers();
