import { ProList } from "@ant-design/pro-components";
import { getCustomerList } from "@/services";
import { Avatar, Space, Tag } from "antd";
import ImageList from "@/components/ImageList";

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

export default () => {
    return (
        <ProList<CustomerListItem>
            search={false}
            request={async ({ current, pageSize, ...rest }) => getCustomerList({
                page: current || 1,
                limit: pageSize || 10,
                ...rest
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
                        <div>购买产品：{record.shop || '--'}</div>
                        <div>跟进备注：{record.remark || '--'}</div>
                        <div>创建时间：{record.createTime}</div>
                    </Space>)
                },
                subTitle: {
                    render: (_: any, record: CustomerListItem) => (
                        <Space size={0}>
                            <Tag color="blue">ID: {record.id}</Tag>
                            <Tag color="green">{record.phone}</Tag>
                            <Tag color={record.gender === 1 ? 'blue' : 'pink'}>
                                {record.gender === 1 ? '男' : record.gender === 2 ? '女' : '未知'}
                            </Tag>
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
    )
}

