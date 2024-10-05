import {
  Drawer,
  Col,
  Form,
  Input,
  Row,
  Radio,
  Checkbox,
  Button,
  Flex
} from 'antd';
import PropTypes from 'prop-types';
import { useState, memo, useCallback } from 'react';
import { pizzaBase, pizzaToppings } from './static';

const CreatePizzaDrawer = ({ open, onClose, form, onSubmit }) => {
  const [isOrderDisabled, setIsOrderDisabled] = useState(true);

  const onBaseChange = (e) => {
    form.setFieldsValue({ base: e.target.value });
  };

  const onFormClose = useCallback(() => {
    setIsOrderDisabled(true);
    onClose();
  }, []);

  const onToppingsChange = useCallback((e) => {
    form.setFieldsValue({ toppings: e });
    setIsOrderDisabled(e.length === 0);
  }, []);

  const onSpecialNoteChange = useCallback((e) => {
    form.setFieldsValue({ specialNote: e });
  }, []);

  return (
    <Drawer
      title="Create Your own Pizza"
      open={open}
      onClose={onFormClose}
      footer={
        <Flex gap={4}>
          <Button onClick={onSubmit} disabled={isOrderDisabled} type="primary">
            Order
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Flex>
      }
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{ base: 'thin_crust', toppings: [] }}
        hideRequiredMark
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="base"
              label="Base"
              // value={form.base}
            >
              <Radio.Group onChange={onBaseChange} value={pizzaBase[0]}>
                {pizzaBase.map(({ value, label }) => (
                  <Radio key={value} value={value}>
                    {label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="toppings"
              label="Toppings"
              // value={form.toppings}
              rules={[
                { required: true, message: 'Please choose minimum toppings' }
              ]}
            >
              <Checkbox.Group
                options={pizzaToppings}
                onChange={onToppingsChange}
                defaultValue={pizzaToppings[0].value}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="specialNote" label="Special Note">
              <Input.TextArea
                rows={4}
                onChange={onSpecialNoteChange}
                placeholder="please enter special note"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

CreatePizzaDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  form: PropTypes.object,
  onSubmit: PropTypes.func
};

export default memo(CreatePizzaDrawer);
