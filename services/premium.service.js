import axios from 'axios';
import logger from '../utils/logger.js';

/**
 * Call the 3rd party API for premium calculation
 * @param {Object} policy - The policy object with all details
 * @returns {Number} - The calculated premium
 */
export const callPremiumAPI = async (policy) => {
  try {
    // Replace with actual 3rd party API endpoint
    const API_ENDPOINT = process.env.PREMIUM_API_ENDPOINT || 'https://api.example.com/calculate-premium';
    const API_KEY = process.env.PREMIUM_API_KEY;

    // Prepare request payload - adjust based on actual API requirements
    const payload = {
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      productId: policy.productId,
      productName: policy.product?.name,
      userId: policy.userId,
      userEmail: policy.user?.email,
      status: policy.status,
      policyLapsedDate: policy.policyLapsed,
      // Add any other fields the API requires
    };

    logger.debug('Calling premium API', { 
      policyId: policy.id,
      endpoint: API_ENDPOINT 
    });

    // Make API call
    const response = await axios.post(API_ENDPOINT, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        // Add any other required headers
      },
      timeout: 10000 // 10 second timeout
    });

    // Extract premium from response - adjust based on actual API response structure
    const premium = response.data.premium || response.data.calculatedPremium;

    if (!premium) {
      throw new Error('Premium not found in API response');
    }

    logger.info('Premium calculated successfully', { 
      policyId: policy.id, 
      premium 
    });

    return premium;

  } catch (error) {
    logger.error('Failed to call premium API', {
      policyId: policy.id,
      error: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    // Re-throw error to be handled by cron job
    throw new Error(`Premium API call failed: ${error.message}`);
  }
};

