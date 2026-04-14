import mongoose from "mongoose";

export interface ICategory {
  _id: mongoose.Types.ObjectId,
  title: string,
  slug: string,
  parentId: mongoose.Types.ObjectId,
  level: number
  thumbnail: string;
}

export interface ICategoryTree {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  level: number;
  parentId: mongoose.Types.ObjectId,
  thumbnail: string;
  children: ICategoryTree[];
}