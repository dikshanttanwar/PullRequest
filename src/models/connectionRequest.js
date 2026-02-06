const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //Reference to the User Schema
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", //Reference to the User Schema
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "rejected", "accepted"],
        message: `{VALUE} : incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  },
);

ConnectionRequestSchema.index({ fromUserID: 1, toUserID: 1 });

ConnectionRequestSchema.index({ toUserID: 1 });

ConnectionRequestSchema.pre("save", function () {
  if (this.fromUserID.equals(this.toUserID)) {
    throw new Error("You cannot send a connection request to yourself!");
  }
});

const requestConnection = new mongoose.model(
  "requestConnection",
  ConnectionRequestSchema,
);

module.exports = requestConnection;
