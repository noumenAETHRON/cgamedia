(function () {
  var modes = ['ninos', 'estudiantes', 'padres', 'abuelos', 'todos'];
  var mode = 'todos';
  try {
    var saved = localStorage.getItem('cga-audience');
    if (modes.indexOf(saved) !== -1) mode = saved;
  } catch (error) {
    mode = 'todos';
  }
  document.documentElement.dataset.audience = mode;
})();
