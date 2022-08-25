class Filters {
  constructor(value) {
    this.value = value;
    this.delimiter = "|";
  }

  get filters() {
    return this.value.split(this.delimiter).slice(0, -1);
  }

  isEmpty() {
    return !this.hasValidType() || this.value.length === 0;
  }

  has(filter) {
    return this.filters.includes(filter);
  }

  hasValidType() {
    return typeof this.value === "string";
  }

  removeFiltersFromValue() {
    if (this.hasValidType() === false) {
      return this.value;
    }

    let filtersCombined = this.filters.join(this.delimiter);
    filtersCombined += this.filters.length >= 1 ? this.delimiter : "";
    return this.value.replace(filtersCombined, "");
  }
}

export default Filters;
