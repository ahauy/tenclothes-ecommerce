const Title = ({ title1, title2 }: { title1: string; title2: string }) => {
  return <div className="inline-flex items-center gap-2 mb-3">
    <p className="text-gray-500">{title1} <span className="text-gray-700 font-medium">{title2}</span></p>
    <p className="w-8 sm:w-11 h-px sm:h-0.5 bg-gray-700 translate-y-2/4"></p>
  </div>;
};

export default Title;
