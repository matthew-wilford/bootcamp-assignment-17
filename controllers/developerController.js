const mongoose = require("mongoose");
const { Developer, Post } = require("../models");

const sendError = (res, error, fallbackMessage) => {
  if (error.code === 11000) {
    return res
      .status(400)
      .json({ success: false, message: "Username or email already exists" });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ success: false, message: error.message });
  }

  return res.status(500).json({ success: false, message: fallbackMessage });
};

const getDeveloper = async (developerId) => {
  if (!mongoose.isValidObjectId(developerId)) return null;

  return Developer.findById(developerId)
    .populate("posts")
    .populate("connections")
    .exec();
};

const getDevelopers = async (req, res) => {
  try {
    const developers = await Developer.find().sort({ username: 1 });
    return res.json({ success: true, data: developers });
  } catch (error) {
    return sendError(res, error, "Unable to retrieve developers");
  }
};

const getDeveloperById = async (req, res) => {
  try {
    const developer = await getDeveloper(req.params.developerId);
    if (!developer) {
      return res
        .status(404)
        .json({ success: false, message: "Developer not found" });
    }

    return res.json({ success: true, data: developer });
  } catch (error) {
    return sendError(res, error, "Unable to retrieve developer");
  }
};

const createDeveloper = async (req, res) => {
  try {
    const developer = await Developer.create(req.body);
    return res.status(201).json({ success: true, data: developer });
  } catch (error) {
    return sendError(res, error, "Unable to create developer");
  }
};

const updateDeveloper = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.developerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid developer id" });
    }

    const developer = await Developer.findByIdAndUpdate(
      req.params.developerId,
      req.body,
      { new: true, runValidators: true },
    );

    if (!developer) {
      return res
        .status(404)
        .json({ success: false, message: "Developer not found" });
    }

    return res.json({ success: true, data: developer });
  } catch (error) {
    return sendError(res, error, "Unable to update developer");
  }
};

const deleteDeveloper = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.developerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid developer id" });
    }

    const developer = await Developer.findByIdAndDelete(req.params.developerId);
    if (!developer) {
      return res
        .status(404)
        .json({ success: false, message: "Developer not found" });
    }

    await Post.deleteMany({ _id: { $in: developer.posts } });
    await Developer.updateMany(
      { connections: developer._id },
      { $pull: { connections: developer._id } },
    );

    return res.json({ success: true, data: developer });
  } catch (error) {
    return sendError(res, error, "Unable to delete developer");
  }
};

const addConnection = async (req, res) => {
  try {
    const { developerId, connectionId } = req.params;
    if (
      !mongoose.isValidObjectId(developerId) ||
      !mongoose.isValidObjectId(connectionId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid developer id" });
    }
    if (developerId === connectionId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "A developer cannot connect with themselves",
        });
    }

    const [developer, connection] = await Promise.all([
      Developer.findById(developerId),
      Developer.findById(connectionId),
    ]);

    if (!developer || !connection) {
      return res
        .status(404)
        .json({ success: false, message: "Developer not found" });
    }

    if (!developer.connections.some((id) => id.equals(connection._id))) {
      developer.connections.push(connection._id);
      await developer.save();
    }

    return res.json({ success: true, data: developer });
  } catch (error) {
    return sendError(res, error, "Unable to add connection");
  }
};

const removeConnection = async (req, res) => {
  try {
    const { developerId, connectionId } = req.params;
    if (
      !mongoose.isValidObjectId(developerId) ||
      !mongoose.isValidObjectId(connectionId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid developer id" });
    }

    const developer = await Developer.findByIdAndUpdate(
      developerId,
      { $pull: { connections: connectionId } },
      { new: true },
    );

    if (!developer) {
      return res
        .status(404)
        .json({ success: false, message: "Developer not found" });
    }

    return res.json({ success: true, data: developer });
  } catch (error) {
    return sendError(res, error, "Unable to remove connection");
  }
};

module.exports = {
  getDevelopers,
  getDeveloperById,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  addConnection,
  removeConnection,
};
