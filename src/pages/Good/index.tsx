import { ActionType, ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { Modal, Button, Form, Input, message, Tag, Space } from 'antd';
import { getGoodList, getGoodById, updateGood, createGood, deleteGood } from '@/services';
import { useRequest } from 'ahooks';

export default () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取商品详情的请求
  const { run: fetchGoodDetail } = useRequest(getGoodById, {
    manual: true,
    onSuccess: (result) => {
      form.setFieldsValue(result);
    },
  });

  // 删除商品的请求
  const { run: deleteGoodRequest } = useRequest(deleteGood, {
    manual: true,
    onSuccess: () => {
      actionRef.current?.reload();
      message.success('删除成功');
    },
  });

  // 创建/更新商品的请求
  const { run: submitGood } = useRequest(
    (values) => values.id ? updateGood(values.id, values) : createGood(values),
    {
      manual: true,
      onSuccess: (_, [values]) => {
        actionRef.current?.reload();
        setCreateModalVisible(false);
        message.success(values.id ? '更新成功' : '创建成功');
      },
    }
  );

  return <>
    <ProTable
      actionRef={actionRef}
      request={async ({ current, pageSize, ...rest }) => getGoodList({
        page: current || 1,
        limit: pageSize || 10,
        ...rest
      })}
      search={{
        defaultCollapsed: true
      }}
      toolBarRender={() => [
        <Button type="primary" onClick={() => {
          setCreateModalVisible(true);
          form.resetFields();
        }}>创建商品</Button>
      ]}
      columns={[
        // {
        //   title: '商品ID',
        //   dataIndex: 'id'
        // },
        {
          title: '商品',
          dataIndex: 'name',
          renderText: (_,{ name,color }) => {
            return <Space>
              <span>{name}</span>
              <Tag color={`#${color}`}>{color}</Tag>
              {/* <Button type='link' onClick={() => {
                setCreateModalVisible(true);
                fetchGoodDetail(text);
              }}>编辑</Button> */}
            </Space>
          }
        },
        // {
        //   title: '商品颜色',
        //   dataIndex: 'color',
        //   hideInSearch: true,
        //   renderText: (text) => {
        //     return <Tag key={text} color={`#${text}`}>{text}</Tag>
        //   }
        // },
        // {
        //   title: '创建时间',
        //   dataIndex: 'createTime',
        //   valueType: 'dateTime',
        //   hideInSearch: true
        // },
        // {
        //   title: '更新时间',
        //   dataIndex: 'updateTime',
        //   valueType: 'dateTime',
        //   hideInSearch: true
        // },
        {
          title: '操作',
          valueType: 'option',
          render: (text, record) => [
            <a key="edit" onClick={() => {
              setCreateModalVisible(true);
              fetchGoodDetail(record.id);
            }}>编辑</a>,
            <a key="delete" onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除这个商品吗？',
                onOk: () => deleteGoodRequest(record.id)
              });
            }}>删除</a>
          ]
        }
      ]}
    />
    
    <Modal
      title={form.getFieldValue('id') ? '编辑商品' : '创建商品'}
      open={createModalVisible}
      onCancel={() => {
        setCreateModalVisible(false);
        form.resetFields();
      }}
      footer={null}
    >
      <Form form={form} onFinish={(values) => {
        submitGood(values);
      }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item 
          label="商品名称" 
          name="name"
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          label="商品颜色" 
          name="color"
          rules={[{ required: true, message: '请输入商品颜色' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>提交</Button>
        </Form.Item>
      </Form>
    </Modal>
  </>;
};

