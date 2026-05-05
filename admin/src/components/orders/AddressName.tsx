import React, { useState, useEffect } from "react";

interface Props {
  provinceCode: string;
  districtCode: string;
  wardCode?: string;
}

const addressCache: Record<string, string> = {};

const AddressName: React.FC<Props> = ({ provinceCode, districtCode, wardCode }) => {
  const defaultName = [wardCode, districtCode, provinceCode].filter(Boolean).join(", ");
  const [name, setName] = useState<string>(defaultName);

  useEffect(() => {
    let isMounted = true;
    const fetchAddress = async () => {
      try {
        const cacheKey = `${provinceCode}-${districtCode}-${wardCode || ""}`;
        if (addressCache[cacheKey]) {
          if (isMounted) setName(addressCache[cacheKey]);
          return;
        }

        let provinceName = provinceCode;
        let districtName = districtCode;
        let wardName = wardCode || "";

        const fetchPromises = [];

        if (provinceCode) {
          fetchPromises.push(
            fetch(`https://provinces.open-api.vn/api/p/${provinceCode}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => { if (data) provinceName = data.name; })
              .catch(() => {})
          );
        }
        
        if (districtCode) {
          fetchPromises.push(
            fetch(`https://provinces.open-api.vn/api/d/${districtCode}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => { if (data) districtName = data.name; })
              .catch(() => {})
          );
        }

        if (wardCode) {
          fetchPromises.push(
            fetch(`https://provinces.open-api.vn/api/w/${wardCode}`)
              .then(res => res.ok ? res.json() : null)
              .then(data => { if (data) wardName = data.name; })
              .catch(() => {})
          );
        }

        await Promise.all(fetchPromises);

        const fullName = [wardName, districtName, provinceName].filter(Boolean).join(", ");
        addressCache[cacheKey] = fullName;
        if (isMounted) setName(fullName);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddress();

    return () => {
      isMounted = false;
    };
  }, [provinceCode, districtCode, wardCode]);

  return <span>{name}</span>;
};

export default AddressName;
