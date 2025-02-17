export const waitForElement = (elementId) => {
  return new Promise((resolve) => {
    const element = document.getElementById(elementId);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = document.getElementById(elementId);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
};
