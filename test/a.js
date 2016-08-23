console.info('a loaded');
module.exports = function () {
  console.info('a function');
  window.isALoaded = true;
};
