

const NewsletterBox = () => {
  return (
    <div className="text-center mb-20">
      <p className="text-2xl font-medium text-gray-800">Subscribe now & get 20% off</p>
      <p className="text-gray-400 mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, ex?</p>
      <form onSubmit={(e) => {e.preventDefault()}} className="w-full sm:w-1/2 flex justify-center items-center mx-auto gap-3 border pl-3 mt-5">
        <input className="w-full sm:flex-1 outline-none" type="email" placeholder="Enter your email" required/>
        <button type="submit" className="bg-black text-white text-xs px-10 py-4 cursor-pointer">SUBSCRIBE</button>
      </form>
    </div>
  );
};

export default NewsletterBox;