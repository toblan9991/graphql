import React from 'react';
import { Card, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const CarCard = ({ car, onDelete, onEdit }) => {
  return (
    <Card
      type="inner"
      title={`${car.year} ${car.make} ${car.model} -> $ ${car.price.toLocaleString()} `}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(car)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(car.id)}
          />
        </>
        </div>
    </Card>
  );
};

export default CarCard;
