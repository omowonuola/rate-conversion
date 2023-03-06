import React, { useState, useEffect } from "react";
import { Select, Space, Button, Input } from "antd";
import axios from "axios";
import "./ExchangeComponent.css";

const { Option } = Select;

const currencyOptions = [
  { value: "USD", label: "USD" },
];

const cryptoOptions = [
  { value: "BTC", label: "Bitcoin" },
  { value: "ETH", label: "Ethereum" },
];

const ExchangeComponent = () => {
  const [currencyBase, setCurrencyBase] = useState("USD");
  const [currencyQuote, setCurrencyQuote] = useState("BTC");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState("");
  const [onSuccess, setSuccess] = useState(false);
  const [onError, setError] = useState(false);

  useEffect(() => {
    convertCurrency();
  }, [currencyBase, currencyQuote, amount]);

  const convertCurrency = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/currency/${currencyBase}/${currencyQuote}/${amount}/`
      );
      const data = response.data;
      setConvertedAmount(data.rates);
      setSuccess(true);
      setError(false);
    } catch (error) {
      console.error(error);
      setSuccess(false);
      setError(true);
    }
  };

  const handleCurrencyChange = (value) => {
    console.log(value, 'currency')
    setCurrencyBase(value);
  };

  const handleCryptoChange = (value) => {
    console.log(value, 'crypto')
    setCurrencyQuote(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
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
            value={currencyQuote}
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
          <Input placeholder="1" value={amount} onChange={handleAmountChange} />
        </div>

        <div className="equality">=</div>

        <div>
          <p>Currency to</p>
          <Select
            style={{
              width: 120,
            }}
            value={currencyBase}
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
          <Input placeholder="0" value={convertedAmount} disabled />
        </div>
        <div className="save-button">
          <Button
            className="border-blue-700 hover:bg-slate-500 hover:text-white text-blue-700"
            onClick={convertCurrency}
          >
            Save
          </Button>
        </div>
      </Space>
      {/* {onSuccess && (
        <div className="success-message">Conversion successful!</div>
      )}
      {onError && (
        <div className="error-message">Conversion failed. Please try again later.</div>
      )} */}
    </div>
  )
}

export default ExchangeComponent;

