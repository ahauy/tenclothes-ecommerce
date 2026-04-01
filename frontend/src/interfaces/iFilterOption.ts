export interface IFilterOption {
  label: string;
  value: string
}

export interface IFilterProps {
  title: string;
  paramKey: string;
  options: IFilterOption[];
}