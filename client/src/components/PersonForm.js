// client/src/components/PersonForm.js
import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { Form, Input, Button } from 'antd';

const ADD_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addPerson(firstName: $firstName, lastName: $lastName) {
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

const PersonForm = () => {
  const [addPerson] = useMutation(ADD_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }],
  });

  const [form] = Form.useForm();

  const onFinish = (values) => {
    addPerson({ variables: values });
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} layout="inline" style={{ justifyContent: 'center', marginBottom: '20px' }}>
      <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please input the first name!' }]}>
        <Input placeholder="First Name" />
      </Form.Item>
      <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please input the last name!' }]}>
        <Input placeholder="Last Name" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Person
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PersonForm;
