from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import stripe
import os


router = APIRouter()


stripe.api_key = os.environ["STRIPE_SECRET_KEY"]


@router.post("/create-checkout-session/")
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
            success_url="https://mist-music.gitlab.io/mist-music/coins/success"
            + "?success=true",
            cancel_url="https://mist-music.gitlab.io/mist-music/coins"
            + "?canceled=true",
        )
        return RedirectResponse(url=checkout_session.url, status_code=303)

    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))
