import { initJQueryExtensions } from './scripts.js';

// Initialize jQuery extensions
initJQueryExtensions();

let numAllowedFields = 20;

const getMessage = () => {
  return `(${$('#ep table.detailList td.dataCol [type="checkbox"]:checked').length} of ${numAllowedFields} selected)`;
};

const updateCount = () => {
  const selectedMessage = getMessage();
  $('td[id$="ButtonRow"] span.bfs-history-count').each((i, el) => {
    $(el).text(selectedMessage);
  });
};

const init = async () => {
  const { fieldhistorynumallowedfields } = await chrome.storage.sync.get({
    fieldhistorynumallowedfields: 20
  });

  if (fieldhistorynumallowedfields) {
    numAllowedFields = fieldhistorynumallowedfields;
  }

  $('#ep td[id$="ButtonRow"]').each((i, el) => {
    $(el).append(`<span class="bfs-history-count">${getMessage()}</span>`);
  });

  $('#ep table.detailList td.dataCol [type="checkbox"]').change(updateCount);
  $('#ep table.detailList tr.last.detailRow a').click(() => {
    setTimeout(updateCount, 100);
  });
};

init();
