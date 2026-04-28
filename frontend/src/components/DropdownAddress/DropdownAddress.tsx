import { useState, useEffect } from "react";
import axios from "axios";
import DropdownItem from "./DropdownItem";
import type {
  IDistrictResponse,
  ILocation,
  IProvinceResponse,
} from "../../interfaces/iAddress";
import ErrorMessage from "../errorMessage/ErrorMessage"; // Nhớ import đúng đường dẫn của bạn

interface IDropdownAddressProps {
  province: number | string;
  district: number | string;
  ward: number | string;

  // Cập nhật: Trả về cả code và name để Modal có thể gửi lên Backend
  onChangeProvince: (code: string | number, name: string) => void;
  onChangeDistrict: (code: string | number, name: string) => void;
  onChangeWard: (code: string | number, name: string) => void;

  // Cập nhật: Thêm placeholder để hỗ trợ hiển thị dữ liệu cũ khi ở chế độ Edit
  placeholders?: {
    province?: string;
    district?: string;
    ward?: string;
  };

  errors: {
    province?: string;
    district?: string;
    ward?: string;
  };
}

const DropdownAddress = ({
  province,
  district,
  ward,
  onChangeProvince,
  onChangeDistrict,
  onChangeWard,
  placeholders,
  errors,
}: IDropdownAddressProps) => {
  const [provinces, setProvinces] = useState<ILocation[]>([]);
  const [districts, setDistricts] = useState<ILocation[]>([]);
  const [wards, setWards] = useState<ILocation[]>([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://provinces.open-api.vn/api/p/"
        );
        setProvinces(response.data);
      } catch (e) {
        console.log("Lỗi khi tải danh sách Tỉnh/Thành phố: ", e);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (province) {
      const fetchDistrict = async () => {
        try {
          const response = await axios.get<IProvinceResponse>(
            `https://provinces.open-api.vn/api/p/${province}?depth=2`
          );
          setDistricts(response.data.districts);
        } catch (error) {
          console.error("Lỗi khi tải danh sách Quận/Huyện: ", error);
        }
      };
      fetchDistrict();
    }
    // Đã xóa khối else { setDistricts([]) }
  }, [province]);

  useEffect(() => {
    if (district) {
      const fetchWards = async () => {
        try {
          const response = await axios.get<IDistrictResponse>(
            `https://provinces.open-api.vn/api/d/${district}?depth=2`
          );
          setWards(response.data.wards);
        } catch (error) {
          console.error("Lỗi khi tải danh sách phường xã:", error);
        }
      };
      fetchWards();
    }
    // Đã xóa khối else { setWards([]) }
  }, [district]);

  // Tìm tên tương ứng với code để truyền ngược lên cha
  const handleChangeProvince = (provinceCode: number | string) => {
    const name =
      provinces.find((p) => String(p.code) === String(provinceCode))?.name ||
      "";
    onChangeProvince(provinceCode, name);
    // Reset quận/huyện và phường/xã khi đổi tỉnh
    onChangeDistrict("", "");
    onChangeWard("", "");
  };

  const handleChangeDistrict = (districtCode: number | string) => {
    const name =
      districts.find((d) => String(d.code) === String(districtCode))?.name ||
      "";
    onChangeDistrict(districtCode, name);
    // Reset phường/xã khi đổi quận
    onChangeWard("", "");
  };

  const handleChangeWard = (wardCode: number | string) => {
    const name =
      wards.find((w) => String(w.code) === String(wardCode))?.name || "";
    onChangeWard(wardCode, name);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {" "}
      {/* Thay grid bằng flex-col để xếp chồng */}
      {/* Tỉnh / Thành phố */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280]">
          Tỉnh / Thành phố
        </label>
        <DropdownItem
          placeholder={placeholders?.province || "Chọn Tỉnh/Thành phố"}
          listLocation={provinces}
          selectedValue={province}
          handle={handleChangeProvince}
        />
        {errors.province && <ErrorMessage message={errors.province} />}
      </div>
      {/* Quận / Huyện */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280]">
          Quận / Huyện
        </label>
        <DropdownItem
          placeholder={placeholders?.district || "Chọn Quận/Huyện"}
          listLocation={districts}
          selectedValue={district}
          handle={handleChangeDistrict}
          disabled={!province && !placeholders?.province}
        />
        {errors.district && <ErrorMessage message={errors.district} />}
      </div>
      {/* Phường / Xã */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6b7280]">
          Phường / Xã
        </label>
        <DropdownItem
          placeholder={placeholders?.ward || "Chọn Phường/Xã"}
          listLocation={wards}
          selectedValue={ward}
          handle={handleChangeWard}
          disabled={!district && !placeholders?.district}
        />
        {errors.ward && <ErrorMessage message={errors.ward} />}
      </div>
    </div>
  );
};

export default DropdownAddress;
