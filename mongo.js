const mongoose = require("mongoose");

const args = process.argv;

if (args.length < 3) {
  console.log("Invalid number of arguments");
  process.exit(1);
}

const password = args[2];

url = `mongodb+srv://dbadmin:${password}@cluster0.yvelr.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (args.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => console.log(person));
    mongoose.connection.close();
  });
}

if (args.length === 5) {
  const name = args[3];
  const number = args[4];

  const newPerson = new Person({
    name,
    number,
  });

  newPerson.save().then(() => {
    mongoose.connection.close();
  });
}
