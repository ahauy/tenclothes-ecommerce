export interface ILocation {
  code: number | string;
  name: string;
}

export interface IProvinceResponse extends ILocation {
  districts: ILocation[];
}

export interface IDistrictResponse extends ILocation {
  wards: ILocation[];
}