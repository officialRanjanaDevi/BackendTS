function protectedRoute(request, response) {
  // You can access the decoded token from the request object
  const decodedToken = request.decodedToken;

  if (decodedToken) {
    // User is authenticated, proceed with the protected route logic
    response.status(200).json({ message: `Hello, ${decodedToken.username}! This is a protected route.` });
  } else {
    // User is not authenticated
    response.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { protectedRoute };
