const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 300,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => date.toISOString(),
    },
    authorUsername: {
      type: String,
      required: true,
      trim: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  },
);

postSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

module.exports = model("Post", postSchema);
