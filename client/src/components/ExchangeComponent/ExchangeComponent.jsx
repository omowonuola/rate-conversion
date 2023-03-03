import React from "react";
import { Select, Space, Button, Input } from "antd";
import "./ExchangeComponent.scss";

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const ExchangeComponent = () => {
  return (
    <div className="py-20 px-28 exchangeComponent">
      <h3>Exchange</h3>
      <Space className="mt-5" wrap>
        <div>
          <p>Currency from</p>
          <Select
            defaultValue="Bitcoin"
            style={{
              width: 120,
            }}
            onChange={handleChange}
            options={[
              {
                value: "Ethereum",
                label: "Ethereum",
              },
              {
                value: "disabled",
                label: "Disabled",
                disabled: true,
              },
            ]}
          />
        </div>

        <div>
          <p>Amount</p>
          <Input placeholder="1" />
        </div>

        <div>=</div>

        <div>
          <p>Currency to</p>

          <Select
            defaultValue="USD"
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
        <div>
          <p>Amount</p>
          <Input placeholder="1" />
        </div>
        <Button className="bg-green-500 hover:bg-blue-800 text-white">
          Save
        </Button>
      </Space>
    </div>
  );
};

export default ExchangeComponent;
