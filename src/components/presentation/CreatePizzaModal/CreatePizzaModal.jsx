import { Col, Row, Modal, Spin } from 'antd';
import PropTypes from 'prop-types';
import { useMemo, memo, Suspense } from 'react';

const CreatePizzaModal = ({
  isOpen,
  isLoading,
  handleCancel,
  handleOk,
  pizzaDetails
}) => {
  const toppingsAdded = useMemo(() => {
    return (
      pizzaDetails?.toppings
        ?.map((val) =>
          val
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        )
        .join(', ') || ''
    );
  }, [pizzaDetails.toppings]);
  return (
    <Suspense fallback={<Spin />}>
      <>
        <Modal
          title={pizzaDetails.pizza_name}
          open={isOpen}
          onOk={handleOk}
          okText="Order"
          confirmLoading={isLoading}
          onCancel={handleCancel}
        >
          <Row span={1}>
            <Col span={12}>
              <img
                style={{ objectFit: 'contain', height: '100%', width: '100%' }}
                src={pizzaDetails.image_url}
                alt="current-pizza"
              />
            </Col>
            <Col span={12}>
              <p>{pizzaDetails.description}</p>
              <h4>Toppings</h4>
              {toppingsAdded}
            </Col>
          </Row>
        </Modal>
      </>
    </Suspense>
  );
};

let pizzaDetails = PropTypes.objectOf({
  pizza_name: PropTypes.string,
  toppings: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.string,
  image_url: PropTypes.string
});

CreatePizzaModal.propTypes = {
  isOpen: PropTypes.bool,
  isLoading: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  pizzaDetails: PropTypes.objectOf(pizzaDetails).isRequired
};

export default memo(CreatePizzaModal);
