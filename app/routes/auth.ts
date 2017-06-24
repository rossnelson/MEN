export = function(App) {
  const app = new App();

  App.Server.get('/auth/token', (req, res) => {
    res.send({ token: app.get('Actors.Helper')() });
  });

}
