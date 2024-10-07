import { lazy, useCallback, useMemo, Suspense } from 'react';
import { Layout as AntLayout, Menu, Spin } from 'antd';
import { useNavigate, Route, Routes, useLocation } from 'react-router-dom';
import { CalendarOutlined, PieChartOutlined } from '@ant-design/icons';
import styles from './styles.module.css';

const PizzaMenu = lazy(() => import('../PizzaMenu/PizzaMenu'));
const OrderTracker = lazy(() => import('../OrderTracker/OrderTracker'));

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

  const defaultAttribute = useMemo(() => {
    return [location.pathname === '/orders' ? '2' : '1'];
  }, []);

  const onMenuChange = useCallback((e) => {
    const nav = routes[e.key];
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
                <Suspense fallback={<Spin />}>
                  <PizzaMenu />
                </Suspense>
              }
            />
            <Route
              path="/orders"
              element={
                <Suspense fallback={<Spin />}>
                  <OrderTracker />
                </Suspense>
              }
            />
          </Routes>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
export default Layout;
