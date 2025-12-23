import {
  type ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import { Modal } from "antd";
import React from "react";
import InterfaceInfo = API.InterfaceInfo;


type FormModalProps = {
  title: string;
  columns: ProColumns<InterfaceInfo>[];
  modalVisible: boolean;
  model: any;
  children?: React.ReactNode;
  submitFn: (params:any) => Promise<void>;
  onCancel: () => void;
};

const FormModal: React.FC<FormModalProps> = (props) => {
  const { columns, title, modalVisible, model, onCancel, submitFn} = props;
  console.log(model, 'model....')
  return (
    <Modal
      destroyOnHidden
      title={title}
      open={modalVisible}
      width={800}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProTable
        type={"form"}
        columns={columns}
        form={{
          initialValues: model,
        }}
        onSubmit={async (params) => {
          await submitFn(params);
        }}
      />
    </Modal>
  );
};

export default FormModal;
