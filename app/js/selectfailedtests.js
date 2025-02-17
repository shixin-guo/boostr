import { initJQueryExtensions } from './scripts.js';

// Initialize jQuery extensions
initJQueryExtensions();

const waitForElement = (elementPath, callback) => {
  window.setTimeout(() => {
    if ($(elementPath).length) {
      callback(elementPath, $(elementPath));
    } else {
      waitForElement(elementPath, callback);
    }
  }, 250);
};

const checkFailedTests = () => {
  const failedTests = document.querySelector(".x-grid-group")
    .querySelectorAll("img.Failed");
  const failedTestMap = {};

  for (const failedTest of failedTests) {
    let row = failedTest;
    while (row.nodeName !== "TR") {
      row = row.parentNode;
    }
    failedTestMap[row.querySelector("a").nextSibling.textContent.trim()] = true;
  }

  const unselectedRows = document.querySelectorAll(
    "#testOverlay .x-grid3-row:not(.x-grid3-row-selected)"
  );

  for (const row of unselectedRows) {
    const cells = row.querySelectorAll("td");
    if (failedTestMap[cells[1].textContent]) {
      const event = new MouseEvent("mousedown", { bubbles: true });
      cells[0].querySelector(".x-grid3-row-checker").dispatchEvent(event);
    }
  }
};

const init = () => {
  const selectTestsButtonEl = document.getElementById("SelectTestsButton");
  const selectFailedButtonEl = document.createElement("input");
  
  Object.assign(selectFailedButtonEl, {
    type: "button",
    className: "btn",
    value: "Select Failed Tests...",
    style: "margin-left: 8px;",
    onclick: () => {
      selectTestsButtonEl.click();
      waitForElement("#testListGrid", () => checkFailedTests());
    }
  });

  selectTestsButtonEl.parentNode.insertBefore(
    selectFailedButtonEl,
    selectTestsButtonEl.nextSibling
  );
};

// Initialize if enabled in settings
chrome.storage.sync.get({
  'selectfailedtests': true
}, (item) => {
  if (item.selectfailedtests === true) {
    init();
  }
});
