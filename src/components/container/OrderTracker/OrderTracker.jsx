import {
  lazy,
  useEffect,
  useState,
  useTransition,
  Suspense,
  useMemo
} from 'react';
import { List, Steps, Spin } from 'antd';
import PropTypes from 'prop-types';
import { socket } from '../../../../socket';
import { status, abstractStatus, abstractItem, items } from './static';

const StatusDrawer = lazy(() =>
  import('../../presentation/StatusDrawer/StatusDrawer')
);

const OrderTracker = ({
  orders,
  setOrders,
  ongoingOrders,
  setOnGoingOrders
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const [isPending, startTransition] = useTransition();

  const sanatiseData = (data) => ({
    current: status[data.status],
    title: data.id,
    abstractCurrent: abstractStatus[data.status],
    id: data.id,
    [data.id]: data.status,
    timeline: data.timeline
  });

  const sanatisedCurrentData = useMemo(() => {
    return orders.map(sanatiseData);
  }, [orders]);

  const currentOrderTimeElapsed = useMemo(() => {
    if (
      Object.hasOwn(currentOrder, 'timeline') &&
      currentOrder.timeline.COMPLETED.length &&
      currentOrder.timeline.COMPLETED.length
    ) {
      const start = new Date(currentOrder.timeline.PENDING);
      const end = new Date(currentOrder.timeline.COMPLETED);
      const diffInMilliseconds = Math.abs(start - end);
      const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
      return diffInSeconds;
    }
    return 0;
  }, [currentOrder]);

  useEffect(() => {
    socket.on('orderCreated', (data) => {
      startTransition(() =>
        setOnGoingOrders((prevOrders) => [
          ...prevOrders,
          {
            ...data,
            current: status[data.status],
            title: data.id,
            abstractCurrent: abstractStatus[data.status],
            id: data.id,
            [data.id]: data.status,
            timeline: data.timeline
          }
        ])
      );
    });

    socket.on('orderStatus', (data) => {
      if (data.status === 'COMPLETED') {
        startTransition(() => {
          setOrders((orders) => [data, ...orders]);
          const currentOnGoingOrders = [...ongoingOrders].filter(
            (order) => order.id !== data.id
          );
          setOnGoingOrders([...currentOnGoingOrders]);
        });
      } else {
        startTransition(() =>
          setOnGoingOrders((prevOrders) => {
            const newOrders = [...prevOrders];
            const currentIdx = newOrders.map(({ id }) => id).indexOf(data.id);
            if (~currentIdx) {
              newOrders[currentIdx] = {
                timeline: data.timeline,
                current: status[data.status],
                title: data.id,
                id: data.id,
                abstractCurrent: abstractStatus[data.status],
                [data.id]: data.status,
                ...(data.status === 'ERROR' && { status: 'error' })
              };
            } else {
              newOrders.push({
                timeline: data.timeline,
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
      }
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
        <h3>Pizza Order Tracker</h3>
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
          dataSource={[...ongoingOrders, ...sanatisedCurrentData]}
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
          currentOrderTimeElapsed={currentOrderTimeElapsed}
        />
      </div>
    </Suspense>
  );
};

OrderTracker.propTypes = {
  orders: PropTypes.array,
  setOrders: PropTypes.func,
  ongoingOrders: PropTypes.array,
  setOnGoingOrders: PropTypes.func
};
export default OrderTracker;
