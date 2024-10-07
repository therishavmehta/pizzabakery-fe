import {
  lazy,
  useEffect,
  useState,
  useTransition,
  Suspense,
  useMemo,
  useCallback
} from 'react';
import { List, Steps, Spin } from 'antd';
import PropTypes from 'prop-types';
import { socket } from '../../../../socket';
import { status, abstractStatus, abstractItem, items } from '../../../static';

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

  const sanatiseData = useCallback(
    (data) => ({
      current: status[data.status],
      title: data.id,
      abstractCurrent: abstractStatus[data.status],
      id: data.id,
      [data.id]: data.status,
      timeline: data.timeline
    }),
    []
  );

  useEffect(() => {
    if (Object.keys(currentOrder)?.length > 0) {
      const data = [...ongoingOrders, ...orders].find((order) => order.id === currentOrder.id);
      if (data) setCurrentOrder({ ...data });
    }
  }, [ongoingOrders]);

  const sanatisedCurrentData = useMemo(() => {
    return orders.map(sanatiseData);
  }, [orders]);

  const currentOrderTimeElapsed = useMemo(() => {
    if (
      Object.hasOwn(currentOrder, 'timeline') &&
      currentOrder.timeline?.COMPLETED?.length &&
      currentOrder.timeline?.COMPLETED?.length
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
      const newData = {
        timeline: data.timeline,
        current: status[data.status],
        title: data.id,
        id: data.id,
        abstractCurrent: abstractStatus[data.status],
        [data.id]: data.status,
        ...(data.status === 'ERROR' && { status: 'error' })
      };
      if (data.status === 'COMPLETED') {
        startTransition(() => {
          setOrders((orders) => [{ ...data, ...newData }, ...orders]);
          setOnGoingOrders((prevOngoingOrder) => {
            const currentOnGoingOrders = [...prevOngoingOrder].filter(
              (order) => order.id !== data.id
            );
            return [...currentOnGoingOrders];
          });
        });
      } else {
        startTransition(() =>
          setOnGoingOrders((prevOrders) => {
            const newOrders = [...prevOrders];
            const currentIdx = newOrders.map(({ id }) => id).indexOf(data.id);
            if (~currentIdx) {
              newOrders[currentIdx] = newData;
            } else {
              newOrders.push(newData);
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
          isCompleted={currentOrder?.timeline?.COMPLETED?.length > 0}
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
