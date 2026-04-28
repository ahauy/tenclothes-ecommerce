const Title = ({ title1, title2 }: { title1: string; title2: string }) => {
  return (
    <div className="flex flex-col items-center gap-3 mb-2">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-black/40 uppercase">
        {title1}
      </p>
      <h2 className="prata-regular text-3xl sm:text-4xl text-black">
        {title2}
      </h2>
      <span className="block w-8 h-px bg-black/25 mt-1" />
    </div>
  );
};

export default Title;
