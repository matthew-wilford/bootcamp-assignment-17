const mongoose = require("mongoose");
const { Developer, Post } = require("../models");

const sendError = (res, error, fallbackMessage) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ success: false, message: error.message });
  }

  return res.status(500).json({ success: false, message: fallbackMessage });
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: posts });
  } catch (error) {
    return sendError(res, error, "Unable to retrieve posts");
  }
};

const getPostById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.postId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post id" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    return res.json({ success: true, data: post });
  } catch (error) {
    return sendError(res, error, "Unable to retrieve post");
  }
};

const createPost = async (req, res) => {
  try {
    const { developerId, ...postData } = req.body;
    if (!mongoose.isValidObjectId(developerId)) {
      return res
        .status(400)
        .json({ success: false, message: "A valid developerId is required" });
    }

    const developer = await Developer.findById(developerId);
    if (!developer) {
      return res
        .status(404)
        .json({ success: false, message: "Developer not found" });
    }

    const post = await Post.create(postData);
    developer.posts.push(post._id);
    await developer.save();

    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    return sendError(res, error, "Unable to create post");
  }
};

const updatePost = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.postId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post id" });
    }

    const post = await Post.findByIdAndUpdate(req.params.postId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    return res.json({ success: true, data: post });
  } catch (error) {
    return sendError(res, error, "Unable to update post");
  }
};

const deletePost = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.postId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post id" });
    }

    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    await Developer.updateMany(
      { posts: post._id },
      { $pull: { posts: post._id } },
    );

    return res.json({ success: true, data: post });
  } catch (error) {
    return sendError(res, error, "Unable to delete post");
  }
};

const addReaction = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.postId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post id" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    post.reactions.push(req.body);
    await post.save();
    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    return sendError(res, error, "Unable to add reaction");
  }
};

const removeReaction = async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.postId) ||
      !mongoose.isValidObjectId(req.params.reactionId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid post or reaction id" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const originalCount = post.reactions.length;
    post.reactions = post.reactions.filter(
      (reaction) => !reaction.reactionId.equals(req.params.reactionId),
    );

    if (post.reactions.length === originalCount) {
      return res
        .status(404)
        .json({ success: false, message: "Reaction not found" });
    }

    await post.save();
    return res.json({ success: true, data: post });
  } catch (error) {
    return sendError(res, error, "Unable to remove reaction");
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addReaction,
  removeReaction,
};
