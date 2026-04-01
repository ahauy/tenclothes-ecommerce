import slugify from "slugify";

const slug = (str: string): string => {
  const slugStr: string = slugify(str, {
    replacement: "-",
    lower: true,
    locale: "vi",
    trim: true,
  });

  return slugStr;
};

export default slug;
