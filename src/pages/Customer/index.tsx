import { ProTable, ModalForm } from "@ant-design/pro-components";
import { getCustomerList, updateCustomer, getAllUsers, deleteCustomer, uploadFile } from "@/services";
import { Avatar, Space, Tag, Button, Popconfirm } from "antd";
import ImageList from "@/components/ImageList";
import { ProFormText, ProFormTextArea, ProFormSelect, ProFormRadio, ProFormUploadButton } from "@ant-design/pro-components";
import moment from "moment";
import { useRef, useState } from "react";
import { getAllGoods } from "@/services";
import { useRequest } from "ahooks";
import type { ActionType, ProColumns } from "@ant-design/pro-components";

interface CustomerListItem {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    gender: number;
    shop: string;
    detail: string;
    remark: string;
    createTime: string;
    images: string;
    shopList?: number[];
    status: CustomerStatus;
}

export enum CustomerStatus {
    PENDING = 0,  // 待跟进
    DEAL = 1,     // 已成交
    LOST = 2      // 已流失
}

const statusMap: Record<CustomerStatus, { text: string; color: string }> = {
    [CustomerStatus.PENDING]: {
        text: '待跟进',
        color: 'blue'
    },
    [CustomerStatus.DEAL]: {
        text: '已成交',
        color: 'green'
    },
    [CustomerStatus.LOST]: {
        text: '已流失',
        color: 'red'
    }
}

const genderMap: Record<number, { text: string; color: string }> = {
    0: {
        text: '未知',
        color: 'default'
    },
    1: {
        text: '男',
        color: 'blue'
    },
    2: {
        text: '女',
        color: 'pink'
    }
}

export default () => {

    const actionRef = useRef<ActionType>();
    const [searchParams, setSearchParams] = useState({});

    const { data: allUsers } = useRequest(getAllUsers);

    const { data: goodsList } = useRequest(getAllGoods);
    const goodsMap = goodsList?.reduce((acc: any, item: any) => {
        acc[`${item.id}`] = item;
        return acc;
    }, {});

    const { run: updateCustomerRun } = useRequest(updateCustomer, {
        manual: true,
        onSuccess: () => {
            actionRef.current?.reload();
        }
    });

    const { run: deleteCustomerRun } = useRequest(deleteCustomer, {
        manual: true,
        onSuccess: () => {
            actionRef.current?.reload();
        }
    });

    const columns: ProColumns<CustomerListItem>[] = [
        {
            title: '客户名称',
            dataIndex: 'name',
            key: 'name',
            hideInTable: true,
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            hideInTable: true,
        },
        {
            title: '客户信息',
            key: 'customer',
            search: false,
            render: (_, record) => (
                <Space>
                    <Avatar src={record.avatar} />
                    <div>
                        <div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: 10 }}>{record.name ?? '--'}</span>
                            <Tag color={genderMap[record.gender]?.color}>{genderMap[record.gender]?.text}</Tag>
                            <Tag color={statusMap[record.status]?.color}>{statusMap[record.status]?.text}</Tag>
                        </div>
                        <div style={{ color: '#666' }}>
                            电话：{record.phone}
                        </div>
                    </div>
                </Space>
            )
        },
        {
            title: '客户信息',
            dataIndex: 'detail',
            key: 'detail',
            ellipsis: true,
            render: (_, record) => record.detail || '--'
        },
        {
            title: '购买产品',
            key: 'shopList',
            valueType: 'select',
            fieldProps: {
                mode: 'multiple',
                options: goodsList?.map((el: any) => ({
                    label: el.name,
                    value: el.id
                }))
            },
            render: (_, record) => (
                <div>
                    {record.shopList?.map((el: any) => {
                        const good = goodsMap?.[el];
                        return good ? <Tag key={el} color={`#${good.color}`} style={{ color: '#000' }}>{good?.name}</Tag> : null;
                    }) || '--'}
                </div>
            )
        },
        // {
        //     title: '创建时间',
        //     dataIndex: 'createTime',
        //     key: 'createTime',
        //     valueType: 'dateRange',
        //     render: (_, record) => moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')
        // },
        {
            title: '相关图片',
            key: 'images',
            search: false,
            render: (_, record) => <ImageList images={record.images} />
        },
        {
            title: '客户状态',
            dataIndex: 'status',
            key: 'status',
            valueType: 'checkbox',
            valueEnum: statusMap,
            hideInTable: true,
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            valueType: 'radio',
            valueEnum: genderMap,
            hideInTable: true,
        }, {
            title: '跟进人',
            dataIndex: 'followUserids',
            valueType: 'select',
            fieldProps: {
                showSearch: true,
                options: allUsers?.filter((el: any) => el.userid).map((el: any) => ({
                    label: el.name,
                    value: el.userid
                }))
            }
        },
        {
            title: '操作',
            valueType: 'option',
            render: (_, record) => <Space>
                <ModalForm
                    key={record.id}
                    initialValues={{
                        ...record,
                        images: record.images?.split(',').filter((el: string) => el)
                    }}
                    title="编辑客户"
                    width={500}
                    trigger={<Button type="link">编辑</Button>}
                    onFinish={async (values) => {
                        const { images = [], ...rest } = values;
                        if (images.length > 0) {
                            const uploadPromises = await Promise.all(images.map(async ({ originFileObj, url }: any) => {
                                if (url) {
                                    return url;
                                }
                                const result = await uploadFile(originFileObj);
                                return result.filename;
                            }));
                            rest.images = uploadPromises.join(',');
                        }
                        await updateCustomerRun(Number(record.id), rest as any);
                        return true;
                    }}
                >
                    <ProFormText name="name" label="客户名称" disabled />
                    <ProFormText name="phone" label="手机号" />
                    <ProFormSelect name="shopList" mode="multiple" label="购买产品" options={goodsList?.map((el: any) => ({
                        label: el.name,
                        value: `${el.id}`
                    }))} />
                    <ProFormRadio.Group name="status" label="客户状态" options={[{
                        label: '待跟进',
                        value: CustomerStatus.PENDING
                    }, {
                        label: '已成交',
                        value: CustomerStatus.DEAL
                    }, {
                        label: '已流失',
                        value: CustomerStatus.LOST
                    }]} />
                    <ProFormTextArea name="detail" label="客户信息" />
                    <ProFormUploadButton name="images" label="相关图片" listType="picture-card" />
                </ModalForm>
                <Popconfirm title="确定删除该客户吗？" onConfirm={() => {
                    deleteCustomerRun(Number(record.id));
                }}>
                    <Button type="link" danger>删除</Button>
                </Popconfirm>
            </Space>
        }
    ];

    return (
        <ProTable<CustomerListItem>
            actionRef={actionRef}
            columns={columns}
            request={async ({ current, pageSize, ...rest }) => {
                const params = {
                    page: current || 1,
                    limit: pageSize || 10,
                    ...rest,
                    ...searchParams
                };
                return getCustomerList(params);
            }}
            rowKey="id"
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
            }}
            search={{
                defaultCollapsed: false,
            }}
            onSubmit={(values: any) => {
                setSearchParams(values);
                actionRef.current?.reload();
            }}
            onReset={() => {
                setSearchParams({});
                actionRef.current?.reload();
            }}
            dateFormatter="string"
            headerTitle="客户列表"
            toolBarRender={() => [
                // 可以在这里添加操作按钮
            ]}
        />
    )
}

