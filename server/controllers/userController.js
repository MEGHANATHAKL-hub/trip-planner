import User from '../models/User.js';
import TripPlan from '../models/TripPlan.js';

// Admin-only: Get all users
export const getUsers = async (req, res) => {
  try {
    // This endpoint now requires admin middleware
    const { search, limit = 20, skip = 0 } = req.query;
    
    let query = {};
    
    // Add search functionality
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get users with trip statistics
    const users = await User.find(query)
      .select('-password') // Exclude password
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    // Get trip statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const tripCount = await TripPlan.countDocuments({ userId: user._id });
        const collaborationCount = await TripPlan.countDocuments({ 
          collaborators: user._id 
        });
        
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profilePhoto: user.profilePhoto,
          createdAt: user.createdAt,
          stats: {
            tripsCreated: tripCount,
            collaborations: collaborationCount,
            totalTrips: tripCount + collaborationCount
          }
        };
      })
    );

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);

    res.json({
      users: usersWithStats,
      pagination: {
        total: totalUsers,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(totalUsers / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's trips
    const userTrips = await TripPlan.find({ userId: user._id })
      .populate('collaborators', 'username')
      .sort({ createdAt: -1 })
      .limit(5); // Latest 5 trips

    // Get trips where user is a collaborator
    const collaboratedTrips = await TripPlan.find({ collaborators: user._id })
      .populate('userId', 'username')
      .populate('collaborators', 'username')
      .sort({ createdAt: -1 })
      .limit(5); // Latest 5 collaborations

    // Calculate statistics
    const stats = {
      tripsCreated: await TripPlan.countDocuments({ userId: user._id }),
      collaborations: await TripPlan.countDocuments({ collaborators: user._id }),
      joinedDate: user.createdAt
    };

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt
      },
      stats,
      recentTrips: userTrips,
      recentCollaborations: collaboratedTrips
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      username: { $regex: q, $options: 'i' }
    })
    .select('username email profilePhoto')
    .limit(10)
    .sort({ username: 1 });

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin-only: Update user role (promote/demote admin)
export const updateUserRole = async (req, res) => {
  try {
    console.log('updateUserRole called with:', { userId: req.params.userId, body: req.body, user: req.user });
    
    const { userId } = req.params;
    const { role } = req.body;
    
    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      console.log('Invalid role validation failed:', role);
      return res.status(400).json({ 
        message: 'Invalid role. Must be either "user" or "admin"' 
      });
    }
    
    // Prevent admin from changing their own role
    if (req.user._id.toString() === userId) {
      console.log('Self-role change prevented:', req.user._id.toString(), userId);
      return res.status(400).json({ 
        message: 'You cannot change your own admin status' 
      });
    }
    
    // Find the user to update
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Current user role:', userToUpdate.role, 'New role:', role);
    
    // Update the user's role
    userToUpdate.role = role;
    const savedUser = await userToUpdate.save();
    
    console.log('User role updated successfully:', savedUser.role);
    
    res.json({ 
      message: `User ${userToUpdate.username} has been ${role === 'admin' ? 'promoted to admin' : 'demoted to user'}`,
      user: {
        _id: userToUpdate._id,
        username: userToUpdate.username,
        email: userToUpdate.email,
        role: userToUpdate.role
      }
    });
    
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error while updating user role', error: error.message });
  }
};

// Admin-only: Update user password
export const updateUserPassword = async (req, res) => {
  try {
    console.log('updateUserPassword called with:', { userId: req.params.userId, user: req.user });
    
    const { userId } = req.params;
    const { password } = req.body;
    
    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Find the user to update
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Updating password for user:', userToUpdate.username);
    
    // Update the user's password (let the pre-save hook handle hashing)
    userToUpdate.password = password;
    await userToUpdate.save();
    
    console.log('Password updated successfully for user:', userToUpdate.username);
    
    res.json({ 
      message: `Password updated successfully for user ${userToUpdate.username}`,
      user: {
        _id: userToUpdate._id,
        username: userToUpdate.username,
        email: userToUpdate.email,
        role: userToUpdate.role
      }
    });
    
  } catch (error) {
    console.error('Update user password error:', error);
    res.status(500).json({ message: 'Server error while updating user password', error: error.message });
  }
};

// Admin-only: Delete user account
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent admin from deleting themselves
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ 
        message: 'You cannot delete your own admin account' 
      });
    }
    
    // Find the user to delete
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting other admin accounts
    if (userToDelete.role === 'admin') {
      return res.status(403).json({ 
        message: 'Cannot delete other admin accounts' 
      });
    }
    
    // Get user's trips to handle cleanup
    const userTrips = await TripPlan.find({ userId: userId });
    const collaborationTrips = await TripPlan.find({ collaborators: userId });
    
    // Remove user from collaborator lists
    await TripPlan.updateMany(
      { collaborators: userId },
      { $pull: { collaborators: userId } }
    );
    
    // Delete user's own trips
    await TripPlan.deleteMany({ userId: userId });
    
    // Delete the user account
    await User.findByIdAndDelete(userId);
    
    res.json({ 
      message: 'User account deleted successfully',
      deletedData: {
        username: userToDelete.username,
        tripsDeleted: userTrips.length,
        collaborationsRemoved: collaborationTrips.length
      }
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};