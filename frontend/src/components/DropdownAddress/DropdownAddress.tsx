import { useState, useEffect } from "react";
import axios from "axios";
import DropdownItem from "./DropdownItem";
import type { IDistrictResponse, ILocation, IProvinceResponse } from "../../interfaces/iAddress";


const DropdownAddress = () => {
  // lấy danh sách các tình thành phố
  const [provinces, setProvinces] = useState<ILocation[]>([]);
  const [districts, setDistricts] = useState<ILocation[]>([]);
  const [wards, setWards] = useState<ILocation[]>([]);

  // Lưu state dạng number thay vì string, vì API trả code dạng số
  const [selectedProvince, setSelectedProvince] = useState<number | "">("");
  const [selectedDistrict, setSelectedDistrict] = useState<number | "">("");
  const [selectedWard, setSelectedWard] = useState<number | "">("");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/p/");
        setProvinces(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tỉnh thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Hàm này giờ nhận thẳng provinceCode dạng số từ DropdownItem gửi lên
  const handleProvinceChange = async (provinceCode: number | string) => {
    setSelectedProvince(provinceCode as number);
    
    setSelectedDistrict("");
    setSelectedWard("");
    setWards([]); 

    if (provinceCode) {
      console.log(provinceCode)
      try {
        const response = await axios.get<IProvinceResponse>(
          `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
        );
        setDistricts(response.data.districts);
      } catch (error) {
        console.error("Lỗi khi tải danh sách quận huyện:", error);
      }
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (districtCode: number | string) => {
    setSelectedDistrict(districtCode as number);
    
    setSelectedWard("");

    if (districtCode) {
      try {
        const response = await axios.get<IDistrictResponse>(
          `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
        );
        setWards(response.data.wards);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phường xã:", error);
      }
    } else {
      setWards([]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div className="sm:col-span-2 md:col-span-1">
        <DropdownItem 
          placeholder="Chọn Tỉnh/Thành phố"
          listLocation={provinces}
          selectedValue={selectedProvince}
          handle={handleProvinceChange}
        />
      </div>

      <div className="col-span-1">
        <DropdownItem 
          placeholder="Chọn Quận/Huyện"
          listLocation={districts}
          selectedValue={selectedDistrict}
          handle={handleDistrictChange}
          disabled={!selectedProvince}
        />
      </div>

      <div className="col-span-1">
        <DropdownItem 
          placeholder="Chọn Phường/Xã"
          listLocation={wards}
          selectedValue={selectedWard}
          handle={(val) => setSelectedWard(val as number)}
          disabled={!selectedDistrict}
        />
      </div>
    </div>
  );
};

export default DropdownAddress;