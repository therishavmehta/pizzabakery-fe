import { Drawer, Spin, Steps } from 'antd';
import PropTypes from 'prop-types';
import { Suspense } from 'react';

const CustomDrawer = ({ open, onClose, currentOrder, items }) => {
  return (
    <Suspense fallback={<Spin />}>
      <Drawer title={currentOrder.id} open={open} onClose={onClose}>
        <Steps
          direction="vertical"
          current={currentOrder.current}
          items={items}
        />
      </Drawer>
    </Suspense>
  );
};

CustomDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  form: PropTypes.object,
  onSubmit: PropTypes.func,
  currentOrder: PropTypes.objectOf({
    id: PropTypes.string
  }),
  items: PropTypes.arrayOf({
    title: PropTypes.string,
    description: PropTypes.string
  })
};

export default CustomDrawer;
