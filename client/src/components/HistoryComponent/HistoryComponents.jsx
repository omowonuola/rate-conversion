import React from "react";
import { DatePicker, Space, Select, Button } from "antd";
import { Table } from "antd";
import qs from "qs";
import { useEffect, useState } from "react";
import { w3cwebsocket as WebSocket } from "websocket";

const endpoint = "ws://localhost:8000";


const onChange = (date, dateString) => {
  console.log(date, dateString);
};
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const columns = [
  {
    title: "Date & Time",
    dataIndex: "date",
    sorter: true,
    render: (name) => `${name.first} ${name.last}`,
    width: "20%",
  },
  {
    title: "Currency From",
    dataIndex: "currencyfrom",
    filters: [
      {
        text: "BTC",
        value: "btc",
      },
      {
        text: "ETH",
        value: "eth",
      },
      {
        text: "USD",
        value: "usd",
      },
    ],
    width: "20%",
  },
  {
    title: "Amount1",
    dataIndex: "amount1",
  },
  {
    title: "Currency To",
    dataIndex: "currencyto",
    filters: [
      {
        text: "USD",
        value: "usd",
      },
    ],
  },
  {
    title: "Amount2",
    dataIndex: "amount2",
  },
  {
    title: "Type",
    dataIndex: "type",
    filters: [
      {
        text: "Live",
        value: "live",
      },
      {
        text: "Exchange",
        value: "exchange",
      },
    ],
  },
];
const getRandomuserParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});
const HistoryComponents = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(endpoint);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onmessage = (event) => {
        const result = JSON.parse(event.data);
        setData(result);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: result.totalCount,
          },
        });
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchData = () => {
    setLoading(true);
    const params = qs.stringify(getRandomuserParams(tableParams));
    const message = {
      type: "fetch",
      params,
    };
    socket.send(JSON.stringify(message));
  };


  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
    fetchData()
  };


  const handleFilterChange = (value) => {
    const message = {
      type: "filter",
      value,
    };
    socket.send(JSON.stringify(message));
  };


  return (
    <div className="py-20 px-28 ">
      <h3 className="">History</h3>
      <Space className='margin'>
        <div>
          <p>From date</p>
          <DatePicker onChange={onChange} />
        </div>
        <div>
          <p>To date</p>
          <DatePicker onChange={onChange} />
        </div>

        <div>
          <p>Type</p>

          <Select
            defaultValue="All"
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={[
              {
                value: "disabled",
                label: "Disabled",
                disabled: true,
              },
            ]}
          />
        </div>
        <div className="save-button">
        <Button className="border-blue-700 hover:bg-slate-500 hover:text-white text-blue-700">
          Filter
        </Button>
        </div>
      </Space>

      <Table
        columns={columns}
        rowKey={(record) => record.login.uuid}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default HistoryComponents;