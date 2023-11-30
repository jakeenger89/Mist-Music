import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function OrderForm() {
    const[first_name, setFirstName] = useState('')
    const[last_name, setLastName] = useState('')
    const[address, setAddress] = useState('')
    const[city, setCity] = useState('')
    const[zipcode, setZipcode] = useState('')
    const[state, setState] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()
        const data = {
            first_name,
            last_name,
            address,
            city,
            zipcode,
            state
        }


        const orderURL = "http://localhost:8000/api/customer"
        const fetchOptions = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const response = await fetch(orderURL, fetchOptions)
        if(response.ok) {
            const newOrder = await response.json();
            setFirstName('')
            setLastName('')
            setAddress('')
            setCity('')
            setZipcode('')
            setState('')
            window.location.reload()
        }
    };


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

    const [item, setItem] = useState('');
    const { item_id } = useParams();
        const fetchData = async () => {
            const url = `http://localhost:8000/api/merch/${item_id}`;
            console.log(url)
            try {
                const response = await fetch(url);

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
        useEffect(() => {
            fetchData();
        }, [item_id])



    return (
        <div>
            <div>
                <img src= {item.image_url} style={{ width: '12rem' }} alt="item" />
                <ul>
                    <li>
                        <p>{item.name}</p>
                    </li>
                    <li>
                        <p>${item.price}</p>
                    </li>
                    <li>
                        <p>{item.size}</p>
                    </li>
                    <li>
                        <p>{item.description}</p>
                    </li>
                </ul>
            </div>


            <div className="row">
                <div className="offset-3 col-6">
                    <div className="shadow p-4 mt-4">
                        <h1>Checkout</h1>
                        <form onSubmit={handleSubmit} id="checkout-form">
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
                            <button className="btn btn-primary">Checkout</button>
                        </form>
                    </div>
                </div>
            </div>
    </div>
    )
}

export default OrderForm;
