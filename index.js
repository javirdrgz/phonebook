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
      if (person) return res.status(200).json(person);
      else return res.status(404).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!number) return res.status(400).json({ error: "missing number" });
  if (!name) return res.status(400).json({ error: "missing name" });

  Person.find({}).then((persons) => {
    const person = new Person({
      name,
      number,
    });

    person.save().then((person) => {
      res.json(person);
    });
  });
});

app.put("/api/persons/:id", (req, res) => {
  const { name, number } = req.body;

  if (!number) return res.status(400).json({ error: "missing number" });

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, _, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
