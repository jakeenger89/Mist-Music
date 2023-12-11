from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
import stripe
from api.keys import STRIPE_SECRET_API_KEY


router = APIRouter()
stripe.api_key = STRIPE_SECRET_API_KEY


@router.post('/create-checkout-session')
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    'price': '{{PRICE_ID}}',
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url='http://localhost:3000/merch' + '?success=true',
            cancel_url='http://localhost:3000/merch' + '?canceled=true',
        )
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))

    return RedirectResponse(checkout_session.url, code=303)
