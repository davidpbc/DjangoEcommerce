# Checkout Process

1. Cart -> Checkout View
    ?
    - Login / Register or Enter an Email (as Guest)
    - Shipping Address
    - Billing Info
        - Billing Address
        - Credit Card / Payment

2. Billing Component
    - Billing Profile
        - User or Email (Guest Email)
        - Generate payment processor token (Stripe or Braintree)

3. Orders / Invoicess Component
    - Connecting the Billing Profile
    - Shipping / Billing Address
    - Cart
    - Status -- Shipped? Cancelled?