from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import os
import stripe


router = APIRouter()


stripe.api_key = 'sk_test_51OLaLBB3EjJEq3b5YNvIDZjekaFCntydmCOnevZVrOYcnNYPmKSUGNrEdb3Ttg51t2tnsYqYGLYHccH4fwikxsNq00JICkkprl'


@router.post("/create-checkout-session")
async def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    "price": "price_1ONBnOB3EjJEq3b5Wfgx7Oak",
                    "quantity": 1,
                },
            ],
            mode="payment",
            success_url="http://localhost:3000/coins/success",
            cancel_url="http://localhost:3000/coins"
            + "?canceled=true",
        )
        return RedirectResponse(url=checkout_session.url, status_code=303)

    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))
