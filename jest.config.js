/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    roots: ['<rootDir>/'],
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    transform: {
        '^.+\\.(ts|js|html)$': 'ts-jest',
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    moduleFileExtensions: ['ts', 'js', 'html'],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths || {}, {
            prefix: '<rootDir>/src/',
        }), // add customs paths
    },
};
