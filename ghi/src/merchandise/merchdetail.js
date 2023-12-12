import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function OrderForm() {
    const[email, setEmail] = useState('')
    const[first_name, setFirstName] = useState('')
    const[last_name, setLastName] = useState('')
    const[address, setAddress] = useState('')
    const[city, setCity] = useState('')
    const[zipcode, setZipcode] = useState('')
    const[state, setState] = useState('')
    const[userCurrency, setUserCurrency] = useState(0)
    const[itemQuantity, setItemQuantity] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [item, setItem] = useState('');
    const[quantityStatus, setQuantityStatus] = useState('')
    const { item_id } = useParams();


        const authToken = localStorage.getItem('yourAuthToken');

        let currentUser = null;

        if (authToken) {
            const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
            currentUser = decodedToken.account.account_id;
        }


useEffect(() => {
    const calculateQuantityStatus = () => {
        if (itemQuantity >= 10) {
        setQuantityStatus(`${itemQuantity} in stock`);
        } else if (itemQuantity > 0 && itemQuantity < 10) {
        setQuantityStatus(`Hurry, only ${itemQuantity} left in stock!`);
        } else {
        setQuantityStatus("Sorry, we're sold out!");
        }
    };

        calculateQuantityStatus();
    }, [itemQuantity]);


    useEffect(() => {
        setIsAuthenticated(!!authToken);
    }, [authToken]);


    useEffect(() => {
        const fetchData = async() => {
            const url = `${process.env.REACT_APP_API_HOST}/api/merch/${item_id}`;
            try {
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setItemQuantity(data.quantity);
                console.log("quantity data", data.quantity)
            } catch(error){
                console.error('Error during fetch', error)
            }
        };
        fetchData();
    }, [item_id]);


    useEffect(() => {
        const getCurrency = async () => {
            const currencyURL = `${process.env.REACT_APP_API_HOST}/api/currency/${currentUser}`;
            try {
                    const response = await fetch(currencyURL, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserCurrency(data.currency);
                } else {
                    throw new Error('Failed to fetch user currency');
                }
            } catch (error) {
                console.error('Error fetching user currency:', error);
            }
        };
        getCurrency();
    }, [authToken, currentUser]);

    useEffect(() => {
        const fetchData = async () => {
            const url = `${process.env.REACT_APP_API_HOST}/api/merch/${item_id}`;
            console.log(url)
            try {
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setItem(data);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

            fetchData();
        }, [item_id]);


    const deductCurrency = async (account_id, currency) => {
        const url = `${process.env.REACT_APP_API_HOST}/api/currency/${account_id}`;
        const fetchOptions = {
            method: 'PUT',
            body: JSON.stringify({ currency }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        };
        try {
            const response = await fetch(url, fetchOptions);

            if (response.ok) {
                const data = await response.json();
                console.log('Currency deducted successfully', data); //Remove after deploy
            } else {
                console.error('Failed to deduct currency'); //Remove after deploy
            }
        } catch (error) {
            console.error('Error deducting currency:', error); //Remove after deploy
        }
    }

    const deductQuantity = async (item_id, quantity) => {
        const url = `${process.env.REACT_APP_API_HOST}/api/merch/quantity/${item_id}`;
        const fetchOptions = {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        };
        try {
            const response = await fetch(url, fetchOptions);

            if (response.ok) {
                const data = await response.json();
                console.log('Quantity deducted successfully', data); //Remove after deploy
            } else {
                console.error('Failed to deduct quantity'); //Remove after deploy
            }
        } catch (error) {
            console.error('Error deducting quantity:', error); //Remove after deploy
        }
    }


    async function handleSubmit(event) {
            event.preventDefault()
    if (item && item.price && itemQuantity > 0) {
            const totalPrice = item.price;
            if (userCurrency >= totalPrice) {
                const data = {
                    email,
                    first_name,
                    last_name,
                    address,
                    city,
                    zipcode,
                    state,
                    item_id
                };


        const orderURL = `${process.env.REACT_APP_API_HOST}/api/customer`
        const fetchOptions = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        }
    try {
        const response = await fetch(orderURL, fetchOptions)
        if(response.ok) {
            await deductQuantity(item_id, 1);
            await deductCurrency(currentUser, totalPrice);
            setEmail('')
            setFirstName('')
            setLastName('')
            setAddress('')
            setCity('')
            setZipcode('')
            setState('')
            window.location.href= '/merch/thankyou'
        } else {
            console.error('Failed to submit order');
        }
    } catch(error) {
        console.error('Error submitting order:', error);
    }
        } else {
        console.error('Insufficient currency');
    }
}
    }

    const handleEmailChange = async (event) => {
        const { value } = event.target;
        setEmail(value);
    }

    const handleFirstNameChange = async (event) => {
        const { value } = event.target;
        setFirstName(value);
    }
    const handleLastNameChange = async (event) => {
        const { value } = event.target;
        setLastName(value);
    }
    const handleAddressChange = async (event) => {
        const { value } = event.target;
        setAddress(value);
    }
    const handleCityChange = async (event) => {
        const { value } = event.target;
        setCity(value);
    }
    const handleZipcodeChange = async (event) => {
        const { value } = event.target;
        setZipcode(value);
    }
    const handleStateChange = async (event) => {
        const { value } = event.target;
        setState(value);
    }





    return (
        <div className="container mx-auto mt-8 flex justify-between">
        {isAuthenticated && (
            <div>
                <h3 className="whiteText" >Your Currency: {userCurrency}</h3>
            </div>
        )}
            <div className="flex-none max-w-md">
                <img src= {item.image_url} className="w-48 mb-4" style={{ width: '24rem' }} alt="item" />
                <ul>
                    <li>
                        <p>{item.name}</p>
                    </li>
                    <li>
                        <p>${item.price}</p>
                    </li>

                    <li>
                        <p>{item.description}</p>
                    </li>
                    <li>
                        <p>{quantityStatus}</p>
                    </li>
                </ul>
            </div>
    {quantityStatus !== "Sorry, we're sold out!" && (
        <>
        <div className="flex-none max-w-md">
        {isAuthenticated ? (
                    <div className="shadow p-4 mt-4">
                        <h1 className="text-2x1 font-bold mb-4">Checkout</h1>
                        <form onSubmit={handleSubmit} id="checkout-form">
                        <div className="form-floating mb-3">
                                <input value={email} onChange={handleEmailChange} placeholder="Email" required type="email" name="Email" id="Email" className="form-control" />
                                <label htmlFor="Email">Email</label>
                        </div>
                        <div className="form-floating mb-3">
                                <input value={first_name} onChange={handleFirstNameChange} placeholder="First Name" required type="text" name="First Name" id="First Name" className="form-control" />
                                <label htmlFor="First Name">First Name</label>
                        </div>
                        <div className="form-floating mb-3">
                                <input value={last_name} onChange={handleLastNameChange} placeholder="Last Name" name="Last Name" id="Last Name" className="form-control" />
                                <label htmlFor="Last Name">Last Name</label>
                        </div>
                        <div className="form-floating mb-3">
                                <input value={address} onChange={handleAddressChange} placeholder="Address" required type="text" name="Address" id="Address" className="form-control" />
                                <label htmlFor="Address">Address</label>
                        </div>
                        <div className="form-floating mb-3">
                                <input value={city} onChange={handleCityChange} placeholder="City" required type="text" name="City" id="City" className="form-control" />
                                <label htmlFor="City">City</label>
                        </div>
                        <div className="form-floating mb-3">
                                <input value={zipcode} onChange={handleZipcodeChange} placeholder="Zipcode" name="Zipcode" required type="number" id="Zipcode" className="form-control" />
                                <label htmlFor="Zipcode">Zipcode</label>
                        </div>
                        <div className="form-floating mb-3">
                                <input value={state} onChange={handleStateChange} placeholder="State" required type="text" name="State" id="State" className="form-control" />
                                <label htmlFor="State">State</label>
                        </div>
                            <button className="btn btn-primary" disabled={userCurrency < item.price}>Checkout</button>
                        </form>
            </div>
            ) : (
            <p className="text-white-500">Log in to checkout!</p>
            )}
            </div>
        </>
        )}

    </div>
    )
}

export default OrderForm;
