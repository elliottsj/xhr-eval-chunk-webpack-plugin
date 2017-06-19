const a = require('./a');

a();

require.ensure([], function(require) {
  const b = require('./b');

  b();
});
