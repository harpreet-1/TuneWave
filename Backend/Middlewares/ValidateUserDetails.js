function ValidateUserDetails(req, res, next) {
  let { username, email, password } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({
      status: false,
      message:
        "Registration failed. Please provide required details " + !email
          ? "email not found"
          : !password
          ? "password not found"
          : "username not found",
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: false,
      message: "Please provide a valid email address",
    });
  }

  next();
}

const isValidEmail = (email) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};
module.exports = ValidateUserDetails;
