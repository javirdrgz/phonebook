const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

url = process.env.MONGODB_URI;

console.log("connecting to database");

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to MongoDB"))
  .catch((error) =>
    console.log("failed to connect to database", error.message)
  );

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
  },
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
