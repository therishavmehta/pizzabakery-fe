import { lazy, useEffect, useState, useTransition, Suspense } from 'react';
import { List, Steps, Spin } from 'antd';
import PropTypes from 'prop-types';
import { socket } from '../../../../socket';
import { status, abstractStatus, abstractItem, items } from './static';
const StatusDrawer = lazy(() =>
  import('../../presentation/StatusDrawer/StatusDrawer')
);

const OrderTracker = ({ orders, setOrders }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    socket.on('orderCreated', (data) => {
      startTransition(() =>
        setOrders((prevOrders) => [
          ...prevOrders,
          {
            current: status[data.status],
            title: data.id,
            abstractCurrent: abstractStatus[data.status],
            id: data.id,
            [data.id]: data.status
          },
          ...(data.status === 'ERROR' && { status: 'error' })
        ])
      );
    });

    socket.on('orderStatus', (data) => {
      startTransition(() =>
        setOrders((prevOrders) => {
          const newOrders = [...prevOrders];
          const currentIdx = newOrders.map(({ id }) => id).indexOf(data.id);
          if (~currentIdx) {
            newOrders[currentIdx] = {
              current: status[data.status],
              title: data.id,
              id: data.id,
              abstractCurrent: abstractStatus[data.status],
              [data.id]: data.status,
              ...(data.status === 'ERROR' && { status: 'error' })
            };
          } else {
            newOrders.push({
              current: status[data.status],
              title: data.id,
              id: data.id,
              abstractCurrent: abstractStatus[data.status],
              [data.id]: data.status,
              ...(data.status === 'ERROR' && { status: 'error' })
            });
          }
          return newOrders;
        })
      );
    });

    return () => {
      socket.off('orderCreated');
      socket.off('orderStatus');
    };
  }, []);

  const showMoreDetails = (item) => {
    setCurrentOrder(item);
    setShowDrawer(true);
  };

  return (
    <Suspense fallback={<Spin />}>
      <div>
        <h1>Pizza Order Tracker</h1>
        <List
          style={{
            height: 600,
            overflow: 'auto',
            padding: '0 16px',
            border: '1px solid rgba(140, 140, 140, 0.35)',
            background: 'white'
          }}
          loading={isPending}
          itemLayout="horizontal"
          dataSource={orders}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key="more-detail" onClick={() => showMoreDetails(item)}>
                  Detail
                </a>
              ]}
            >
              <List.Item.Meta
                style={{ textAlign: 'start' }}
                title={item.title}
                description={item.description}
              />
              <Steps
                style={{ marginTop: 8 }}
                type="inline"
                current={item.abstractCurrent}
                status={item.status}
                items={abstractItem}
              />
            </List.Item>
          )}
        />
        <StatusDrawer
          open={showDrawer}
          items={items}
          onClose={() => setShowDrawer(false)}
          currentOrder={currentOrder}
        />
      </div>
    </Suspense>
  );
};

OrderTracker.propTypes = {
  orders: PropTypes.array,
  setOrders: PropTypes.func
};
export default OrderTracker;
