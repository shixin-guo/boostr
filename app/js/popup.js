import { waitForElement } from './utils.js';

const doConversion = () => {
  const idContainer = document.getElementById('idContainer');
  const id = idContainer.value?.replace(/\"/g, '') ?? '';
  
  if (id.length !== 15) return;

  let suffix = '';
  for (let i = 0; i < 3; i++) {
    let flags = 0;
    for (let j = 0; j < 5; j++) {
      const c = id.charAt(i * 5 + j);
      if (c >= 'A' && c <= 'Z') {
        flags += 1 << j;
      }
    }
    suffix += flags <= 25 
      ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(flags)
      : "012345".charAt(flags-26);
  }

  idContainer.value = id + suffix;
};

const init = async () => {
  const convertButton = await waitForElement('convertButton');
  convertButton.addEventListener('click', doConversion);

  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
    if (!tabs?.[0]?.url) return;

    const url = tabs[0].url.replace('https://', '');
    const urlParts = url.split('/');
    
    for (const part of urlParts) {
      if (part.length === 15 || part.length === 18) {
        const idContainer = document.getElementById('idContainer');
        if (idContainer) {
          idContainer.value = part;
          break;
        }
      }
    }
  });
};

init();
