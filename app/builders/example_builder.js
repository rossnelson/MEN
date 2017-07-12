const App = include('vendor/core');

module.exports = class ExampleBuilder {
  static create(data) {
    const obj = new this(data);

    return createModel.call(obj)
    .then(assignData.bind(obj))
    .then(() => obj.data)
  }

  constructor(data) {
    this.data = data;
  }
}

function createModel() {
  const Example = App.get('Models.ExampleModel');
  return Example.create(this.data.example);
}

function assignData() {
  this.data.answer = 42;
}
