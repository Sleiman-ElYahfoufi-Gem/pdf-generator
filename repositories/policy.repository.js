import { Policy, Product, User } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * CRON 1: Get policies by lapsed date (T+90)
 * Returns policies grouped by product for efficient API calls
 */
export const getPoliciesByLapsedDate = async (lapsedDate) => {
  const policies = await Policy.findAll({
    where: {
      policyLapsed: lapsedDate
    },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'description']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'clientId']
      }
    ],
    order: [['productId', 'ASC']]
  });

  return policies;
};

/**
 * CRON 2: Get policies by status only
 * Returns policies grouped by product
 */
export const getPoliciesByStatus = async (status) => {
  const policies = await Policy.findAll({
    where: {
      status: status
    },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'description']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'clientId']
      }
    ],
    order: [['productId', 'ASC']]
  });

  return policies;
};

/**
 * CRON 3: Get policies by status AND lapsed date (Combined filter)
 * Returns policies grouped by product
 */
export const getPoliciesByStatusAndLapsedDate = async (status, lapsedDate) => {
  const policies = await Policy.findAll({
    where: {
      status: status,
      policyLapsed: lapsedDate
    },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'description']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'clientId']
      }
    ],
    order: [['productId', 'ASC']]
  });

  return policies;
};

/**
 * Update single policy with premium from API response
 */
export const updatePolicyPremium = async (policyId, premium) => {
  const policy = await Policy.findByPk(policyId);
  
  if (!policy) {
    throw new Error(`Policy with ID ${policyId} not found`);
  }

  policy.premium = premium;
  policy.premiumCalculatedAt = new Date();
  await policy.save();

  return policy;
};


/**
 * Group policies by product ID
 * Helper function to organize policies for product-based API calls
 */
export const groupPoliciesByProduct = (policies) => {
  return policies.reduce((grouped, policy) => {
    const productId = policy.productId;
    
    if (!grouped[productId]) {
      grouped[productId] = {
        product: policy.product,
        policies: []
      };
    }
    
    grouped[productId].policies.push(policy);
    return grouped;
  }, {});
};

/**
 * Get policies by date range (for created_at filtering if needed)
 */
export const getPoliciesByDateRange = async (startDate, endDate) => {
  const policies = await Policy.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate]
      }
    },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return policies;
};

/**
 * Get policy by ID with relations
 */
export const getPolicyById = async (policyId) => {
  const policy = await Policy.findByPk(policyId, {
    include: [
      {
        model: Product,
        as: 'product'
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'clientId']
      }
    ]
  });

  return policy;
};

/**
 * Get all policies for a specific user
 */
export const getPoliciesByUserId = async (userId) => {
  const policies = await Policy.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'description']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return policies;
};

/**
 * Get all policies for a specific product
 */
export const getPoliciesByProductId = async (productId) => {
  const policies = await Policy.findAll({
    where: { productId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'clientId']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  return policies;
};