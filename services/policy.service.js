import * as policyRepository from '../repositories/policy.repository.js';
import logger from '../utils/logger.js';

/**
 * Get policies where policy_lapsed = targetDate (T+90 filter)
 * @param {Date} lapsedDate - The target date (usually current date + 90 days)
 * @returns {Array} - Array of policies matching the filter
 */
export const getPoliciesByLapsedDate = async (lapsedDate) => {
  const policies = await policyRepository.getPoliciesByLapsedDate(lapsedDate);

  if (!policies || policies.length === 0) {
    throw new Error(`No policies found for lapsed date: ${lapsedDate.toISOString().split('T')[0]}`);
  }

  return policies;
};

/**
 * Get policies where status = 'rating_pending'
 * @param {string} status - The status to filter by (default: 'rating_pending')
 * @returns {Array} - Array of policies matching the status
 */
export const getPoliciesByStatus = async (status = 'rating_pending') => {
  const policies = await policyRepository.getPoliciesByStatus(status);

  if (!policies || policies.length === 0) {
    throw new Error(`No policies found with status: ${status}`);
  }

  return policies;
};

/**
 * Get policies where both status = 'rating_pending' AND policy_lapsed = targetDate
 * @param {string} status - The status to filter by
 * @param {Date} lapsedDate - The target date for policy_lapsed
 * @returns {Array} - Array of policies matching both conditions
 */
export const getPoliciesByStatusAndLapsedDate = async (status, lapsedDate) => {
  const policies = await policyRepository.getPoliciesByStatusAndLapsedDate(status, lapsedDate);

  if (!policies || policies.length === 0) {
    throw new Error(`No policies found with status: ${status} and lapsed date: ${lapsedDate.toISOString().split('T')[0]}`);
  }

  return policies;
};

/**
 * Group policies by product ID for efficient API calls
 * @param {Array} policies - Array of policies
 * @returns {Object} - Object with productId as key and grouped data as value
 */
export const groupPoliciesByProduct = (policies) => {
  return policyRepository.groupPoliciesByProduct(policies);
};

/**
 * Update single policy with premium from API response
 * @param {number} policyId - The policy ID to update
 * @param {number} premium - The calculated premium to store
 * @returns {Object} - Updated policy record
 */
export const updatePolicyPremium = async (policyId, premium) => {
  try {
    const updatedPolicy = await policyRepository.updatePolicyPremium(policyId, premium);
    logger.info('Policy premium updated successfully', {
      policyId,
      premium,
      updatedAt: updatedPolicy.premiumCalculatedAt
    });
    return updatedPolicy;
  } catch (error) {
    logger.error('Failed to update policy premium', {
      policyId,
      premium,
      error: error.message
    });
    throw error;
  }
};


/**
 * Get policy by ID with relations
 * @param {number} policyId - The policy ID
 * @returns {Object} - Policy with product and user relations
 */
export const getPolicyById = async (policyId) => {
  const policy = await policyRepository.getPolicyById(policyId);

  if (!policy) {
    throw new Error(`Policy with ID ${policyId} not found`);
  }

  return policy;
};

/**
 * Get all policies for a specific user
 * @param {number} userId - The user ID
 * @returns {Array} - Array of policies for the user
 */
export const getPoliciesByUserId = async (userId) => {
  const policies = await policyRepository.getPoliciesByUserId(userId);

  if (!policies || policies.length === 0) {
    throw new Error(`No policies found for user ID ${userId}`);
  }

  return policies;
};

/**
 * Get all policies for a specific product
 * @param {number} productId - The product ID
 * @returns {Array} - Array of policies for the product
 */
export const getPoliciesByProductId = async (productId) => {
  const policies = await policyRepository.getPoliciesByProductId(productId);

  if (!policies || policies.length === 0) {
    throw new Error(`No policies found for product ID ${productId}`);
  }

  return policies;
};