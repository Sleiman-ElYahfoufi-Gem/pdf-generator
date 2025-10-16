import { getPoliciesByStatus, groupPoliciesByProduct, updatePolicyPremium } from '../../services/policy.service.js';
import { callPremiumAPI } from '../../services/premium.service.js';
import { POLICY_STATUS } from '../config/cron.config.js';
import logger from '../../utils/logger.js';

/**
 * Execute the Status Filter cron job
 * Finds policies where status = 'rating_pending'
 * Groups by product and calls premium API
 */
export const executeStatusFilterCron = async () => {
  const startTime = Date.now();
  let totalProcessed = 0;
  let totalUpdated = 0;
  let totalFailed = 0;

  try {
    // Step 1: Get policies with 'rating_pending' status
    const status = POLICY_STATUS.RATING_PENDING;

    logger.info('Fetching policies by status', {
      status,
      description: 'Status filter only (no date filter)'
    });

    const policies = await getPoliciesByStatus(status);

    logger.info('Retrieved policies for status processing', {
      totalPolicies: policies.length,
      status,
      distinctProducts: [...new Set(policies.map(p => p.productId))].length
    });

    if (policies.length === 0) {
      logger.info('No policies to process for status filter', {
        status
      });
      return {
        success: true,
        processed: 0,
        updated: 0,
        failed: 0,
        duration: Date.now() - startTime,
        status
      };
    }

    // Step 2: Group policies by product for efficient API calls
    const groupedPolicies = groupPoliciesByProduct(policies);

    logger.info('Policies grouped by product for status filter', {
      productGroups: Object.keys(groupedPolicies).length,
      groupDetails: Object.entries(groupedPolicies).map(([productId, group]) => ({
        productId,
        policyCount: group.policies.length,
        productName: group.product?.name || 'Unknown'
      }))
    });

    // Step 3: Process each product group
    for (const [productId, group] of Object.entries(groupedPolicies)) {
      const { product, policies: productPolicies } = group;

      logger.info('Processing product group for status filter', {
        productId,
        productName: product?.name || 'Unknown',
        policyCount: productPolicies.length,
        status
      });

      try {
        // Process all policies individually
        for (const policy of productPolicies) {
          try {
            const premium = await callPremiumAPI(policy);
            await updatePolicyPremium(policy.id, premium);

            totalUpdated++;
            totalProcessed++;

            logger.info('Policy processed successfully (status filter)', {
              policyId: policy.id,
              policyNumber: policy.policyNumber,
              productId,
              productName: product?.name,
              premium,
              status
            });
          } catch (error) {
            logger.error('Failed to process policy (status filter)', {
              policyId: policy.id,
              policyNumber: policy.policyNumber,
              productId,
              productName: product?.name,
              status,
              error: error.message
            });
            totalFailed++;
            totalProcessed++;
          }
        }

        logger.info('Product group processing completed (status filter)', {
          productId,
          productName: product?.name,
          status,
          totalPolicies: productPolicies.length,
          successful: totalUpdated,
          failed: totalFailed
        });

      } catch (error) {
        logger.error('Failed to process product group for status filter', {
          productId,
          productName: product?.name,
          policyCount: productPolicies.length,
          status,
          error: error.message,
          stack: error.stack
        });

        // Mark all policies in this group as failed
        totalFailed += productPolicies.length;
        totalProcessed += productPolicies.length;
      }
    }

    const duration = Date.now() - startTime;

    // Step 4: Final summary
    logger.info('Status Filter cron job completed', {
      summary: {
        status,
        totalProcessed,
        totalUpdated,
        totalFailed,
        successRate: totalProcessed > 0 ? ((totalUpdated / totalProcessed) * 100).toFixed(2) + '%' : '0%',
        duration: `${duration}ms`,
        averageTimePerPolicy: totalProcessed > 0 ? `${(duration / totalProcessed).toFixed(2)}ms` : '0ms'
      }
    });

    return {
      success: true,
      status,
      totalProcessed,
      totalUpdated,
      totalFailed,
      duration,
      successRate: totalProcessed > 0 ? (totalUpdated / totalProcessed) * 100 : 0
    };

  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error('Status Filter cron job failed', {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      processed: totalProcessed,
      updated: totalUpdated,
      failed: totalFailed,
      status: POLICY_STATUS.RATING_PENDING
    });

    throw error;
  }
};

