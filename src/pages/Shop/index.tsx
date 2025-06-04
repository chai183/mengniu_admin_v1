import { ProTable } from "@ant-design/pro-components";
import { getFollowUpList } from "@/services";
import { Tabs } from "antd";
import ImageList from "@/components/ImageList";

export default () => {

    const columns = [{
        title: '客户ID',
        dataIndex: 'customerId'
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
        valueType: 'dateTime'
    }, {
        title: '跟进人',
        dataIndex: 'creater'
    }]

    return <Tabs>
        <Tabs.TabPane tab="产品跟进" key="1">
            <ProTable
                search={false}
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
                search={false}
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

