import React, { useState } from 'react';
import { Card, Button, Modal, Form, Input, InputNumber, Divider } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, gql } from '@apollo/client';
import CarCard from './CarCard';

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

const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $firstName: String, $lastName: String) {
    updatePerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
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

const PersonCard = ({ person }) => {
  const [deleteCar] = useMutation(DELETE_CAR, {
    update(cache, { data: { deleteCar } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });
      const updatedPeople = people.map(p => {
        if (p.id === person.id) {
          return {
            ...p,
            cars: p.cars.filter(car => car.id !== deleteCar.id),
          };
        } else {
          return p;
        }
      });
      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: updatedPeople },
      });
    },
  });

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

  const [updateCar] = useMutation(UPDATE_CAR);
  const [updatePerson] = useMutation(UPDATE_PERSON);

  const [isCarModalVisible, setIsCarModalVisible] = useState(false);
  const [isPersonModalVisible, setIsPersonModalVisible] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [form] = Form.useForm();

  const handleDeleteCar = (id) => {
    deleteCar({ variables: { id } }).catch(err => console.error(err));
  };

  const handleDeletePerson = (id) => {
    deletePerson({ variables: { id } }).catch(err => console.error(err));
  };

  const handleEditCar = (car) => {
    setCurrentCar(car);
    form.setFieldsValue(car);
    setIsCarModalVisible(true);
  };

  const handleEditPerson = (person) => {
    form.setFieldsValue(person);
    setIsPersonModalVisible(true);
  };

  const handleOkCar = () => {
    form.validateFields().then(values => {
      updateCar({ variables: { id: currentCar.id, ...values } }).catch(err => console.error(err));
      setIsCarModalVisible(false);
      setCurrentCar(null);
      form.resetFields();
    });
  };

  const handleOkPerson = () => {
    form.validateFields().then(values => {
      updatePerson({ variables: { id: person.id, ...values } }).catch(err => console.error(err));
      setIsPersonModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancelCar = () => {
    setIsCarModalVisible(false);
    setCurrentCar(null);
    form.resetFields();
  };

  const handleCancelPerson = () => {
    setIsPersonModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      <Card
        title={`${person.firstName} ${person.lastName}`}
        style={{ marginBottom: '20px' }}
      >
        {person.cars.map(car => (
          <CarCard key={car.id} car={car} onDelete={handleDeleteCar} onEdit={handleEditCar} />
        ))}
        <a href={`/people/${person.id}`}>Learn More</a>
        <Divider  />
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditPerson(person)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePerson(person.id)}
          />
        </div>
      </Card>

      <Modal title="Edit Car" visible={isCarModalVisible} onOk={handleOkCar} onCancel={handleCancelCar}>
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
        <Form form={form} layout="vertical">
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please input the first name!' }]}>
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please input the last name!' }]}>
            <Input placeholder="Last Name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PersonCard;
