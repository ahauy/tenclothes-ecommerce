import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef } from "react";
import { useShopStore } from "../stores/useShopStore";

const Search = () => {
  const openModal = useShopStore((state) => state.openModal);
  const setOpenModal = useShopStore((state) => state.setOpenModal);
  const inputRef = useRef<HTMLInputElement>(null);

  // Thêm đoạn useEffect này để khóa/mở khóa cuộn trang
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
      // Thêm setTimeout để đưa lệnh focus ra sau cùng của hàng đợi Call Stack
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100); // Trì hoãn 100ms để chờ CSS Transition chạy xong
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function để đảm bảo reset lại khi component unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openModal]);

  if (document === undefined) {
    return <div className="modal"></div>;
  }

  return ReactDOM.createPortal(
    <div
      className={`modal search fixed inset-0 flex justify-center items-center transition-all z-900 ${
        openModal ? "" : "opacity-0 invisible"
      }`}
    >
      <div
        className="overlay absolute inset-0 bg-black opacity-40 z-10"
        onClick={() => setOpenModal(false)}
      ></div>
      <div className="fixed w-3/4 sm:w-1/2 mx-auto bg-white rounded h-max z-20 p-4 top-45">
        <div className="flex justify-between items-center gap-5 border-b pb-4">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Search product ..."
            className="flex-1 outline-none"
            ref={inputRef}
          />
          <span
            className="hidden sm:inline-block py-1 px-2 border rounded cursor-pointer"
            onClick={() => setOpenModal(false)}
          >
            esc
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Search;
