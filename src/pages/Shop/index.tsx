import { ProTable, ProColumns } from "@ant-design/pro-components";
import { getFollowUpList, getCustomerList, getAllUsers } from "@/services";
import { Tabs, Avatar, Space } from "antd";
import ImageList from "@/components/ImageList";
import moment from "moment";
import { useRequest } from "ahooks";

export default () => {

    const { data: allUsers } = useRequest(getAllUsers);

    const columns: ProColumns<any>[] = [{
        title: '客户',
        dataIndex: 'customerId',
        valueType: 'select',
        fieldProps: {
            showSearch: true,
        },
        width: 200,
        renderText: (text, { customer }) => {
            return <Space>
                <Avatar src={customer?.avatar} />
                {customer?.remark_name ?? customer?.name ?? '--'}
            </Space>
        },
        debounceTime: 500,
        request: async ({ keyWords }) => {
            if (!keyWords) {
                return []
            }
            const res = await getCustomerList({ page: 1, limit: 20, name: keyWords });
            return res.data.map((el: any) => ({
                label: el.remark_name ?? el.name ?? '--',
                value: el.id
            }))
        }
    }, {
        title: '跟进内容',
        dataIndex: 'content',
        renderText: (text, { images, createTime }) => <>
            {text || '--'}
            <ImageList images={images} />
        </>
    },
    {
        title: '跟进时间',
        dataIndex: 'createTime',
        valueType: 'dateTimeRange',
        hideInTable: true,
        render: (text, { createTime }) => {
            return moment(createTime).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    {
        title: '跟进人',
        dataIndex: 'creater',
        valueType: 'select',
        width: 200,
        fieldProps: {
            showSearch: true,
            options: allUsers?.filter((el: any) => el.userid).map((el: any) => ({
                label: el.name,
                value: el.userid
            }))
        },
        renderText: (text, { createTime }) => {
            return <>
                {allUsers?.find((el: any) => el.userid === text)?.name}
                <div style={{ color: '#666' }}>
                    {moment(createTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
            </>
        }
    }]

    return <Tabs>
        <Tabs.TabPane tab="产品跟进" key="1">
            <ProTable
                search={{
                    defaultCollapsed: false,
                }}
                columns={columns}
                request={async ({ current, pageSize, ...rest }) => getFollowUpList({
                    page: current || 1,
                    limit: pageSize || 10,
                    type: 1,
                    ...rest
                })}
            />
        </Tabs.TabPane>
        <Tabs.TabPane tab="家访跟进" key="2">
            <ProTable
                search={{
                    defaultCollapsed: false,
                }}
                columns={columns}
                request={async ({ current, pageSize, ...rest }) => getFollowUpList({
                    page: current || 1,
                    limit: pageSize || 10,
                    type: 2,
                    ...rest
                })}
            />
        </Tabs.TabPane>
    </Tabs>
}

