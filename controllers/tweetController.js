import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";

// Create a new tweet
export const createTweet = async (req, res) => {
  try {
    const { description, id } = req.body;

    // Basic validation
    if (!description || !id) {
      return res.status(400).json({
        message: "Fields are required.",
        success: false,
      });
    }

    // Find the user by id
    const user = await User.findById(id).select("-password");

    // Create a new tweet
    await Tweet.create({ description, userId: id, userDetails: user });

    return res.status(201).json({
      message: "Tweet created successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Delete a tweet
export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the tweet by id
    await Tweet.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Tweet deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Like or dislike a tweet
export const likeOrDislike = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const tweetId = req.params.id;

    // Find the tweet by id
    const tweet = await Tweet.findById(tweetId);

    if (tweet.like.includes(loggedInUserId)) {
      // Dislike the tweet
      await Tweet.findByIdAndUpdate(tweetId, {
        $pull: { like: loggedInUserId },
      });
      return res.status(200).json({
        message: "User disliked your tweet.",
        success: true,
      });
    } else {
      // Like the tweet
      await Tweet.findByIdAndUpdate(tweetId, {
        $push: { like: loggedInUserId },
      });
      return res.status(200).json({
        message: "User liked your tweet.",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Get all tweets (user's own tweets and tweets from followed users)
export const getAllTweets = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the logged-in user by id
    const loggedInUser = await User.findById(id);

    // Get logged-in user's tweets
    const loggedInUserTweets = await Tweet.find({ userId: id });

    // Get tweets from users followed by the logged-in user
    const followingUserTweets = await Promise.all(
      loggedInUser.following.map((otherUserId) =>
        Tweet.find({ userId: otherUserId })
      )
    );

    return res.status(200).json({
      tweets: loggedInUserTweets.concat(...followingUserTweets),
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Get tweets from users followed by the logged-in user
export const getFollowingTweets = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the logged-in user by id
    const loggedInUser = await User.findById(id);

    // Get tweets from users followed by the logged-in user
    const followingUserTweets = await Promise.all(
      loggedInUser.following.map((otherUserId) =>
        Tweet.find({ userId: otherUserId })
      )
    );

    return res.status(200).json({
      tweets: [].concat(...followingUserTweets),
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};
