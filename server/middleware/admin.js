// Admin middleware to check if user has admin privileges

export const requireAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Admin access required. Only administrators can perform this action.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error in admin verification' });
  }
};

// Middleware to check if user is admin or accessing their own data
export const requireAdminOrSelf = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const isAdmin = req.user.role === 'admin';
    const isAccessingOwnData = req.user._id.toString() === req.params.userId;

    if (!isAdmin && !isAccessingOwnData) {
      return res.status(403).json({ 
        message: 'Access denied. You can only access your own data or need admin privileges.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin or self middleware error:', error);
    res.status(500).json({ message: 'Server error in permission verification' });
  }
};