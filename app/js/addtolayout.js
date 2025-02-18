import { initJQueryExtensions } from './scripts.js';

// Initialize jQuery extensions
initJQueryExtensions();

const init = () => {
  $(function() {
    $('div.listRelatedObject table.list tr.headerRow th.actionColumn input:checkbox').click();
  });
};

// Initialize if enabled in settings
chrome.storage.sync.get({
  'layoutuncheckall': false
}, (item) => {
  if (item.layoutuncheckall === true) {
    if ($('div.pbWizardTitle h2:contains("Add to page layouts")').size() > 0) {
      init();
    }
  }
});
