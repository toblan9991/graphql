// client/src/components/CarForm.js
import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { Form, Input, InputNumber, Button, Select } from 'antd';

const ADD_CAR = gql`
  mutation AddCar($year: Int!, $make: String!, $model: String!, $price: Float!, $personId: ID!) {
    addCar(year: $year, make: $make, model: $model, price: $price, personId: $personId) {
      id
      year
      make
      model
      price
      personId
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

const CarForm = ({ people }) => {
  const [addCar] = useMutation(ADD_CAR, {
    update(cache, { data: { addCar } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });
      const updatedPeople = people.map(person => {
        if (person.id === addCar.personId) {
          return {
            ...person,
            cars: [...person.cars, addCar]
          };
        }
        return person;
      });
      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: updatedPeople }
      });
    }
  });

  const [form] = Form.useForm();

  const onFinish = (values) => {
    addCar({ variables: values });
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} layout="inline" style={{ justifyContent: 'center', marginBottom: '20px' }}>
      <Form.Item label="Year" name="year" rules={[{ required: true, message: 'Please input the year!' }]}>
        <InputNumber placeholder="Year" />
      </Form.Item>
      <Form.Item label="Make" name="make" rules={[{ required: true, message: 'Please input the make!' }]}>
        <Input placeholder="Make" />
      </Form.Item>
      <Form.Item label="Model" name="model" rules={[{ required: true, message: 'Please input the model!' }]}>
        <Input placeholder="Model" />
      </Form.Item>
      <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
        <InputNumber placeholder="Price" min={0} />
      </Form.Item>
      <Form.Item label="Person" name="personId" rules={[{ required: true, message: 'Please select a person!' }]}>
        <Select placeholder="Select a person">
          {people.map(person => (
            <Select.Option key={person.id} value={person.id}>
              {person.firstName} {person.lastName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Car
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CarForm;
