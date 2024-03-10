import { useMemo, useEffect, useState } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { Button, Col, InputNumber, Row, Select, message, Modal, Descriptions } from 'antd';
import axios from 'axios';
import { EditOutlined, DeleteOutlined, PlusSquareOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const Approv = () => {
    const success = () => {
        message.success('Ajout avec succès!');
    };

    const [selectedRow, setSelectedRow] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalQte, setModalQte] = useState('');
    const id_user = localStorage.getItem('userId');

    const handleEdit = (row) => {
        setSelectedRow(row);
        setModalQte(row.quantite);
        setModalVisible(true);
        setSelectedProduct(row.idprod);
        setSelectedFournisseur(row.idfr);
        // Assurez-vous que votre backend expose une route pour récupérer les détails d'une approvisionnement spécifique
        axios.get(`http://localhost:3000/api/approvs/${row.id}`)
            .then((response) => {
                setSelectedRow(response.data);
            })
            .catch((error) => {
                console.error('Error fetching details:', error);
            });
    };


    const handleEditApprov = () => {
        // Assuming selectedRow contains the necessary data for the update
        const updateData = {
            qte: modalQte,
            id_user: id_user,
        };

        // console.log('Data to be modified:', {
        //     qte: modalQte,
        //     id_user: id_user,
        //     id: selectedRow.id, // Add any additional fields that are part of the update
        // });

        axios.put(`http://localhost:3000/api/approvs/${selectedRow.id}`, updateData)
            .then((response) => {
                // Handle successful update
                console.log('Update successful:', response.data);
                // Additional logic if needed
                affiche();
                // Close the modal after the update
                setModalVisible(false);
            })
            .catch((error) => {
                // Handle update error
                console.error('Error updating data:', error);
                // Additional error handling if needed
            });
    };

    const [data, setData] = useState([]);
    const [qte, setQte] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(undefined);
    const [selectedFournisseur, setSelectedFournisseur] = useState(undefined);
    const [fournisseurOptions, setFournisseurOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Voulez-vous vraiment supprimer cet approvisionnement?',
            icon: <ExclamationCircleOutlined />,
            content: 'Cette action est irréversible.',
            okText: 'Oui',
            okType: 'danger',
            cancelText: 'Non',
            onOk() {
                handleDelete(id);
            },
        });
    };

    const dataWithActions = useMemo(() => {
        return data.map((item) => ({
            ...item,
            actions: (
                <div style={{ display: 'flex' }}>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(item)}></Button>
                    <Button type="link" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(item.id)}></Button>
                </div>
            ),
        }));
    }, [data]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'produit',
                header: 'Produit',
            },
            {
                accessorKey: 'fournisseur',
                header: 'Fournisseur',
            },
            {
                accessorKey: 'quantite',
                header: 'Quantité',
            },
            {
                accessorKey: 'actions',
                header: 'Action',
            },
        ],
        [showDeleteConfirm]
    );

    const table = useMantineReactTable({
        columns,
        data: dataWithActions,
    });

    const affiche = () => {
        axios
            .get('http://localhost:3000/api/approvs')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    const handleAddApprov = () => {
        const newApprov = {
            idprod: selectedProduct,
            idfr: selectedFournisseur,
            qte: qte,
            id_user: id_user,
        };

        axios
            .post('http://localhost:3000/api/approvs', newApprov)
            .then((response) => {
                affiche();
                success();
                // Réinitialiser les champs après l'ajout réussi
                setQte('');
                setSelectedProduct(undefined);
                setSelectedFournisseur(undefined);
            })
            .catch((error) => {
                console.error('Error adding product:', error);
            });
    };

    const productView = () => {
        axios
            .get('http://localhost:3000/api/products')
            .then((response) => {
                const products = response.data.map((product) => ({
                    value: product.idprod,
                    label: product.design,
                }));
                setProductOptions(products);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    const fournisseurView = () => {
        axios
            .get('http://localhost:3000/api/fournisseurs')
            .then((response) => {
                const fournisseurs = response.data.map((fournisseur) => ({
                    value: fournisseur.idfr,
                    label: fournisseur.nom,
                }));
                setFournisseurOptions(fournisseurs);
            })
            .catch((error) => {
                console.error('Error fetching fournisseurs:', error);
            });
    };

    const handleDelete = (idapprov) => {
        const id_user = localStorage.getItem('userId');
    
        // Check if id_user is defined before making the request
        if (id_user) {
            axios
                .delete(`http://localhost:3000/api/approvs/${idapprov}`, {
                    headers: {
                        'X-User-Id': id_user,
                    },
                })
                .then((response) => {
                    affiche();
                    message.success('Suppression réussie!');
                })
                .catch((error) => {
                    console.error('Erreur lors de la suppression:', error);
                });
        } else {
            console.error('userId is undefined. Make sure to set it before calling handleDelete.');
        }
    };
    
    
    useEffect(() => {
        productView();
        fournisseurView();
    }, []);

    useEffect(() => {
        affiche();
    }, [productOptions, fournisseurOptions]); // Fetch data when options are loaded

    return (
        <>
            <div>
                <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>LISTE DES APPROVISIONNEMENTS</h2>
                <Row>
                    <Col flex="1 1 220px">
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: 200 }}
                            placeholder="Selectionnez un produit"
                            value={selectedProduct}
                            onChange={(value) => setSelectedProduct(value)}
                        >
                            {productOptions.map((product) => (
                                <Option key={product.value} value={product.value}>
                                    {product.label}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col flex="23 1 200px">
                        <Select
                            showSearch
                            optionFilterProp="children"
                            style={{ width: 200 }}
                            placeholder="Selectionnez un fournisseur"
                            value={selectedFournisseur}
                            onChange={(value) => setSelectedFournisseur(value)}
                        >
                            {fournisseurOptions.map((fournisseur) => (
                                <Option key={fournisseur.value} value={fournisseur.value}>
                                    {fournisseur.label}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    <Col flex="15 1 100px">
                        <InputNumber min={1} placeholder="Quantités" value={qte} onChange={(value) => setQte(value)} />
                    </Col>
                    <Col flex="400 0 100px">
                        <Button type="primary" icon={<PlusSquareOutlined />} onClick={handleAddApprov}>
                            Ajouter
                        </Button>
                    </Col>
                </Row>
                <br />
            </div>
            <MantineReactTable table={table} />

            {selectedRow && (
                <Modal
                    title="Modifier l'approvisionnement"
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setModalVisible(false)}>
                            Annuler
                        </Button>,
                        <Button key="ok" type="primary" onClick={handleEditApprov}>
                            Enregistrer
                        </Button>,
                    ]}
                >
                    <Select
                        style={{ width: '100%' }}
                        value={selectedRow.produit}
                        disabled={true} // Disable when there is no selectedRow
                    >
                        {productOptions.map((product) => (
                            <Select.Option key={product.value} value={product.value}>
                                {product.label}
                            </Select.Option>
                        ))}
                    </Select>

                    <br />
                    <br />
                    <Select
                        style={{ width: '100%' }}
                        value={selectedRow.fournisseur}
                        disabled={true}
                    >
                        {fournisseurOptions.map((fournisseur) => (
                            <Select.Option key={fournisseur.value} value={fournisseur.value}>
                                {fournisseur.label}
                            </Select.Option>
                        ))}
                    </Select>
                    <br />
                    <br />
                    <InputNumber
                        style={{ width: '100%' }}
                        min={1}
                        value={modalQte}
                        onChange={(value) => setModalQte(value)}
                    />
                </Modal>

            )}
        </>
    );
};

export default Approv;
