// server/index.js
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

// Mock data
let people = [
  { id: '1', firstName: 'Bill', lastName: 'Gates' },
  { id: '2', firstName: 'Steve', lastName: 'Jobs' },
  { id: '3', firstName: 'Linux', lastName: 'Torvalds' },
];

let cars = [
  { id: '1', year: '2019', make: 'Toyota', model: 'Corolla', price: 40000, personId: '1' },
  { id: '2', year: '2018', make: 'Lexus', model: 'LX 600', price: 13000, personId: '1' },
  { id: '3', year: '2017', make: 'Honda', model: 'Civic', price: 20000, personId: '1' },
  { id: '4', year: '2019', make: 'Acura', model: 'MDX', price: 60000, personId: '2' },
  { id: '5', year: '2018', make: 'Ford', model: 'Focus', price: 35000, personId: '2' },
  { id: '6', year: '2017', make: 'Honda', model: 'Pilot', price: 45000, personId: '2' },
  { id: '7', year: '2019', make: 'Volkswagen', model: 'Golf', price: 40000, personId: '3' },
  { id: '8', year: '2018', make: 'Kia', model: 'Sorento', price: 45000, personId: '3' },
  { id: '9', year: '2017', make: 'Volvo', model: 'XC40', price: 55000, personId: '3' },
];

// Type definitions
const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
    person: Person
  }

  type Query {
    people: [Person]
    cars: [Car]
    person(id: ID!): Person
    car(id: ID!): Car
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    updatePerson(id: ID!, firstName: String, lastName: String): Person
    deletePerson(id: ID!): Person
    addCar(year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car
    updateCar(id: ID!, year: Int, make: String, model: String, price: Float, personId: ID): Car
    deleteCar(id: ID!): Car
  }
`;

// Resolvers
const resolvers = {
  Query: {
    people: () => people,
    cars: () => cars,
    person: (_, { id }) => people.find(person => person.id === id),
    car: (_, { id }) => cars.find(car => car.id === id),
  },
  Mutation: {
    addPerson: (_, { firstName, lastName }) => {
      const newPerson = { id: String(people.length + 1), firstName, lastName };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (_, { id, firstName, lastName }) => {
      const person = people.find(person => person.id === id);
      if (!person) return null;
      if (firstName !== undefined) person.firstName = firstName;
      if (lastName !== undefined) person.lastName = lastName;
      return person;
    },
    deletePerson: (_, { id }) => {
      const personIndex = people.findIndex(person => person.id === id);
      if (personIndex === -1) return null;
      const [deletedPerson] = people.splice(personIndex, 1);
      cars = cars.filter(car => car.personId !== id);
      return deletedPerson;
    },
    addCar: (_, { year, make, model, price, personId }) => {
      const newCar = { id: String(cars.length + 1), year, make, model, price, personId };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (_, { id, year, make, model, price, personId }) => {
      const car = cars.find(car => car.id === id);
      if (!car) return null;
      if (year !== undefined) car.year = year;
      if (make !== undefined) car.make = make;
      if (model !== undefined) car.model = model;
      if (price !== undefined) car.price = price;
      if (personId !== undefined) car.personId = personId;
      return car;
    },
    deleteCar: (_, { id }) => {
      const carIndex = cars.findIndex(car => car.id === id);
      if (carIndex === -1) return null;
      const [deletedCar] = cars.splice(carIndex, 1);
      return deletedCar;
    },
  },
  Person: {
    cars: (person) => cars.filter(car => car.personId === person.id),
  },
  Car: {
    person: (car) => people.find(person => person.id === car.personId),
  },
};

const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  
  const app = express();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();


