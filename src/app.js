const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = []; // repositories
const likes = []; // likes

// List repositories
app.get("/repositories", (request,response) => {
  return (repositories.length === 0) ?
    response.status(200).json({ message: "No repositories available" })
    : response.status(200).json(repositories)
});

// Create a repository
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const rep = {
    id: uuid(),
    likes: 0,
    techs: techs,
    title: title,
    url: url
  };

  repositories.push(rep);
  return response.status(201).json(rep);
});

// Update a repository
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = repositories.findIndex(rep => rep.id === id);
  
  if (index < 0) {
    return response.status(400).json({ message: "Error" });

  } else {
    const repository = {
      id: id,
      likes: repositories[index].likes,
      title: title,
      url: url,
      techs: techs
    }
    repositories[index] = repository;

    return response.status(200).json(repositories[index]);
  }
});

// Remove a repository by ID
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
    return response.status(400).json({message:"ERROR"});
  } else {
    repositories.splice(index, 1);
    return response.status(204).json("");
  }

});

// Create a like linking a repository ID with an increment of his own actual number of likes. 
// Would be like : new like => {"id" : "1", "like":" *actual number of repository likes + 1* "}
// Therefore also creating an object on the Array of likes declared above, like it would be a table in database
app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id
  const index = repositories.findIndex(rep => rep.id === id);
  
  if (index < 0) {
    return response.status(400)
      .json({ message: "ID not found" });
  } else {
    repositories[index].likes += 1;
    const like = {
      id: id,
      likes: repositories[index].likes
    }
    likes.push(like);
    return response.status(201)
      .json(repositories[index])
  }



});

module.exports = app
