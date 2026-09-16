const { Schema, model } = require("mongoose");

const developerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    headline: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    connections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Developer",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

developerSchema.virtual("connectionCount").get(function () {
  return this.connections.length;
});

developerSchema.virtual("postCount").get(function () {
  return this.posts.length;
});

module.exports = model("Developer", developerSchema);
