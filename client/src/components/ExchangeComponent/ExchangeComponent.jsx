import React, { useState, useEffect } from "react";
import { Select, Space, Button, Input } from "antd";
import "./ExchangeComponent.css";
import axios from 'axios'

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const currencyOptions = [
    { value: "USD", label: "USD" },
];

const cryptoOptions = [
    { value: "BTC", label: "Bitcoin" },
    { value: "ETH", label: "Ethereum" },
];


const ExchangeComponent = () => {
    const [currencyBase, setCurrency] = useState("USD");
    const [currencyQuote, setCrypto] = useState("BTC");
    const [amount, setAmount] = useState(1);    
    const [onSuccess, setSuccess] = useState(false)
    const [onError, setError] = useState(false)

    useEffect(() => {
        convertCurrency()
    }, []);


    const convertCurrency =  async () => {
        try {
            let api = await axios.get(`http://localhost:8080/currency/${currencyBase}/${currencyQuote}/${amount}/`)
            console.log(api.data, 'CALL')
          //   setTest(apijson)
        } catch (error) {
            setError(true)
            console.log(error, 'error')
        }


    }  


    const handleCurrencyChange = (e) => {
        console.log(value, 'currency')
        // setCurrency(e.target.value);
      };
    
    const handleCryptoChange = (e) => {
        console.log(value, 'crypto')
        // setCrypto(e.target.value);
    };

    const handleAmount = (e) => {
        console.log(value, 'amount')
        setAmount(e.target.value);
    };

  return (
    <div className="py-20 px-28 exchangeComponent">
      <h3 >Exchange</h3>
      <Space className="mt-5" wrap>
        <div>
          <p>Currency from</p>
            <Select
                style={{
                    width: 120,
                }}
                defaultValue={currencyQuote}
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
          <Input placeholder="1" onChange={handleAmount} />
        </div>

        <div className="equality">=</div>

        <div>
          <p>Currency to</p>
            <Select
                style={{
                    width: 120,
                }}
                defaultValue={currencyBase}
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
          <Input placeholder="1"  />
        </div>
        <div className="save-button">
        <Button className="border-blue-700 hover:bg-slate-500 hover:text-white text-blue-700" onClick={convertCurrency}>
          Save
        </Button>
        </div>
      </Space>
    </div>
  );
};

export default ExchangeComponent;

