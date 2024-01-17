/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  const TransactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return TransactionContract;
};

export const Transactionprovider = ({ children }) => {
  const [currentAccount, setcurrentAccount] = useState("");
  const [formData, setformData] = useState({
    addressto: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setisLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [Transcation, setTranscation] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getallTransaction = async () => {
    try {
      if (!ethereum) return alert("please install metamask");
      const transactionContract = getEthereumContract();
      const transactiondata = (await transactionContract).getAllTransactions();
      const info = (await transactiondata).map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(
          transaction.timestamp.toNumber() * 1000
        ).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / 10 ** 18,
      }));
      setTranscation(info);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const CheckIfwalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("please install metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setcurrentAccount(accounts[0]);
        getallTransaction();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const CheckifTransactionExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionCount = (
        await transactionContract
      ).getTransactionCount();
      window.localStorage.setItem("transactionCount", transactionCount);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const connectwallet = async () => {
    try {
      if (!ethereum) return alert("please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setcurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const sendtranscation = async () => {
    try {
      if (!ethereum) return alert("please install metamask");

      const { addressto, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressto,
            gas: "0x5208",
            value: parsedAmount._hex,
          },
        ],
      });

      //0x4aCdb985583c944F4f7f3a4d1D82d2B5cbbbC19B
      const transactionHash = (await transactionContract).addToBlockchain(
        addressto,
        parsedAmount,
        message,
        keyword
      );

      setisLoading(true);
      console.log(`Loading -${(await transactionHash).hash}`);
      (await transactionHash).wait();
      setisLoading(false);
      console.log(`success -${(await transactionHash).hash}`);

      const transactionCount = (
        await transactionContract
      ).getTransactionCount();

      setTransactionCount((await transactionCount).toNumber());

      window.location.href = "/";
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    CheckIfwalletIsConnected();
    CheckifTransactionExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectwallet,
        currentAccount,
        formData,
        setformData,
        handleChange,
        sendtranscation,
        Transcation,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
