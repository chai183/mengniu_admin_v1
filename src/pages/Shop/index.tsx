import { ProTable, ProColumns } from "@ant-design/pro-components";
import { getFollowUpList, getCustomerList } from "@/services";
import { Tabs, Avatar, Space } from "antd";
import ImageList from "@/components/ImageList";
import moment from "moment";

export default () => {

    const columns: ProColumns<any>[] = [{
        title: '客户',
        dataIndex: 'customerId',
        valueType: 'select',
        fieldProps: {
            showSearch: true,
        },
        debounceTime: 500,
        request: async ({ keyWords }) => {
            const res = await getCustomerList({ page: 1, limit: 20, name: keyWords });
            return res.data.map((el: any) => ({
                label: <Space>
                    <Avatar src={el.avatar} />
                    {el.name}
                </Space>,
                value: el.id
            }))
        }
    }, {
        title: '跟进内容',
        dataIndex: 'content',
        renderText: (text, { images }) => <>
            {text || '--'}
            <ImageList images={images} />
        </>
    }, {
        title: '跟进时间',
        dataIndex: 'createTime',
        valueType: 'dateTimeRange',
        render: (text, { createTime }) => {
            return moment(createTime).format('YYYY-MM-DD HH:mm:ss')
        }
    }, {
        title: '跟进人',
        dataIndex: 'creater',
        hideInSearch: true
    }]

    return <Tabs>
        <Tabs.TabPane tab="产品跟进" key="1">
            <ProTable
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

