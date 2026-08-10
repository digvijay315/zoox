const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Get permissions from admin user if current user is staff
      let permissions = user.staffPermissions;
      if (user.role === 'staff') {
        const adminUser = await User.findOne({ role: 'admin' });
        if (adminUser) {
          permissions = adminUser.staffPermissions;
        }
      }

      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          hotelName: 'Zoox (A unit of The Grand Portico)',
          hotelEmail: 'info@grandportico.in',
          hotelContact: '+91 62993 82018',
          hotelAddress: 'Plot No. 316, Rampur, Dumka Rampurhat Road, Dumka - 814119, Jharkhand',
          hotelLogo: '',
          hotelGstNo: '',
          hotelCinNo: '',
          staffPermissions: permissions || {
            restaurant: true,
            roomBooking: true,
            kot: true,
            advanceBooking: true,
            grc: true
          },
          subscriptionPlan: 'premium',
          subscriptionStatus: 'active',
          subscriptionExpiresAt: null,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new staff member
// @route   POST /api/auth/register-staff
// @access  Private/Admin
const registerStaff = async (req, res) => {
  const { name, email, password, mobile, age, address } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'Staff with this email already exists' });
    }

    const staff = await User.create({
      name,
      email,
      password,
      role: 'staff',
      mobile,
      age,
      address,
    });

    if (staff) {
      res.status(201).json({
        success: true,
        message: 'Staff member registered successfully',
        staff: {
          _id: staff._id,
          name: staff.name,
          email: staff.email,
          mobile: staff.mobile,
          age: staff.age,
          address: staff.address,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid staff data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all staff members
// @route   GET /api/auth/staff
// @access  Private/Admin
const getStaff = async (req, res) => {
  try {
    const staffMembers = await User.find({ role: 'staff' }).select('-password');
    res.json({ success: true, staff: staffMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/auth/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);

    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ success: false, message: 'Staff member not found or unauthorized' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/update-password
// @access  Private/Admin
const updateAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ success: true, message: 'Password updated successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update staff permissions
// @route   PUT /api/auth/update-staff-permissions
// @access  Private/Admin
const updateStaffPermissions = async (req, res) => {
  const { permissions } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user && user.role === 'admin') {
      user.staffPermissions = permissions;
      await user.save();
      res.json({ success: true, message: 'Permissions updated successfully', staffPermissions: user.staffPermissions });
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  loginUser,
  registerStaff,
  getStaff,
  deleteStaff,
  updateAdminPassword,
  updateStaffPermissions,
};
