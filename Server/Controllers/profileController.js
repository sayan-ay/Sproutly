const User=require('../models/user');
const Follow=require('../models/follow');


module.exports.profileFetcher=async (req, res) => {
    try {
        const user = await User.findById(req.params.userid)
            .select("-password -email")
            .lean();
        if (!user) return res.status(404).json({ error: "No such user found" });

        // const followers = await Follow.find({
        //   authorFollowed: user._id,
        // });
        // const followingCount = await Follow.countDocuments({ follower: user._id });

        const [followersObjectArray, followingCount] = await Promise.all([
            Follow.find({ authorFollowed: user._id }).select("follower -_id"),
            Follow.countDocuments({ follower: user._id }),
        ]);

        user.followers = followersObjectArray.map(
            (followerObject) => followerObject.follower,
        );
        user.followingCount = followingCount;

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};