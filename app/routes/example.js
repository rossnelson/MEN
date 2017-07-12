module.exports = function(App) {
  const app = new App();

  App.Server.get('/example/route', (req, res) => {
    res.send({ token: app.get('Actors.Helper')() });
  });

}
