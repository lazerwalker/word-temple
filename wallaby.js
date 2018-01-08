module.exports = function(wallaby) {
  // Babel, jest-cli and some other modules may be located under
  // react-scripts/node_modules, so need to let node.js know about it
  var path = require("path");
  process.env.NODE_PATH +=
      path.delimiter +
      path.join(__dirname, "node_modules") +
      path.delimiter +
      path.join(__dirname, "node_modules/react-scripts/node_modules");
  require("module").Module._initPaths();

  return {
      files: [
          "src/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)",
          "!src/spec/**/*.spec.+(js|jsx|ts|tsx)"
      ],

      tests: ["src/spec/**/*.spec.+(js|jsx|ts|tsx)"],

      env: {
          type: "node",
          runner: "node"
      },

      compilers: {
          "**/*.js?(x)": wallaby.compilers.babel({
              babel: require("babel-core"),
              presets: ["react-app"]
          }),
          "**/*.ts?(x)": wallaby.compilers.typeScript({
              module: "commonjs",
              jsx: "React"
          })
      },

      setup: wallaby => {
          const jestConfig = require("react-scripts-ts/scripts/utils/createJestConfig")(
              p => require.resolve("react-scripts-ts/" + p)
          );
          delete jestConfig.transform["^.+\\.(js|jsx)$"];
          delete jestConfig.transform["^.+\\.(ts|tsx)$"];
          delete jestConfig.testEnvironment;
          wallaby.testFramework.configure(jestConfig);
      },

      testFramework: "jest"
  };
};