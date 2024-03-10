import { useMemo, useEffect, useState } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Button, Flex } from 'antd';
import { Col, Row } from 'antd';
import { ShoppingOutlined, PlusSquareOutlined, OrderedListOutlined } from '@ant-design/icons';
import { Input, InputNumber } from 'antd';
import axios from 'axios';

export const Prod = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'design',
        header: 'Nom',
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
      },
    ],
    [],
  );

  const [data, setData] = useState([]);
  const [newProduct, setNewProduct] = useState({
    design: '',
    stock: '',
  });

  const table = useMantineReactTable({
    columns,
    data,
  });

  const affiche = () => {
    axios.get('http://localhost:3000/api/products')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  const handleAddProduct = () => {
    // Use the newProduct state to add a new product
    axios.post('http://localhost:3000/api/products', newProduct)
      .then(response => {
        // After successful addition, refresh the product list
        affiche();
        // Reset the input values
        setNewProduct({
          design: '',
          stock: '',
        });
      })
      .catch(error => {
        console.error('Error adding product:', error);
      });
  };

  useEffect(() => {
    affiche();
  }, []);

  return (
    <>
      <div>
        <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>LISTE DES PRODUITS</h2>
        <Row>
          <Col flex="1 1 200px">
            <Input
              style={{ width: 200, marginRight: 14 }}
              placeholder="Nom du produit"
              prefix={<ShoppingOutlined />}
              value={newProduct.design}
              onChange={(e) => setNewProduct({ ...newProduct, design: e.target.value })}
            />
          </Col>
          <Col flex="15 1 100px">
            <InputNumber
              min={1}
              placeholder="Stock"
              prefix={<OrderedListOutlined />}
              value={newProduct.stock}
              onChange={(value) => setNewProduct({ ...newProduct, stock: value })}
            />
          </Col>
          <Col flex="400 0 100px">
            <Button type="primary" icon={<PlusSquareOutlined />} onClick={handleAddProduct}>
              Ajouter
            </Button>
          </Col>
        </Row>
        <br />
      </div>
      <MantineReactTable table={table} />
    </>
  );
};

export default Prod;
