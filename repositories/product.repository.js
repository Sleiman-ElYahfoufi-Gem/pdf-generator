import { Product } from '../models/index.js';

/**
 * Get all products
 */
export const getAllProducts = async () => {
  const products = await Product.findAll({
    where: { isActive: true },
    order: [['name', 'ASC']]
  });

  return products;
};

/**
 * Get product by ID
 */
export const getProductById = async (productId) => {
  const product = await Product.findByPk(productId);
  return product;
};

/**
 * Create a new product
 */
export const createProduct = async (productData) => {
  const product = await Product.create(productData);
  return product;
};

/**
 * Update product
 */
export const updateProduct = async (productId, updates) => {
  const product = await Product.findByPk(productId);
  
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }

  await product.update(updates);
  return product;
};

/**
 * Soft delete product (set isActive to false)
 */
export const deactivateProduct = async (productId) => {
  const product = await Product.findByPk(productId);
  
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }

  product.isActive = false;
  await product.save();
  
  return product;
};