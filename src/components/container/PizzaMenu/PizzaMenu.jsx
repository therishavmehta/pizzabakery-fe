import { useState, memo, useCallback, lazy, Suspense, useEffect } from 'react';
import { Card, Form, Flex, Skeleton, message, Spin } from 'antd';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
const CreatePizzaDrawer = lazy(() =>
  import('../../presentation/CreatePizzaDrawer/CreatePizzaDrawer')
);
const CreatePizzaModal = lazy(() =>
  import('../../presentation/CreatePizzaModal/CreatePizzaModal')
);
const { Meta } = Card;

const PizzaMenu = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllPizzaLoading, setIsAllPizzaLoading] = useState(false);
  const [allPizza, setAllPizza] = useState([]);
  const [isCreatingPizzaOrder, setIsCreatingPizzaOrder] = useState(false);
  const [isCreatingCustomPizza, setIsCreatingCustomPizza] = useState(false);
  const [currentPizza, setCurrentPizza] = useState({});
  const [createPizzaForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    (async function () {
      setIsAllPizzaLoading(true);
      const res = await fetch('http://localhost:8080/all');
      const data = await res.json();
      setAllPizza(data);
      setIsAllPizzaLoading(false);
    })();
  }, []);

  const onCancelPizza = () => {
    setIsModalOpen(false);
    setCurrentPizza({});
  };

  const showPizzaDetails = useCallback(() => setIsModalOpen(true), []);

  const onCreatePizzaOrder = useCallback(() => {
    onCreatePizza(currentPizza);
    setIsModalOpen(false);
  }, [currentPizza]);

  const onCreateCustomPizzaClose = useCallback(() => {
    setIsCreatingCustomPizza(false);
    createPizzaForm.resetFields();
  }, []);

  const onCreatePizza = async (pizzaDetails) => {
    const { toppings } = pizzaDetails;
    setIsCreatingPizzaOrder(true);
    try {
      const raw = await fetch('http://localhost:8080/pizza', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ toppings })
      });
      const response = await raw.json();
      messageApi.open({
        type: 'success',
        content: `Order ${response.data.id} is in progress.`
      });
    } catch (e) {
      console.log(e);
      messageApi.open({
        type: 'error',
        content: e?.message || e?.data?.message || `Something went wrong.`
      });
    } finally {
      setIsCreatingPizzaOrder(false);
      setCurrentPizza({});
    }
  };

  const onCreateCustomPizza = useCallback(() => {
    setIsCreatingCustomPizza(true);
  }, []);

  const onCustomPizzCreate = useCallback(() => {
    const pizzaDetails = createPizzaForm.getFieldsValue();
    const { base, toppings } = pizzaDetails;
    onCreatePizza({ base, toppings });
    createPizzaForm.resetFields();
    setIsCreatingCustomPizza(false);
  }, []);

  const onPizzaClick = useCallback((e) => {
    const cardElement = e.target.closest('[data-card-id]');
    if (cardElement) {
      const cardId = cardElement.getAttribute('data-card-id');
      if (cardId === 'diy-pizza') {
        onCreateCustomPizza();
      } else {
        const cardDetails = JSON.parse(
          cardElement.getAttribute('data-card-details') || {}
        );
        setCurrentPizza(cardDetails);
        showPizzaDetails();
      }
    }
  }, []);
  return (
    <Flex wrap gap="small" justify="center" onClick={onPizzaClick}>
      {isAllPizzaLoading ? (
        [1, 2, 3, 4, 5].map((val, idx) => (
          <Card
            key={idx}
            className={styles['card']}
            cover={
              <Skeleton.Image active className={styles['loading-image']} />
            }
          >
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        ))
      ) : (
        <>
          <Card
            key="diy-pizza"
            data-card-id="diy-pizza"
            hoverable
            className={styles['card']}
            cover={
              <img
                alt="example"
                src="https://pizzamiamiami.com/wp-content/uploads/2020/04/checkout-create-your-pizza.png"
              />
            }
          >
            <Meta
              title={'Create your own pizza'}
              description={
                'Curate your pizza with custom base, toppings and flavour.'
              }
            />
          </Card>
          {allPizza.map((currentData) => (
            <Card
              key={currentData.id}
              data-card-details={JSON.stringify(currentData)}
              hoverable
              className={styles['card']}
              data-card-id={currentData.id}
              cover={
                <img
                  className={styles['pizza-preview']}
                  alt="example"
                  src={currentData.image_url}
                />
              }
            >
              <Meta
                title={currentData.pizza_name}
                description={currentData.description}
              />
            </Card>
          ))}
          <CreatePizzaModal
            isOpen={isModalOpen}
            isLoading={isCreatingPizzaOrder}
            handleCancel={onCancelPizza}
            pizzaDetails={currentPizza}
            handleOk={onCreatePizzaOrder}
          />
          <CreatePizzaDrawer
            open={isCreatingCustomPizza}
            onClose={onCreateCustomPizzaClose}
            form={createPizzaForm}
            onSubmit={onCustomPizzCreate}
          />
          {contextHolder}
        </>
      )}
    </Flex>
  );
};

PizzaMenu.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      imageUrl: PropTypes.string
    })
  ).isRequired,
  onCreatePizza: PropTypes.func,
  isLoading: PropTypes.bool
};

export default memo(PizzaMenu);
