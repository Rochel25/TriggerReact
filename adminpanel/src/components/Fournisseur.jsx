import React, { useMemo, useEffect, useState } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Button } from 'antd';
import { Col, Row } from 'antd';
import { ShoppingOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import axios from 'axios';

export const Provider = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'idfr',
        header: 'ID',
      },
      {
        accessorKey: 'nom',
        header: 'Nom',
      },
    ],
    [],
  );

  const [data, setData] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    nom: '',
  });

  const table = useMantineReactTable({
    columns,
    data,
  });

  const affiche = () => {
    axios.get('http://localhost:3000/api/fournisseurs')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching fournisseurs:', error);
      });
  };

  const handleAddSupplier = () => {
    axios.post('http://localhost:3000/api/fournisseurs', newSupplier)
      .then(response => {
        affiche(); // Refresh the supplier list after successful addition
        setNewSupplier({ nom: '' }); // Reset the input values
      })
      .catch(error => {
        console.error('Error adding supplier:', error);
      });
  };

  useEffect(() => {
    affiche();
  }, []);

  return (
    <>
      <div>
        <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>LISTE DES FOURNISSEURS</h2>
        <Row>
          <Col flex="1 1 200px">
            <Input
              style={{ width: 200, marginRight: 14 }}
              placeholder="Nom du fournisseur"
              prefix={<ShoppingOutlined />}
              value={newSupplier.nom}
              onChange={(e) => setNewSupplier({ nom: e.target.value })}
            />
          </Col>
          <Col flex="400 0 100px">
            <Button type="primary" icon={<PlusSquareOutlined />} onClick={handleAddSupplier}>
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

export default Provider;
