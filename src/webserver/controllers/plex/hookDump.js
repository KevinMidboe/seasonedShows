function hookDumpController(req, res) {
  // eslint-disable-next-line no-console
  console.log("plex hook dump:", req);

  res.status(200);
}

module.exports = hookDumpController;
