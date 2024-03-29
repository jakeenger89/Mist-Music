import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MerchList() {
  const [merchs, setMerchs] = useState([]);

  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/merch/`
      );
      if (response.ok) {
        const data = await response.json();
        setMerchs(data);
      }
    } catch (error) {
      console.error("Failed to get merch:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h2 style={{ paddingTop: "30px" }}>Merchandise</h2>
      <div className="d-flex flex-wrap">
        {merchs &&
          merchs.map((merch) => (
            <div key={merch.item_id} className="col-lg-4 col-md-6">
              <div className="card" style={{ width: "24rem" }}>
                <Link to={`/merch/${merch.item_id}`}>
                  <img
                    src={merch.image_url}
                    className="card-img-top"
                    alt="Merch"
                    style={{
                      height: "360px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Link>
                <div className="card-body">
                  <h5 className="card-title">{`${merch.name}`}</h5>
                  <h5 className="card-title">{`${merch.price} Mist Coins`}</h5>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MerchList;
