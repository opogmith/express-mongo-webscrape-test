const ResponseFormatter = (req, res, next) => {
  res._200 = (data, message = "Success") => {
    res.status(200).json({
      message,
      data,
    });
  };

  res._400 = (message = "Bad Request") => {
    res.status(400).json({
      message,
    });
  };

  res._401 = (message = "Unauthorized") => {
    res.status(401).json({ message });
  };

  res._404 = (message = "Not found") => {
    res.status(404).json({ message });
  };

  res._500 = (message = "Server Error") => {
    res.status(500).json({ message });
  };

  next();
};

module.exports = ResponseFormatter;
