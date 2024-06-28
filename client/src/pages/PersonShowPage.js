import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Typography, Divider, Modal, Form, Input, InputNumber, Button, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CarCard from '../components/CarCard';

const { Title } = Typography;

const GET_PERSON_WITH_CARS = gql`
  query GetPersonWithCars($id: ID!) {
    person(id: $id) {
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

const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
    }
  }
`;

const UPDATE_CAR = gql`
  mutation UpdateCar($id: ID!, $year: Int, $make: String, $model: String, $price: Float, $personId: ID) {
    updateCar(id: $id, year: $year, make: $make, model: $model, price: $price, personId: $personId) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $firstName: String, $lastName: String) {
    updatePerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

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

const PersonShowPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });

  const [deleteCar] = useMutation(DELETE_CAR, {
    update(cache, { data: { deleteCar } }) {
      const { person } = cache.readQuery({ query: GET_PERSON_WITH_CARS, variables: { id } });
      const updatedPerson = {
        ...person,
        cars: person.cars.filter(car => car.id !== deleteCar.id),
      };
      cache.writeQuery({
        query: GET_PERSON_WITH_CARS,
        data: { person: updatedPerson },
        variables: { id }
      });
    },
  });

  const [updateCar] = useMutation(UPDATE_CAR);
  const [deletePerson] = useMutation(DELETE_PERSON, {
    update(cache, { data: { deletePerson } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });
      const updatedPeople = people.filter(p => p.id !== deletePerson.id);
      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: updatedPeople },
      });
    },
  });

  const [updatePerson] = useMutation(UPDATE_PERSON);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPersonModalVisible, setIsPersonModalVisible] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [form] = Form.useForm();
  const [personForm] = Form.useForm();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  const handleDeleteCar = (id) => {
    deleteCar({ variables: { id } }).catch(err => console.error(err));
  };

  const handleEditCar = (car) => {
    setCurrentCar(car);
    form.setFieldsValue(car);
    setIsModalVisible(true);
  };

  const handleEditPerson = (person) => {
    personForm.setFieldsValue(person);
    setIsPersonModalVisible(true);
  };

  const handleDeletePerson = (id) => {
    deletePerson({ variables: { id } }).catch(err => console.error(err));
  };

  const handleOkCar = () => {
    form.validateFields().then(values => {
      updateCar({ variables: { id: currentCar.id, ...values } }).catch(err => console.error(err));
      setIsModalVisible(false);
      setCurrentCar(null);
      form.resetFields();
    });
  };

  const handleCancelCar = () => {
    setIsModalVisible(false);
    setCurrentCar(null);
    form.resetFields();
  };

  const handleOkPerson = () => {
    personForm.validateFields().then(values => {
      updatePerson({ variables: { id: data.person.id, ...values } }).catch(err => console.error(err));
      setIsPersonModalVisible(false);
      personForm.resetFields();
    });
  };

  const handleCancelPerson = () => {
    setIsPersonModalVisible(false);
    personForm.resetFields();
  };

  return (
    <div className="container">
      <Title level={2} style={{ textAlign: 'center' }}>{data.person.firstName} {data.person.lastName}</Title>
      <Divider />
      <div className="person-cards">
        {data.person.cars.map(car => (
          <Row key={car.id} justify="center" style={{ marginBottom: '20px' }}>
            <Col span={24}>
              <CarCard car={car} onDelete={handleDeleteCar} onEdit={handleEditCar} />
            </Col>
          </Row>
        ))}
      </div>
      <Row justify="left">
        <Col>
          <Link to="/">Go Back Home</Link>
        </Col>
      </Row>
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => handleEditPerson(data.person)}
        />
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeletePerson(data.person.id)}
        />
      </div>

      <Modal title="Edit Car" visible={isModalVisible} onOk={handleOkCar} onCancel={handleCancelCar}>
        <Form form={form} layout="vertical">
          <Form.Item name="year" label="Year" rules={[{ required: true, message: 'Please input the year!' }]}>
            <InputNumber placeholder="Year" min={1900} max={new Date().getFullYear()} />
          </Form.Item>
          <Form.Item name="make" label="Make" rules={[{ required: true, message: 'Please input the make!' }]}>
            <Input placeholder="Make" />
          </Form.Item>
          <Form.Item name="model" label="Model" rules={[{ required: true, message: 'Please input the model!' }]}>
            <Input placeholder="Model" />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input the price!' }]}>
            <InputNumber placeholder="Price" min={0} step={0.01} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Edit Person" visible={isPersonModalVisible} onOk={handleOkPerson} onCancel={handleCancelPerson}>
        <Form form={personForm} layout="vertical">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please input the first name!' }]}>
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please input the last name!' }]}>
            <Input placeholder="Last Name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonShowPage;


