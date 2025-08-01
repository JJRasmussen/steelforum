export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!\\.prisma/client/)'],
    roots: ['<rootDir>/tests'],
};
