import { useCallback, useMemo } from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { useNavigate, Route, Routes, useLocation } from 'react-router-dom';
import { CalendarOutlined, PieChartOutlined } from '@ant-design/icons';
import styles from './styles.module.css';
import PizzaMenu from '../PizzaMenu/PizzaMenu';
import { useEffect, useState } from 'react';
import OrderTracker from '../OrderTracker/OrderTracker';

const { Header, Content } = AntLayout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label
  };
}

const routes = {
  1: '/',
  2: '/orders'
};

const items = [
  getItem('Menu', '1', <PieChartOutlined />),
  getItem('Orders', '2', <CalendarOutlined />)
];
const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ongoingOrders, setOnGoingOrders] = useState([]);
  const [allPizza, setAllPizza] = useState([]);
  const [isAllPizzaLoading, setIsAllPizzaLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [currentRoute, setCurrentRoute] = useState('1');

  useEffect(() => {
    if (location.pathname === '/') {
      (async function () {
        setIsAllPizzaLoading(true);
        const res = await fetch('http://localhost:8080/all');
        const data = await res.json();
        setAllPizza(data);
        setIsAllPizzaLoading(false);
      })();
    } else {
      (async function () {
        setIsAllPizzaLoading(true);
        const res = await fetch('http://localhost:8080/orders');
        const data = await res.json();
        setOrders(data.map((val) => ({ ...val, status: 'COMPLETED' })));
      })();
    }
  }, [currentRoute]);

  const defaultAttribute = useMemo(() => {
    return [location.pathname === '/orders' ? '2' : '1'];
  }, []);

  const onMenuChange = useCallback((e) => {
    const nav = routes[e.key];
    setCurrentRoute(nav);
    navigate(nav);
  }, []);

  return (
    <AntLayout
      style={{
        minHeight: '100vh',
        minWidth: '100vw'
      }}
    >
      <Header className={styles['header']}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={defaultAttribute}
          items={items}
          style={{
            flex: 1,
            minWidth: 0
          }}
          onClick={onMenuChange}
        />
      </Header>
      <AntLayout>
        <Content
          style={{
            margin: '16px 16px'
          }}
        >
          <Routes>
            <Route
              exact
              path="/"
              element={
                <PizzaMenu data={allPizza} isLoading={isAllPizzaLoading} setOnGoingOrders={setOnGoingOrders} />
              }
            />
            <Route
              path="/orders"
              element={
                <OrderTracker
                  orders={orders}
                  setOrders={setOrders}
                  ongoingOrders={ongoingOrders}
                  setOnGoingOrders={setOnGoingOrders}
                />
              }
            />
          </Routes>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
export default Layout;
