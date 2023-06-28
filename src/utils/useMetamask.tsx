import { useEffect, useState } from "react";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const useMetamask = () => {
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isMetamaskLoggedIn, setIsMetamaskLoggedIn] = useState(false);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    const checkMetamask = async () => {
      if (typeof window.ethereum !== "undefined") {
        setIsMetamaskInstalled(true);

        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setIsMetamaskLoggedIn(true);
          setUserAddress(accounts[0]);
        } catch (error) {
          console.log(error);
        }
      }
    };

    checkMetamask();
  }, []);

  return { isMetamaskInstalled, isMetamaskLoggedIn, userAddress };
};

export default useMetamask;
