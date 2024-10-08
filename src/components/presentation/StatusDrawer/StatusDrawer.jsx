import { Drawer, Spin, Steps } from 'antd';
import PropTypes from 'prop-types';
import { Suspense } from 'react';

const CustomDrawer = ({
  open,
  onClose,
  currentOrder,
  items,
  currentOrderTimeElapsed,
  isCompleted
}) => {
  return (
    <Suspense fallback={<Spin />}>
      <Drawer title={currentOrder.id} open={open} onClose={onClose}>
        {isCompleted && (
          <h4>Total Time Taken: {currentOrderTimeElapsed} seconds</h4>
        )}
        <Steps
          direction="vertical"
          current={currentOrder.current}
          items={items}
        />
      </Drawer>
    </Suspense>
  );
};

let currentOrder = PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string
});

CustomDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  form: PropTypes.object,
  onSubmit: PropTypes.func,
  currentOrder: PropTypes.objectOf(currentOrder),
  items: PropTypes.arrayOf(currentOrder),
  currentOrderTimeElapsed: PropTypes.number,
  isCompleted: PropTypes.bool
};

export default CustomDrawer;
