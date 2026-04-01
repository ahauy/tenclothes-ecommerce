import { Fragment } from "react/jsx-runtime";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <Fragment>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} alt="Logo" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia quidem
            tempore labore eaque adipisci sint. Sunt fugit eligendi recusandae
            quia hic fuga, labore veritatis? Atque magnam eaque veritatis culpa
            consequuntur!
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+84 755 684 08</li>
            <li>vutuanhau.haui@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr className="opacity-20"/>
        <p className="py-5 text-sm text-center">
          Copyright 2026@ vutuanhau.haui.com - All Right Reserved
        </p>
      </div>
    </Fragment>
  );
};

export default Footer;
