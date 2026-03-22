export const errorHandler = (err, req, res, next) =>{
  console.log("unhandled error", err);

  res.status(500).json({ error: err.message || "Internal server error"});
};