const tsNode = require('ts-node');
// needed for taking the test tsconfig.json into consideration for the tests
tsNode.register({
    files: true,
    transpileOnly: true,
    project: './test/tsconfig.json'
});
