class EnvironmentVariables {
   constructor(variables) {
      this.variables = variables || process.env;
   }

   get(variable) {
      return this.variables[variable];
   }

   has(variable) {
      return this.get(variable) !== undefined;
   }
}

module.exports = EnvironmentVariables;
