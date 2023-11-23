function getcookie(req) {
  var cookie = req.headers.cookie;
  return cookie.split("; ");
}

module.exports = { getcookie };
