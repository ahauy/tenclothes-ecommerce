import { useState, useEffect } from "react";
import axios from "axios";
import DropdownItem from "./DropdownItem";
import type {
  IDistrictResponse,
  ILocation,
  IProvinceResponse,
} from "../../interfaces/iAddress";
import ErrorMessage from "../errorMessage/ErrorMessage";

interface IDropdownAddressProps {
  province: number | string;
  district: number | string;
  ward: number | string;

  onChangeProvince: (val: string | number) => void;
  onChangeDistrict: (val: string | number) => void;
  onChangeWard: (val: string | number) => void;

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
  errors,
}: IDropdownAddressProps) => {
  // lấy danh sách các tình thành phố
  const [provinces, setProvinces] = useState<ILocation[]>([]);
  const [districts, setDistricts] = useState<ILocation[]>([]);
  const [wards, setWards] = useState<ILocation[]>([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/p/")
        setProvinces(response.data)
      } catch (e) {
        console.log("Lỗi khi tải danh sách Tỉnh/Thành phố: ", e)
      }
    }

    fetchProvinces()
  }, [])

  useEffect(() => {
    if(province) {
      const fetchDistrict = async () => {
        try {
          const response = await axios.get<IProvinceResponse>(`https://provinces.open-api.vn/api/p/${province}?depth=2`)
          setDistricts(response.data.districts)
        } catch (error) {
          console.error("Lỗi khi tải danh sách Quận/Huyện: ", error)
        }
      }
      fetchDistrict()
    } 
  }, [province])

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
  }, [district]);

  const handleChangeProvince = (provinceCode: number | string) => {
    onChangeProvince(provinceCode)
    onChangeDistrict("")
    onChangeWard("")
  }

  const handleChangeDistrict = (districtCode: number | string) => {
    onChangeDistrict(districtCode)
    onChangeWard("")
  }

  const handleChangeWard = (wardCode: number | string) => {
    onChangeWard(wardCode)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div className="sm:col-span-2 md:col-span-1">
        <DropdownItem
          placeholder="Chọn Tỉnh/Thành phố"
          listLocation={provinces}
          selectedValue={province}
          handle={handleChangeProvince}
        />
        <ErrorMessage message={errors.province} />
      </div>

      <div className="col-span-1">
        <DropdownItem
          placeholder="Chọn Quận/Huyện"
          listLocation={districts}
          selectedValue={province}
          handle={handleChangeDistrict}
          disabled={!province}
        />
        <ErrorMessage message={errors.district} />
      </div>

      <div className="col-span-1">
        <DropdownItem
          placeholder="Chọn Phường/Xã"
          listLocation={wards}
          selectedValue={ward}
          handle={handleChangeWard}
          disabled={!district}
        />
        <ErrorMessage message={errors.ward} />
      </div>
    </div>
  );
};

export default DropdownAddress;
