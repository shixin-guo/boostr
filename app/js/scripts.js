// jQuery extensions for text matching
const initJQueryExtensions = () => {
  $.expr[':'].textEquals = $.expr.createPseudo((arg) => {
    return (elem) => $(elem).text().match("^" + arg + "$");
  });

  $.expr[":"].containsi = $.expr.createPseudo((arg) => {
    return (elem) => $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
  });
};

export { initJQueryExtensions };
