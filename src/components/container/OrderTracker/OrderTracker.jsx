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
import { abstractItem, items, abstractStatus, status } from '../../../static';

const StatusDrawer = lazy(() =>
  import('../../presentation/StatusDrawer/StatusDrawer')
);

const OrderTracker = () => {
  const [savedOrders, setSavedOrders] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      const res = await fetch('http://localhost:8080/orders');
      const data = await res.json();
      setSavedOrders(data.map(sanatiseOrderData));
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(currentOrder)?.length > 0) {
      const data = savedOrders.find((order) => order.id === currentOrder.id);
      if (data) setCurrentOrder({ ...data });
    }
  }, [savedOrders]);

  const sanatiseOrderData = useCallback(
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
      const sanatiseData = sanatiseOrderData(data);
      startTransition(() =>
        setSavedOrders((prevOrders) => {
          const newOrders = [...prevOrders];
          const currentIdx = newOrders.map(({ id }) => id).indexOf(data.id);
          if (~currentIdx) {
            newOrders[currentIdx] = sanatiseData;
          } else {
            newOrders.unshift(sanatiseData);
          }
          return newOrders;
        })
      );
    });

    socket.on('orderStatus', (data) => {
      const sanatiseData = sanatiseOrderData(data);
      startTransition(() =>
        setSavedOrders((prevOrders) => {
          const newOrders = [...prevOrders];
          const currentIdx = newOrders.map(({ id }) => id).indexOf(data.id);
          if (~currentIdx) {
            newOrders[currentIdx] = sanatiseData;
          } else {
            newOrders.unshift(sanatiseData);
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
        itemLayout="horizontal"
        loading={isLoading}
        dataSource={savedOrders}
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
  );
};

OrderTracker.propTypes = {
  savedOrders: PropTypes.array,
  setSavedOrders: PropTypes.func,
  sanatiseOrderData: PropTypes.func
};
export default OrderTracker;
