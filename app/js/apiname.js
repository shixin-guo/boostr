import { initJQueryExtensions } from './scripts.js';

// Initialize jQuery extensions
initJQueryExtensions();

const setDeveloperName = (sourceElement, targetElement, defaultValue) => {
  const sourceValue = sourceElement.value;
  if (!targetElement || targetElement.value.length > 0 || !sourceValue) {
    return true;
  }

  let result = '';
  let hasValidChar = false;
  let lastWasUnderscore = false;

  for (let i = 0; i < sourceValue.length; i++) {
    const char = sourceValue.charAt(i);
    const isAlphaNumeric = /[a-zA-Z0-9]/.test(char);

    if (isAlphaNumeric) {
      if (!hasValidChar && /[0-9]/.test(char)) {
        result += 'X';
      }
      result += char;
      hasValidChar = true;
      lastWasUnderscore = false;
    } else if (hasValidChar && !lastWasUnderscore) {
      result += '_';
      lastWasUnderscore = true;
    }
  }

  if (hasValidChar) {
    if (targetElement.maxLength > 0) {
      result = result.substr(0, targetElement.maxLength);
    }
    targetElement.value = lastWasUnderscore ? result.slice(0, -1) : result;
  } else {
    targetElement.value = defaultValue;
  }

  return true;
};

const init = () => {
  const masterLabel = $('input#MasterLabel');
  const developerName = $('input#DeveloperName');
  const name = $('input#Name');

  if (masterLabel.size() === 0 ||
      (developerName.size() === 0 && name.size() === 0) ||
      (developerName.size() > 0 && developerName.is(':disabled')) ||
      (name.size() > 0 && name.is(':disabled'))) {
    return;
  }

  masterLabel.blur(function() {
    if (developerName.size() === 1) {
      setDeveloperName(this, document.getElementById('DeveloperName'), 'Field1');
      const val = developerName.val();
      developerName.val(val.replace(/_/g, ''));
    } else if (name.size() === 1) {
      setDeveloperName(this, document.getElementById('Name'), 'Field1');
      const val = name.val();
      name.val(val.replace(/ /g, ''));
    }
  });
};

// Initialize if enabled in settings
chrome.storage.sync.get({
  'apiname': false
}, (item) => {
  if (item.apiname === true) {
    init();
  }
});
