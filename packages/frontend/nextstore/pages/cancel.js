import "../app/globals.css";

export default function CancelPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md w-[90%]">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          Payment Failed!
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Your transaction was not completed. Please try again.
        </p>
        <a
          href="/"
          className="inline-block bg-green-500 text-white px-6 py-2 rounded-md text-md hover:bg-green-600"
        >
          Return To Cart
        </a>
      </div>
    </div>
  );
}
