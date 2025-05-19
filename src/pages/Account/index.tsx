import { ActionType, ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { getUserList, getUserById, updateUser, createUser, deleteUser } from '@/services';
import { useRequest } from '@umijs/max';

export default () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取用户详情的请求
  const { run: fetchUserDetail } = useRequest(getUserById, {
    manual: true,
    onSuccess: (result) => {
      form.setFieldsValue(result);
    },
  });

  // 删除用户的请求
  const { run: deleteUserRequest } = useRequest(deleteUser, {
    manual: true,
    onSuccess: () => {
      actionRef.current?.reload();
      message.success('删除成功');
    },
  });

  // 创建/更新用户的请求
  const { run: submitUser } = useRequest(
    (values) => values.id ? updateUser(values.id, values) : createUser(values),
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
      request={async ({ current, pageSize, ...rest }) => {
        const response = await getUserList({
          page: current || 1,
          limit: pageSize || 10,
          ...rest
        });
        return response.data;
      }}
      search={{
        defaultCollapsed: true
      }}
      toolBarRender={() => [
        <Button type="primary" onClick={() => {
          setCreateModalVisible(true)
          form.resetFields();
        }}>创建用户</Button>
      ]}
      columns={[
        {
          title: '用户ID',
          dataIndex: 'id'
        }, {
          title: '账号',
          dataIndex: 'account'
        }, {
          title: '创建时间',
          dataIndex: 'createTime',
          valueType: 'dateTimeRange',
          hideInTable: true
        }, {
          title: '更新时间',
          dataIndex: 'updateTime',
          valueType: 'dateTimeRange',
          hideInTable: true
        }, {
          title: '创建时间',
          dataIndex: 'createTime',
          valueType: 'dateTime',
          hideInSearch: true
        }, {
          title: '更新时间',
          dataIndex: 'updateTime',
          valueType: 'dateTime',
          hideInSearch: true
        }, {
          title: '操作',
          valueType: 'option',
          render: (text, record) => [
            <a key="edit" onClick={() => {
              setCreateModalVisible(true);
              fetchUserDetail(record.id);
            }}>编辑</a>,
            <a key="delete" onClick={() => {
              deleteUserRequest(record.id);
            }}>删除</a>
          ]
        }
      ]}
    />
    <Modal
      title="创建用户"
      open={createModalVisible}
      onOk={() => {
        setCreateModalVisible(false);
      }}
      onCancel={() => {
        setCreateModalVisible(false);
      }}
      footer={null}
    >
      <Form form={form} onFinish={(values) => {
        submitUser(values);
      }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="账号" name="account">
          <Input />
        </Form.Item>
        <Form.Item shouldUpdate={(prevValues, currentValues) => {
          return prevValues.id !== currentValues.id;
        }} noStyle>
          {
            ({ getFieldValue }) => {
              const id = getFieldValue('id');
              if (!id) {
                return <Form.Item label="密码" name="password">
                  <Input type='password' />
                </Form.Item>
              }
              return null;
            }
          }
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit'>提交</Button>
        </Form.Item>
      </Form>
    </Modal>
  </>
}