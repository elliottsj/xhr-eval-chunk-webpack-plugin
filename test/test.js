describe('xhr-eval-chunk-webpack-plugin', function() {
  it('should load chunks successfully', function() {
    expect(window.isALoaded).toBe(true);
    expect(window.isBLoaded).toBe(true);
  });
});
