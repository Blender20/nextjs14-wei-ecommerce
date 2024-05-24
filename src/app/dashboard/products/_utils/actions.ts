'use server';

import { db } from '@/db';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { revalidatePath } from 'next/cache';

import type { SaveProduct, GetTotalProduct } from './types';

import type { Category, Color, Size } from '@prisma/client';

export const getTotalProduct = async (): Promise<GetTotalProduct> => {
  try {
    const totalProduct = await db.product.count({});
    return totalProduct;
  } catch (err) {
    console.error(`[ERROR_GET_TOTAL_PRODUCT]: ${err}`);
  }
}

export const saveProduct = async ({
  title,
  price,
  description,
  categoryId,
  colorId,
  sizeId,
  isFeatured,
  isArchived,
}: {
  title: string;
  price: string;
  description: string;
  categoryId: string;
  colorId: string;
  sizeId: string;
  isFeatured: boolean;
  isArchived: boolean;
}): Promise<SaveProduct> => {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser();
    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      throw new Error('You do not have access to this area');
    }

    const newProduct = await db.product.create({
      data: {
        title,
        price: Number(price),
        description,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived
      }
    })

    return { data: newProduct, success: true };
  } catch (err) {
    throw err;
  } finally {
    revalidatePath('/dashboard/products');
  }
}

export const getCategories = async (): Promise<Category[] | undefined> => {
  try {
    const categories = await db.category.findMany({});
    return categories;
  } catch (err) {
    console.error(`[ERROR_GET_CATEGORIES]: ${err}`);
  }
}

export const getColors = async (): Promise<Color[] | undefined> => {
  try {
    const colors = await db.color.findMany({});
    return colors;
  } catch (err) {
    console.error(`[ERROR_GET_COLORS]: ${err}`);
  }
}

export const getSizes = async (): Promise<Size[] | undefined> => {
  try {
    const sizes = await db.size.findMany({});
    return sizes;
  } catch (err) {
    console.error(`[ERROR_GET_SIZES]: ${err}`);
  }
}