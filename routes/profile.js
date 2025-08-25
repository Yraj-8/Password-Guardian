const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");
const User = require("../models/User");

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email createdAt");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      username: user.username,
      email: user.email,
      joined: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
