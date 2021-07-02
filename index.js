const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

const app = express();

app.use(express.json());
app.use(express.static("build"));
app.use(cors());

morgan.token("reqBody", (req, _) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
);

app.get("/", (_, res) => {
  res.status(200).send("<h1>Hello World</h1>");
});

app.get("/info", (_, res) => {
  const info = `
          <p>Phonebook has info for ${persons.length} people</p>
          <p>${new Date()}</p>
    `;
  res.status(200).send(info);
});

app.get("/api/persons", (_, res) => {
  Person.find({}).then((persons) => {
    res.status(200).json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.status(200).json(person);
    })
    .catch((error) => console.log("Couldn't find person", error.message));
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!number) return res.status(400).json({ error: "missing number" });
  if (!name) return res.status(400).json({ error: "missing name" });

  Person.find({}).then((persons) => {
    const nameIsNotUnique = persons.some((p) => p.name === name);

    if (nameIsNotUnique) {
      return res.status(400).json({ error: "name must be unique" });
    }

    const person = new Person({
      name,
      number,
    });

    person.save().then((person) => {
      res.json(person);
    });
  });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end();
  });
});

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
