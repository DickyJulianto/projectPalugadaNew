import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { cart, email } = req.body;

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      const line_items = cart.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [`${item.image}`],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        customer_email: email, // collect user email
        mode: "payment",
        shipping_address_collection: { allowed_countries: ["US", "CA", "GB"] },
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/cancel`,
      });
      console.log(session);
      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error("error creating checkout session", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
