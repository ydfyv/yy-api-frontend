import {
  ProColumns,
  ProTable,
} from "@ant-design/pro-components";
import { Modal } from "antd";
import InterfaceInfo = API.InterfaceInfo;

interface Props {
  visible: boolean;
  columns: ProColumns<InterfaceInfo>[];
  model: InterfaceInfo;
  onCancel: () => void;
  onSubmit: (values: InterfaceInfo) => Promise<void>;
}

const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, model, onCancel, onSubmit } = props;

  return (
    <Modal
      destroyOnHidden
      open={visible}
      footer={null}
      width={800}
      onCancel={() => onCancel()}
    >
      <ProTable
        type={"form"}
        columns={columns}
        form={{
          initialValues: model,
        }}
        onSubmit={async (params) => {
          await onSubmit({
            ...params,
            id: model.id
          });
        }}
      ></ProTable>
    </Modal>
  );
};

export default CreateModal;
