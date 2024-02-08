
export const checkRole = (roles) => {
    return (req, res, next) => {
      try {
        if (roles.includes(req.user.role)) {
          next();
        } else {
          return res
            .status(500)
            .send("Access denied. You have no permission to do that!");
        }
      } catch {
        return res.status(404).json({
          error: 404,
          message: "Not authorized",
        });
      }
    };
  };