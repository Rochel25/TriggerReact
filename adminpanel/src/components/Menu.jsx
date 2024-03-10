import React, { useState, useEffect } from 'react';
import { Layout, Menu as AntMenu, theme } from 'antd';
import { Button} from 'antd';
import { Col} from 'antd';
import { LogoutOutlined, ShoppingOutlined, SolutionOutlined, CarryOutOutlined, ScheduleOutlined} from '@ant-design/icons';
import { Prod } from './Produit';
import Provider from './Fournisseur';
import Approv from './Approv';
import Img from '../assets/image/stock.png';
import Audit from './Audit';

const { Header, Content } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userRole = localStorage.getItem('Role');

  // État pour suivre l'élément du menu sélectionné
  // Utilisez une fonction pour déterminer l'état initial en fonction du stockage local et du rôle de l'utilisateur
  const getInitialMenuItem = () => {
    const storedMenuItem = localStorage.getItem('selectedMenuItem');
    if (userRole === 'admin' && storedMenuItem !== '4') {
      return '4'; // Sélectionnez automatiquement '4' (Audit) pour admin
    }
    return storedMenuItem || '1'; // Par défaut, sélectionnez '1' si rien n'est stocké
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState(getInitialMenuItem);

  // Gestionnaire de clic pour les éléments du menu
  const handleMenuClick = ({ key }) => {
    setSelectedMenuItem(key);
  };

  // Utilisez un effet useEffect pour sauvegarder l'état du menu dans le stockage local
  useEffect(() => {
    localStorage.setItem('selectedMenuItem', selectedMenuItem);
  }, [selectedMenuItem]);

  // Condition pour déterminer les éléments du menu en fonction du rôle de l'utilisateur
  const getMenuItems = () => {
    if (userRole === 'admin') {
      return [
        { key: '4', icon: <ScheduleOutlined />, label: 'Audit approvisionnement' },
      ];
    } else {
      return [
        { key: '1', icon: <ShoppingOutlined />, label: 'Produit' },
        { key: '2', icon: <SolutionOutlined />, label: 'Fournisseur' },
        { key: '3', icon: <CarryOutOutlined />, label: 'Approvisionnement' },
      ];
    }
  };

  // Contenu en fonction de l'élément du menu sélectionné
  const renderContent = () => {
    switch (selectedMenuItem) {
      case '1':
        return <Prod />;
      case '2':
        return <div><Provider /></div>;
      case '3':
        return <div><Approv /></div>;
      case '4':
        return <div><Audit /></div>;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Redirect to the login page
    window.location.href = '/';
  };

  return (
    <Layout style={{ width: '100vw', height: '100vh', fontFamily: 'Roboto, sans-serif' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        <div className="demo-logo" ><img src={Img} style={{ height: '60px', marginTop: '26px', marginRight: '20px' }} /></div>
        <AntMenu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedMenuItem]}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            borderBottom: '1px solid #fff',
            flex: 1,
            minWidth: 0,
            fontFamily: 'Roboto, sans-serif',
            fontSize: '16px',
          }}
          items={getMenuItems()}
        >
        </AntMenu>
        <Col flex="0 0 1px">
          <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
          </Button>
        </Col>
      </Header>
      <Content
        style={{
          padding: '0 50px',
        }}
      >
        <div
          style={{
            marginTop:50,
            marginLeft:5,
            marginRight:5,
            padding: 20,
            minHeight: 300,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </div>
      </Content>
    </Layout>
  );
};

export default App;
