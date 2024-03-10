import { useMemo, useEffect, useState } from 'react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import axios from 'axios';

const Audit = () => {
    
    const [data, setData] = useState([]);

    useEffect(() => {
        affiche();
    }, []); 

    const columns = useMemo(
        () => [
            {
                accessorKey: 'action_type',
                header: 'Type action',
            },
            {
                accessorKey: 'updated_at',
                header: 'Date mise à jour',
            },
            {
                accessorKey: 'nom',
                header: 'Fournisseur',
            },
            {
                accessorKey: 'design',
                header: 'Produit',
            },
            {
                accessorKey: 'qte_anc',
                header: 'Qtent ancienne',
            },
            {
                accessorKey: 'qte_rec',
                header: 'Qtent nouvelle',
            },
            {
                accessorKey: 'user_name',
                header: 'Utilisateur',
            },
        ],
        [],
    );

    const table = useMantineReactTable({
        columns,
        data,
    });

    const affiche = () => {
        axios
            .get('http://localhost:3000/api/audit')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

   
    return (
        <>
            <div>
                <h2 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>AUDIT D'APPROVISIONNEMENT</h2>             
            </div>
            <MantineReactTable table={table} />          
        </>
    );
};

export default Audit;
