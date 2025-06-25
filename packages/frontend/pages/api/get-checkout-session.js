import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { session_id } = req.query;

    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      res.status(200).json(session);
    } catch (error) {
      console.error("error retrieving session", error);
      res.status(500).json({ error: "failed to retrieve session data" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
