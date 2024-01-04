"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const utils_1 = require("../app/utils");
(0, vitest_1.describe)('Util Test suite', () => {
    (0, vitest_1.it)('should return upperCase', () => {
        //arrange
        let phrase = 'abc';
        //act
        phrase = (0, utils_1.toUpperCase)(phrase);
        //assert
        (0, vitest_1.expect)(phrase).toBe('ABC');
    });
});
