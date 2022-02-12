const { describe, it } = require('mocha');
const { expect } = require('chai');

const { getRandomIndexFromArray } = require('./utils');

describe('Utils Suite Unit Tests', () => {
  describe('getRandomIndexFromArray()', () => {
    it('should retrieve a random index from an array', () => {
      const data = [0, 1, 2, 3, 4];
      const result = getRandomIndexFromArray(data);
  
      expect(result).to.be.lte(data.length).and.be.gte(0);
    });
  });
});
