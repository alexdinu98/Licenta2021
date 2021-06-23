"use strict";
const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(
      "mongodb+srv://alexdinu98:Azsxdcfvgb1@licenta.x0rth.gcp.mongodb.net/uploads?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
      }
    )
    .then(() => console.log("Connected to Mongodb......"));
};
