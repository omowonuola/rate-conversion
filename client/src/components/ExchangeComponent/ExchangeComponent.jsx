import React, { useState } from "react";
import { Select, Space, Button, Input } from "antd";
import "./ExchangeComponent.scss";

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
];

const cryptoOptions = [
    { value: "BTC", label: "Bitcoin" },
    { value: "ETH", label: "Ethereum" },
    { value: "LTC", label: "Litecoin" },
];


const ExchangeComponent = () => {
    const [currency, setCurrency] = useState("USD");
    const [crypto, setCrypto] = useState("BTC");


    const handleCurrencyChange = (value) => {
        setCurrency(value);
      };
    
    const handleCryptoChange = (value) => {
    setCrypto(value);
    };


  return (
    <div className="py-20 px-28 exchangeComponent">
      <h3>Exchange</h3>
      <Space className="mt-5" wrap>
        <div>
          <p>Currency from</p>
            <Select
                style={{
                    width: 120,
                }}
                defaultValue={currency}
                onChange={handleCurrencyChange}
            >
                {currencyOptions.map((option) => (
                    <Option value={option.value} key={option.value}>
                    {option.label}
                    </Option>
                ))}
            </Select>

        </div>

        <div>
          <p>Amount</p>
          <Input placeholder="1" />
        </div>

        <div>=</div>

        <div>
          <p>Currency to</p>
            <Select
                style={{
                    width: 120,
                    }}
                defaultValue={crypto}
                onChange={handleCryptoChange}
            >
                {cryptoOptions.map((option) => (
                <Option value={option.value} key={option.value}>
                {option.label}
                </Option>
            ))}
            </Select>
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

