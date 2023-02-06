export function errorHandler(error, req, res) {
  res.status(500);
  res.render('error', { error });
}
