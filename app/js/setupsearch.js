import { initJQueryExtensions } from './scripts.js';

// Initialize jQuery extensions
initJQueryExtensions();

const handleLightningInput = (input) => {
  input.addEventListener('blur', event => {
    if (event.relatedTarget?.matches('body.desktop')) {
      setTimeout(() => {
        input.focus();
      });
    }
  });
};

const lightningInit = () => {
  const targetNode = document.documentElement;
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      mutation.addedNodes.forEach((node) => {
        if (node.matches?.('.tree-filter')) {
          const input = document.querySelector('input.filter-box');
          handleLightningInput(input);
          observer.disconnect();
        }
      });
    }
  });

  observer.observe(targetNode, config);
};

const init = () => {
  $(function() {
    if ($('div.quickfindContainer input#setupSearch').size() > 0) {
      $('div.quickfindContainer input#setupSearch').val(' ');
    } else {
      lightningInit();
    }
  });
};

// Initialize if enabled in settings
chrome.storage.sync.get({
  'setupsearch': true
}, (item) => {
  if (item.setupsearch === true) {
    init();
  }
});
