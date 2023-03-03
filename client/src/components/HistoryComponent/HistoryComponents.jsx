import React from "react";
import { DatePicker, Space, Select, Button } from "antd";
import { Table } from "antd";
import qs from "qs";
import { useEffect, useState } from "react";

const onChange = (date, dateString) => {
  console.log(date, dateString);
};
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    render: (name) => `${name.first} ${name.last}`,
    width: "20%",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    filters: [
      {
        text: "Male",
        value: "male",
      },
      {
        text: "Female",
        value: "female",
      },
    ],
    width: "20%",
  },
  {
    title: "Email",
    dataIndex: "email",
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
  const fetchData = () => {
    setLoading(true);
    fetch(
      `https://randomuser.me/api?${qs.stringify(
        getRandomuserParams(tableParams)
      )}`
    )
      .then((res) => res.json())
      .then(({ results }) => {
        setData(results);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: 200,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);
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
  };
  return (
    <div className="py-20 px-28">
      <h3 className="font-bold text-2xl mb-4">History</h3>
      <Space>
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
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "Yiminghe",
                label: "yiminghe",
              },
              {
                value: "disabled",
                label: "Disabled",
                disabled: true,
              },
            ]}
          />
        </div>
        <Button className="border-blue-700 hover:bg-slate-500 hover:text-white text-blue-700">
          Filter
        </Button>
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
