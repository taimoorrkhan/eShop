const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookie
  const cookieExpiresTime = parseInt(process.env.COOKIE_EXPIRES_TIME, 10);
  if (!isNaN(cookieExpiresTime) && cookieExpiresTime > 0) {
    const expirationDate = new Date(Date.now() + cookieExpiresTime * 24 * 60 * 60 * 1000);
    const options = {
      httpOnly: true,
      expires: expirationDate
    };

    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      token,
      user
    });
  } else {
    // Handle the case where COOKIE_EXPIRES_TIME is not a valid value.
    res.status(500).json({ success: false, message: 'Invalid cookie expiration time' });
  }

}

module.exports = sendToken;
