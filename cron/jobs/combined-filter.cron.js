import { getPoliciesByStatusAndLapsedDate, groupPoliciesByProduct, updatePolicyPremium } from '../../services/policy.service.js';
import { callPremiumAPI } from '../../services/premium.service.js';
import { POLICY_STATUS } from '../config/cron.config.js';
import { calculateTPlus90Date, formatDateForQuery } from '../utils/cron-helpers.js';
import { CRON_SETTINGS } from '../config/cron.config.js';
import logger from '../../utils/logger.js';

/**
 * Execute the Combined Filter cron job
 * Finds policies where status = 'rating_pending' AND policy_lapsed = T+90
 * Groups by product and calls premium API
 */
export const executeCombinedFilterCron = async () => {
  const startTime = Date.now();
  let totalProcessed = 0;
  let totalUpdated = 0;
  let totalFailed = 0;

  try {
    // Step 1: Calculate T+90 date
    const targetDate = calculateTPlus90Date();
    const formattedDate = formatDateForQuery(targetDate);
    const status = POLICY_STATUS.RATING_PENDING;

    logger.info('Calculating combined filter parameters', {
      targetDate: formattedDate,
      daysFromNow: CRON_SETTINGS.DAYS_OFFSET,
      status,
      description: 'Combined filter: status = rating_pending AND policy_lapsed = T+90'
    });

    // Step 2: Get policies with both conditions
    const policies = await getPoliciesByStatusAndLapsedDate(status, targetDate);

    logger.info('Retrieved policies for combined filter processing', {
      totalPolicies: policies.length,
      status,
      targetDate: formattedDate,
      distinctProducts: [...new Set(policies.map(p => p.productId))].length
    });

    if (policies.length === 0) {
      logger.info('No policies to process for combined filter', {
        status,
        targetDate: formattedDate
      });
      return {
        success: true,
        processed: 0,
        updated: 0,
        failed: 0,
        duration: Date.now() - startTime,
        status,
        targetDate: formattedDate
      };
    }

    // Step 3: Group policies by product for efficient API calls
    const groupedPolicies = groupPoliciesByProduct(policies);

    logger.info('Policies grouped by product for combined filter', {
      productGroups: Object.keys(groupedPolicies).length,
      groupDetails: Object.entries(groupedPolicies).map(([productId, group]) => ({
        productId,
        policyCount: group.policies.length,
        productName: group.product?.name || 'Unknown'
      }))
    });

    // Step 4: Process each product group
    for (const [productId, group] of Object.entries(groupedPolicies)) {
      const { product, policies: productPolicies } = group;

      logger.info('Processing product group for combined filter', {
        productId,
        productName: product?.name || 'Unknown',
        policyCount: productPolicies.length,
        status,
        targetDate: formattedDate
      });

      try {
        // Process all policies individually
        for (const policy of productPolicies) {
          try {
            const premium = await callPremiumAPI(policy);
            await updatePolicyPremium(policy.id, premium);

            totalUpdated++;
            totalProcessed++;

            logger.info('Policy processed successfully (combined filter)', {
              policyId: policy.id,
              policyNumber: policy.policyNumber,
              productId,
              productName: product?.name,
              premium,
              status,
              targetDate: formattedDate
            });
          } catch (error) {
            logger.error('Failed to process policy (combined filter)', {
              policyId: policy.id,
              policyNumber: policy.policyNumber,
              productId,
              productName: product?.name,
              status,
              targetDate: formattedDate,
              error: error.message
            });
            totalFailed++;
            totalProcessed++;
          }
        }

        logger.info('Product group processing completed (combined filter)', {
          productId,
          productName: product?.name,
          status,
          targetDate: formattedDate,
          totalPolicies: productPolicies.length,
          successful: totalUpdated,
          failed: totalFailed
        });

      } catch (error) {
        logger.error('Failed to process product group for combined filter', {
          productId,
          productName: product?.name,
          policyCount: productPolicies.length,
          status,
          targetDate: formattedDate,
          error: error.message,
          stack: error.stack
        });

        // Mark all policies in this group as failed
        totalFailed += productPolicies.length;
        totalProcessed += productPolicies.length;
      }
    }

    const duration = Date.now() - startTime;

    // Step 5: Final summary
    logger.info('Combined Filter cron job completed', {
      summary: {
        status,
        targetDate: formattedDate,
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
      targetDate: formattedDate,
      totalProcessed,
      totalUpdated,
      totalFailed,
      duration,
      successRate: totalProcessed > 0 ? (totalUpdated / totalProcessed) * 100 : 0
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    const targetDate = calculateTPlus90Date();
    const formattedDate = formatDateForQuery(targetDate);

    logger.error('Combined Filter cron job failed', {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      processed: totalProcessed,
      updated: totalUpdated,
      failed: totalFailed,
      status: POLICY_STATUS.RATING_PENDING,
      targetDate: formattedDate
    });

    throw error;
  }
};

