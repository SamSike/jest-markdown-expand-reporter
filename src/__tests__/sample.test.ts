describe('Sample', () => {
  it('should pass', () => {
    console.log('This should pass');
    expect(1 + 1).toBe(2);
  });

  it('should fail', () => {
    console.log('This should fail');
    console.debug('This should fail');
    expect(1 + 1).toBe(3);
  });

  it.skip('should skip', () => {
    console.log('This should be skipped');
    expect(1 + 1).toBe(2);
  });
});
