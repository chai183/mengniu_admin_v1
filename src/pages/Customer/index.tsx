import { ProList } from "@ant-design/pro-components";
import { getCustomerList } from "@/services";
import { Avatar, Space, Tag } from "antd";
import ImageList from "@/components/ImageList";
import { QueryFilter, ProFormText, ProFormDateRangePicker, ProFormCheckbox, ProFormRadio, ProFormSelect } from "@ant-design/pro-components";
import moment from "moment";
import { useRef, useState } from "react";
import { getAllGoods } from "@/services";
import { useRequest } from "ahooks";

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
}


export enum CustomerStatus {
    PENDING = 0,  // 待跟进
    DEAL = 1,     // 已成交
    LOST = 2      // 已流失
}

const statusMap = {
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

const genderMap = {
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

    const actionRef = useRef();
    const [searchParams, setSearchParams] = useState({});

    const { data: goodsList } = useRequest(getAllGoods);
    const goodsMap = goodsList?.reduce((acc: any, item: any) => {
        acc[`${item.id}`] = item;
        return acc;
    }, {});

    return <>
        <QueryFilter defaultCollapsed={false}
            onFinish={async (values) => {
                setSearchParams(values);
                actionRef.current?.reload();
            }}
            onReset={async () => {
                setSearchParams({});
                actionRef.current?.reload();
            }}
        >
            <ProFormText name="name" label="客户名称" />
            <ProFormText name="phone" label="手机号" />
            <ProFormDateRangePicker name="createTime" label="创建时间" />
            <ProFormText name="detail" label="客户信息" />
            <ProFormSelect name="shopList" mode="multiple" label="购买产品" options={goodsList?.map((el: any) => ({
                label: el.name,
                value: el.id
            }))} />
            <ProFormRadio.Group name="gender" label="性别" valueEnum={genderMap} />
            <ProFormCheckbox.Group name="status" label="客户状态" valueEnum={statusMap} />

        </QueryFilter>
        <ProList<CustomerListItem>
            actionRef={actionRef}
            search={false}
            request={async ({ current, pageSize, ...rest }) => getCustomerList({
                page: current || 1,
                limit: pageSize || 10,
                ...rest,
                ...searchParams
            })}
            metas={{
                title: {
                    dataIndex: 'name',
                    render: (text: string, record: CustomerListItem) => (
                        <Space>
                            <Avatar src={record.avatar} />
                            {text || '--'}
                        </Space>
                    )
                },
                description: {
                    dataIndex: 'detail',
                    render: (text: string, record: CustomerListItem) => (<Space direction="vertical" size="small">
                        <div>客户信息：{record.detail || '--'}</div>
                        <div>购买产品：{record.shopList?.map((el: any) => {
                            const good = goodsMap[el];
                            return <Tag key={el.id} color={`#${good.color}`} style={{ color: '#000' }}>{good?.name}</Tag>
                        }) || '--'}</div>
                        <div>创建时间：{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</div>
                    </Space>)
                },
                subTitle: {
                    render: (_: any, record: CustomerListItem) => (
                        <Space size={0}>
                            <Tag color={statusMap[record.status].color}>{statusMap[record.status].text}</Tag>
                            <Tag color={genderMap[record.gender].color}>{genderMap[record.gender].text}</Tag>
                            <Tag>电话：{record.phone}</Tag>
                        </Space>
                    )
                },
                content: {
                    render: (_: any, record: CustomerListItem) => (<ImageList images={record.images} />)
                }
            }}
            rowKey="id"
            pagination={{
                pageSize: 10
            }}
        />
    </>
}

