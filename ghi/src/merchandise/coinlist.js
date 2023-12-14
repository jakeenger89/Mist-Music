import React from "react";

const items = [
  {
    id: "coin1",
    name: "1",
    amount: 100,
    currencyAmount: 1,
    image: "http://tinyurl.com/2uwn8vck",
  },
  {
    id: "coin5",
    name: "5",
    amount: 500,
    currencyAmount: 5,
    image: "http://tinyurl.com/2uwn8vck",
  },
  {
    id: "coin10",
    name: "10",
    amount: 1000,
    currencyAmount: 10,
    image: "http://tinyurl.com/2uwn8vck",
  },
  {
    id: "coin20",
    name: "20",
    amount: 2000,
    currencyAmount: 20,
    image: "http://tinyurl.com/2uwn8vck",
  },
  {
    id: "coin50",
    name: "50",
    amount: 5000,
    currencyAmount: 50,
    image: "http://tinyurl.com/2uwn8vck",
  },
  {
    id: "coin100",
    name: "100",
    amount: 10000,
    currencyAmount: 100,
    image: "http://tinyurl.com/2uwn8vck",
  },
];

const CoinList = ({ onCoinSelect }) => {
  return (
    <div>
      <h2 style={{ paddingTop: "30px" }}>Purchase Mist Coins</h2>
      <div className="d-flex flex-wrap">
        {items.map((item) => (
          <div key={item.id} className="col-lg-4 col-md-6">
            <div className="card" style={{ width: "24rem" }}>
              <form
                action="http://localhost:8000/create-checkout-session"
                method="POST"
              >
                <input
                  type="image"
                  src={item.image}
                  className="card-img-top"
                  alt="coin"
                  style={{
                    height: "360px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              </form>
              <div className="card-body">
                <h5 className="card-title">{`${item.name} Mist Coins`}</h5>
                <h5 className="card-title">Price: ${item.amount / 100}.00</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoinList;
