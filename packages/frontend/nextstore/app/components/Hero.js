export default function Hero() {
  return (
    <div className="hero mt-6 md:mt-10 mb-6 md:min-h-80 text-white flex justify-between items-center relative p-7 md:p-10 rounded-xl">
      <div className="z-10">
        <span className="text-md font-semibold">Sale</span>
        <h2 className="text-3xl font-semibold md:text-5xl uppercase my-2">
          Up To <br /> 60% OFF
        </h2>
        <p className="mb-6">Further Reductions</p>
        <a
          href="/"
          className="px-4 bg-black py-2 text-sm uppercase hover:bg-orange-600 text-white rounded"
        >
          Shop Now
        </a>
      </div>
      <img
        className="max-w-[200px] md:max-w-[300px] object-cover absolute bottom-0 right-2 md:right-10"
        src="./images/hero.png"
        alt="hero image"
      />
    </div>
  );
}
