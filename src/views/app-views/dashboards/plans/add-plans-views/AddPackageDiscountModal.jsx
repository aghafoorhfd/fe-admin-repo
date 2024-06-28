import {
  Button,
  Form,
  Row,
  Card,
  Col, InputNumber, Modal as AntModal, notification
} from 'antd';
import Modal from 'components/shared-components/Modal/index';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { noop } from 'lodash';
import IntlMessage from 'components/util-components/IntlMessage';
import { disableNumberFieldScroll } from 'utils/utils';
import ViewPackageDiscounts from './ViewPackageDiscounts';

const { confirm } = AntModal;

const AddPackageDiscountModal = ({
  modalTitle,
  onCancel,
  paymentCycleId,
  onAddPackageDiscount,
  packageDiscounts,
  maxLicenses
}) => {
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [packageDiscountsData, setPackageDiscountsData] = useState([]);
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const isMinMaxFieldEditable = editInputIndex
   !== -1 && editInputIndex === packageDiscountsData.length - 1;
  useEffect(() => {
    if (packageDiscounts?.length > 0) {
      setPackageDiscountsData([...packageDiscounts]);
    }
  }, [packageDiscounts]);

  const handleCancelForm = () => {
    form.resetFields();
    setAddFormVisibility(false);
    setEditInputIndex(-1);
    setIsFormTouched(false);
  };

  const validateMinMaxFields = (minUsers, maxUsers) => {
    if (((editInputIndex !== -1 && packageDiscountsData?.length === 1)
     || packageDiscountsData.length === 0) && minUsers > 1) {
      return { name: 'minUsers', errors: [t('component.discount.plan.form.validation.info3')] };
    }

    const lastRange = packageDiscountsData[packageDiscountsData.length
      - (editInputIndex === -1 ? 1 : 2)];
    if (lastRange && minUsers !== lastRange.maxUsers + 1) {
      return { name: 'minUsers', errors: [t('component.discount.plan.form.validation.info4')] };
    }

    if (maxUsers <= minUsers) {
      return { name: 'maxUsers', errors: [t('component.discount.plan.form.validation.info5')] };
    }

    if (maxUsers > maxLicenses) {
      return { name: 'maxUsers', errors: [t('component.discount.plan.form.validation.info6')] };
    }

    return null;
  };
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const { minUsers, maxUsers, discountPerc } = values;
        if (editInputIndex === -1 || isMinMaxFieldEditable) {
          const minMaxValidationError = validateMinMaxFields(minUsers, maxUsers);
          if (minMaxValidationError) {
            form.setFields([minMaxValidationError]);
            return;
          }
        }
        const discount = {
          minUsers,
          maxUsers,
          discountPerc: discountPerc / 100
        };
        if (editInputIndex !== -1) {
          const discountsData = [...packageDiscountsData];
          discountsData[editInputIndex] = discount;
          setPackageDiscountsData(discountsData);
        } else {
          setPackageDiscountsData([...packageDiscountsData, discount]);
        }
        handleCancelForm();
        setIsSaveDisabled(false);
      })
      .catch((info) => {
        throw info;
      });
  };

  const onEditPackageDiscount = ({ minUsers, maxUsers, discountPerc }, index) => {
    setEditInputIndex(index);
    setAddFormVisibility(true);
    form.setFieldsValue({
      minUsers, maxUsers, discountPerc: (discountPerc * 100).toFixed(2)
    });
  };
  const onDeletePackageDiscount = (index) => {
    const discountsData = [...packageDiscountsData];
    discountsData.splice(index, 1);
    setPackageDiscountsData(discountsData);
    setIsSaveDisabled(false);
    handleCancelForm();
  };

  const showConfirm = (index) => {
    const isIndexExists = index !== undefined;
    const confirmationMsg = isIndexExists ? 'component.addDiscount.form.discount.delete.warning' : 'component.message.unsavedChanges';
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: <h5><IntlMessage id={confirmationMsg} /></h5>,
      onOk() {
        if (isIndexExists) {
          onDeletePackageDiscount(index);
        } else {
          handleCancelForm();
        }
      }
    });
  };
  const addNewData = () => (
    addFormVisibility
      ? (
        <Card className="mb-0">
          <Form
            form={form}
            onFinish={handleSubmit}
            onFieldsChange={() => {
              setIsFormTouched(true);
            }}
            layout="vertical"
            name="user-modal-form">
            <Form.Item
              className="mb-2"
              name="minUsers"
              label={t('component.addDiscount.form.field.modal.minimumUsers')}
              rules={[{
                required: true,
                message: t('component.addDiscount.form.field.modal.minimumUsers.message')
              }, () => ({
                validator(_, value) {
                  if (value < 1) {
                    return Promise.reject(new Error(t('component.addDiscount.form.field.modal.minimumUsers.min.validation')));
                  }
                  return Promise.resolve();
                }
              })]}
              hasFeedback>
              <InputNumber
                className="w-100"
                onFocus={disableNumberFieldScroll}
                placeholder={t('component.addDiscount.form.field.modal.minimumUsers.placeholder')}
                disabled={editInputIndex !== -1 && !isMinMaxFieldEditable} />
            </Form.Item>
            <Form.Item
              className="mb-2"
              name="maxUsers"
              label={t('component.addDiscount.form.field.modal.maximumUsers')}
              rules={[{
                required: true,
                message: t('component.addDiscount.form.field.modal.maximumUsers.message')
              }, () => ({
                validator(_, value) {
                  if (value < 1) {
                    return Promise.reject(new Error(t('component.addDiscount.form.field.modal.maximumUsers.min.validation')));
                  }
                  return Promise.resolve();
                }
              })]}
              hasFeedback>
              <InputNumber
                className="w-100"
                onFocus={disableNumberFieldScroll}
                disabled={editInputIndex !== -1 && !isMinMaxFieldEditable}
                placeholder={t('component.addDiscount.form.field.modal.maximumUsers.placeholder')} />
            </Form.Item>
            <Form.Item
              className="mb-2"
              name="discountPerc"
              label={t('component.addDiscount.form.field.modal.discountPercentage')}
              rules={[{
                required: true,
                message: t('component.addPlan.form.validation.message', { role: t('component.addDiscount.form.field.modal.discountPercentage') })
              }, () => ({
                validator(_, value) {
                  if (value < 0 || value > 100) {
                    return Promise.reject(new Error(t('component.addDiscount.form.field.modal.discountPercentage.range.validation')));
                  }
                  return Promise.resolve();
                }
              })]}
              hasFeedback>
              <InputNumber
                onFocus={disableNumberFieldScroll}
                className="w-100"
                placeholder={t('component.addDiscount.form.field.modal.discountPercentage.placeholder')} />
            </Form.Item>
            <Form.Item shouldUpdate className="mb-0">
              {() => (
                <Row justify="center" gutter={8}>
                  <Col lg={12} md={12}>
                    <Button
                      block
                      onClick={isFormTouched ? () => showConfirm()
                        : handleCancelForm}>
                      {t('component.addDiscount.form.action.cancelBtn.title')}
                    </Button>
                  </Col>
                  <Col lg={12} md={12}>
                    <Button
                      block
                      htmlType="submit"
                      type="primary">
                      {`${editInputIndex === -1 ? t('component.common.add.label') : t('component.common.update.label')}`}
                    </Button>
                  </Col>
                </Row>
              )}
            </Form.Item>
          </Form>
        </Card>
      )
      : (
        <Button
          icon={<PlusOutlined />}
          className="w-100"
          onClick={() => {
            setAddFormVisibility(true);
          }}>
          {t('component.addDiscount.form.action.addNewDisconut.title')}
        </Button>
      )

  );

  const onCancelHandler = () => {
    onCancel();
  };

  const onOk = () => {
    notification.success({ message: t('Plan discounts changes have been successfully saved') });
    onCancel();
    onAddPackageDiscount(packageDiscountsData, paymentCycleId);
  };
  return (
    <Modal
      width={550}
      forceRender
      open
      title={modalTitle}
      confirmOnCancel={!isSaveDisabled}
      onCancel={onCancelHandler}
      cancelButtonProps={{ disabled: addFormVisibility }}
      closable={!addFormVisibility}
      maskClosable={!addFormVisibility}
      okButtonProps={{ disabled: isSaveDisabled || addFormVisibility }}
      onOk={onOk}
      okText={t('component.common.save.label')}>
      <ViewPackageDiscounts
        paymentCycleId={paymentCycleId}
        onDeletePackageDiscount={showConfirm}
        onEditPackageDiscount={onEditPackageDiscount}
        packageDiscountsData={packageDiscountsData} />
      <div className="mt-4">{addNewData()}</div>
    </Modal>
  );
};
AddPackageDiscountModal.propTypes = {
  modalTitle: PropTypes.string,
  onCancel: PropTypes.func,
  onAddPackageDiscount: PropTypes.func,
  paymentCycleId: PropTypes.string,
  maxLicenses: PropTypes.number,
  packageDiscounts: PropTypes.arrayOf(PropTypes.shape(
    {
      minUsers: PropTypes.number,
      maxUsers: PropTypes.number,
      discountPerc: PropTypes.number
    }
  ))
};

AddPackageDiscountModal.defaultProps = {
  onCancel: noop,
  onAddPackageDiscount: noop,
  packageDiscounts: [],
  modalTitle: '',
  paymentCycleId: '',
  maxLicenses: ''
};
export default AddPackageDiscountModal;
