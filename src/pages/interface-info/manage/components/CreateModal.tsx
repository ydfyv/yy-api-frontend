import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Modal } from "antd";
import InterfaceInfo = API.InterfaceInfo;
import InterfaceInfoAddRequest = API.InterfaceInfoAddRequest;

interface Props {
  visible: boolean;
  columns: ProColumns<InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: InterfaceInfoAddRequest) => Promise<void>;
}

const CreateModal: React.FC<Props> = (props) => {
  const { visible, columns, onCancel, onSubmit } = props;
  return (
    <Modal
      width={800}
      footer={null}
      open={visible}
      onCancel={() => onCancel()}
      destroyOnHidden
    >
      <ProTable
        type={"form"}
        columns={columns}
        onSubmit={async (params) => {
          console.log(params, '>>>>');
          await onSubmit(params);
        }}
      ></ProTable>
    </Modal>
  );
};

export default CreateModal;
