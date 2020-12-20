import { assert, expect, should } from 'chai';

should();

describe('dummy spec', () => {
  it('test one', () => {
    (2 + 2).should.be.equal(4);
  });
  it('test two', () => {
    expect(2 + 2).to.be.equal(4);
  });
  it('test three', () => {
    assert.typeOf(2 + 2, 'number');
  });
});
