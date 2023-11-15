let mongoose = require("mongoose");

let database = async () => {
  try {
    let connect = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      "Database Connected",
      mongoose.connection.name,
      mongoose.connection.host
    );
  } catch (error) {
    console.log("Error connecting to database :", error);
    process.exit(1);
  }
};

module.exports = database;
