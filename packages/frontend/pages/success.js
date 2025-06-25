import "../app/globals.css";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="grid text-center bg-white p-6 rounded-lg max-w-md w-[90%]">
        <h2 className="text-3xl font-semibold text-green-600 mb-4">
          Payment Successful!
        </h2>
        <p>Thank you for your purchase.</p>
        <a href="/" className="mt-4 text-lg text-blue-500 hover:underline">
          Return To Home
        </a>
      </div>
    </div>
  );
}
