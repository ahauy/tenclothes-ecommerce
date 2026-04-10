import cryto from "crypto";

export const randomCode = (length: number): string => {
  const randomStr = cryto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .toUpperCase()
    .slice(0, length);
  return randomStr;
};
