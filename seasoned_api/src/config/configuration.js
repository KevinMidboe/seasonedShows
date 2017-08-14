const path = require('path');
const Field = require('./field.js');

let instance = null;

class Config {
	constructor() {
		this.location = Config.determineLocation();
		this.fields = require(`${this.location}`);
	}

	static getInstance() {
		if (instance == null) {
			instance = new Config();
		}
		return instance;
	}

	static determineLocation() {
		return path.join(__dirname, '..', '..', process.env.SEASONED_CONFIG);
	}

	get(section, option) {
		if (this.fields[section] === undefined || this.fields[section][option] === undefined) {
			throw new Error(`Filed "${section} => ${option}" does not exist.`);
		}

		const field = new Field(this.fields[section][option])

		if (field.value === undefined) {
			throw new Error(`${section} => ${option} is empty.`);
		}

		return field.value;
	}
}

module.exports = Config;