const User = require("../Models/user");
const cloudinaryUpload = require("../config/cloudinary");

module.exports.logoutController=(req, res) => {
    res.clearCookie("accessToken", { httpOnly: true });
    res.status(200).json({ message: "Logged out successfully" });
};

module.exports.signInController =async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Email not found" });

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch)
            return res.status(401).json({ message: "Invalid password" });

        const accessToken = await user.generateAccessToken();
        return res
            .status(200)
            .cookie("accessToken", accessToken, { httpOnly: true,sameSite:"false",secure:true })
            .json({
                accessToken,
                message: "Login successful",
                user: {
                    _id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    profilePic: user.profilePic,
                },
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.onBoardingController =async (req, res) => {
    try {
        const { userId, fullName, username, bio } = req.body;

        if (!userId) return res.status(400).json({ message: "Missing userId" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check username uniqueness (skip the temp one we set)
        const taken = await User.findOne({
            username,
            _id: { $ne: userId },
        });
        if (taken)
            return res.status(409).json({ message: "Username already taken" });

        user.fullName = fullName;
        user.username = username;
        user.bio = bio || "";

        if (req.file) {
            const { url, secure_url } = await cloudinaryUpload(req.file.path);
            user.profilePic = url || secure_url;
        }

        await user.save();

        // Auto-login: generate token and set cookie
        const accessToken = await user.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, { httpOnly: true,sameSite:"false",secure:true    })
            .json({
                accessToken,
                message: "Profile setup complete",
                user: {
                    _id: user._id,
                    username: user.username,
                    fullName: user.fullName,
                    profilePic: user.profilePic,
                },
            });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.signUpController=async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: "Email already registered" });

        // Create user with a temporary placeholder username
        // (will be updated in /onboarding)
        const tempUsername = "user_" + Date.now();
        const newUser = await User.create({
            email,
            password,
            username: tempUsername,
        });

        res.status(201).json({
            message: "Account created. Proceed to onboarding.",
            userId: newUser._id,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};