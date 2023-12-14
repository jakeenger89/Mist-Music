import React, { useEffect } from "react";

function CoinSuccess() {
  const authToken = localStorage.getItem("yourAuthToken");

  let currentUser = null;

  if (authToken) {
    const decodedToken = JSON.parse(atob(authToken.split(".")[1]));
    currentUser = decodedToken.account.account_id;
  }

  useEffect(() => {
    const deductCurrency = async (account_id, currency) => {
      const url = `${process.env.REACT_APP_API_HOST}/api/currency/${account_id}`;
      const fetchOptions = {
        method: "PUT",
        body: JSON.stringify({ currency }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      };
      try {
        const response = await fetch(url, fetchOptions);

        if (response.ok) {
          const data = await response.json();
          console.log("Currency deducted successfully", data); //Remove after deploy
        } else {
          console.error("Failed to deduct currency"); //Remove after deploy
        }
      } catch (error) {
        console.error("Error deducting currency:", error); //Remove after deploy
      }
    };

    if (currentUser) {
      deductCurrency(currentUser, -25);
    }
  }, [currentUser, authToken]);

  return (
    <div className="checkoutTrue">
      <h1>Thank you for your purchase!</h1>
      <p>Mist coins have been added to your account</p>
    </div>
  );
}

export default CoinSuccess;
