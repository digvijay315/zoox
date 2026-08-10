const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerStaff,
  getStaff,
  deleteStaff,
  updateAdminPassword,
  updateStaffPermissions,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/auth");

router.post("/login", loginUser);
router.post("/register-staff", protect, admin, registerStaff);
router.get("/staff", protect, admin, getStaff);
router.delete("/staff/:id", protect, admin, deleteStaff);
router.put("/update-password", protect, admin, updateAdminPassword);
router.put("/update-staff-permissions", protect, admin, updateStaffPermissions);

module.exports = router;
