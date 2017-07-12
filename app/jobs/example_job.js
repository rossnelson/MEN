const App = include('vendor/core');
const JobBase = App.JobBase;

module.exports = class ExampleJob extends JobBase {

  perform(job, done) {
    const Builder = App.get('Builders.ExampleBuilder');
    Builder.create({ example: job.data })
    .then(() => done());
  }

}

// usage
//
// const ExampleJob = App.get('Jobs.ExampleJob')
// ExampleJob.set({ delay: 5000, attempts: 5 }, { me: 32 }).perform_later();

// or just

// ExampleJob.perform_later({ me: 32 });
