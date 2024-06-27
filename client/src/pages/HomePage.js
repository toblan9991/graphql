// client/src/pages/HomePage.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Row, Col, Typography, Divider } from 'antd';
import PersonForm from '../components/PersonForm';
import CarForm from '../components/CarForm';
import PersonCard from '../components/PersonCard';

const { Title } = Typography;

const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

const HomePage = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  const people = data.people;

  return (
    <div className="container">
      <Title level={2} style={{ textAlign: 'center' }}>PEOPLE AND THEIR CARS</Title>
      <Divider />
      <Divider orientation="center" style={{ fontSize: '16px', fontWeight: 'bold' }}>Add Person</Divider>
      <Row justify="center">
        <Col>
          <PersonForm />
        </Col>
      </Row>
      {people.length > 0 && (
        <>
          <Divider orientation="center" style={{ fontSize: '16px', fontWeight: 'bold' }}>Add Car</Divider>
          <Row justify="center">
            <Col>
              <CarForm people={people} />
            </Col>
          </Row>
          <Divider orientation="center" style={{ fontSize: '16px', fontWeight: 'bold' }}>Records</Divider>
        </>
      )}
      {/* <Divider orientation="center" style={{ fontSize: '16px', fontWeight: 'bold' }}>Records</Divider> */}
   
      <div className="person-cards">
        {people.map(person => (
          <Row key={person.id} justify="center" style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <PersonCard person={person} />
            </Col>
          </Row>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

