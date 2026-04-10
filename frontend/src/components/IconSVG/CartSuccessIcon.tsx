const CartSuccessIcon = ({ className = "w-24 h-24 text-green-500" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      {/* Thân xe đẩy */}
      <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25z" />

      {/* Bánh xe bên trái */}
      <circle cx="7.5" cy="20.5" r="1.5" />

      {/* Vòng tròn huy hiệu bên phải */}
      <circle
        cx="17.5"
        cy="18.5"
        r="5.5"
        fill="currentColor"
        stroke="white"
        strokeWidth="2"
      />

      {/* Dấu check (✔) chuẩn React */}
      <path
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 18.5l2 2 3-4"
      />
    </svg>
  );
};

export default CartSuccessIcon;