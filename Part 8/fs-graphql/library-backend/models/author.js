const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  born: {
    type: Number,
  },
  bookCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Author", schema);
