const obj = {
  name: 'Sample',
  description: 'This is a sample test',
  details: {
    info: 'This is some additional information',
    timestamp: new Date().toISOString(),
  },
};

describe('Sample', () => {
  it('should pass', () => {
    console.log('This should pass', obj);
    console.debug('Test stringify object', JSON.stringify(obj));
    console.debug('Test stringify(,null,2) obj', JSON.stringify(obj, null, 2));
    expect(1 + 1).toBe(2);
  });

  it('should fail', () => {
    console.log('This should fail', obj);
    console.debug('Test stringify object', JSON.stringify(obj));
    console.debug('Test stringify(,null,2) obj', JSON.stringify(obj, null, 2));
    expect(1 + 1).toBe(3);
  });

  it.skip('should skip', () => {
    console.log('This should be skipped', obj);
    console.debug('Test stringify object', JSON.stringify(obj));
    console.debug('Test stringify(,null,2) obj', JSON.stringify(obj, null, 2));
    expect(1 + 1).toBe(2);
  });

  it('should expect different object', () => {
    const expectedObj = {
      name: 'Sample',
      description: 'This is a sample test',
      details: {
        info: 'This is some additional information',
        date: new Date().toISOString(),
      },
    };
    console.log('This should expect different object', expectedObj);
    expect(obj).toEqual(expectedObj);
  });
});
