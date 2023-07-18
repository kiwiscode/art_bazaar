module.exports = (req, res, next) => {
  // checks if the user is logged in when trying to access a specific page
  if (!req.session.currentUser) {
    return res.redirect("/auth/login");
  }

  next();
};

// front end kısmından gelen console log
// POST /auth/logout 302 0.550 ms - 33
// GET /auth/login 304 5.346 ms - -

// back end kısmından gelen console log
// POST /auth/logout 302 8.901 ms - 46
// GET / 304 4.617 ms - -
