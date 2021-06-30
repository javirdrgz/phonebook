const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

morgan.token("reqBody", (req, _) => JSON.stringify(req.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Number(Math.random().toString().slice(2));
};

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
  res.status(200).json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  person ? res.json(person) : res.status(404).end();
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!number) return res.status(400).json({ error: "missing number" });
  if (!name) return res.status(400).json({ error: "missing name" });

  const nameIsNotUnique = persons.some((p) => p.name === name);

  if (nameIsNotUnique)
    return res.status(400).json({ error: "name must be unique" });

  const person = {
    name,
    number,
    id: generateId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
