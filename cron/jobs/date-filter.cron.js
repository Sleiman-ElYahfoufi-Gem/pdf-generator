import { getPoliciesByLapsedDate, groupPoliciesByProduct, updatePolicyPremium } from '../../services/policy.service.js';
import { callPremiumAPI } from '../../services/premium.service.js';
import { calculateTPlus90Date, formatDateForQuery } from '../utils/cron-helpers.js';
import { CRON_SETTINGS } from '../config/cron.config.js';
import logger from '../../utils/logger.js';

/**
 * Execute the Date Filter cron job (T+90)
 * Finds policies where policy_lapsed = current_date + 90 days
 * Groups by product and calls premium API
 */
export const executeDateFilterCron = async () => {
  const startTime = Date.now();
  let totalProcessed = 0;
  let totalUpdated = 0;
  let totalFailed = 0;

  try {
    // Step 1: Calculate T+90 date
    const targetDate = calculateTPlus90Date();
    const formattedDate = formatDateForQuery(targetDate);

    logger.info('Calculated T+90 date', {
      targetDate: formattedDate,
      daysFromNow: CRON_SETTINGS.DAYS_OFFSET
    });

    // Step 2: Get policies with T+90 lapsed date
    const policies = await getPoliciesByLapsedDate(targetDate);

    logger.info('Retrieved policies for T+90 processing', {
      totalPolicies: policies.length,
      targetDate: formattedDate,
      distinctProducts: [...new Set(policies.map(p => p.productId))].length
    });

    if (policies.length === 0) {
      logger.info('No policies to process for T+90 date');
      return {
        success: true,
        processed: 0,
        updated: 0,
        failed: 0,
        duration: Date.now() - startTime
      };
    }

    // Step 3: Group policies by product for efficient API calls
    const groupedPolicies = groupPoliciesByProduct(policies);

    logger.info('Policies grouped by product', {
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

      logger.info('Processing product group', {
        productId,
        productName: product?.name || 'Unknown',
        policyCount: productPolicies.length
      });

      try {
        // Process all policies individually
        for (const policy of productPolicies) {
          try {
            const premium = await callPremiumAPI(policy);
            await updatePolicyPremium(policy.id, premium);

            totalUpdated++;
            totalProcessed++;

            logger.info('Policy processed successfully', {
              policyId: policy.id,
              policyNumber: policy.policyNumber,
              productId,
              productName: product?.name,
              premium
            });
          } catch (error) {
            logger.error('Failed to process policy', {
              policyId: policy.id,
              policyNumber: policy.policyNumber,
              productId,
              productName: product?.name,
              error: error.message
            });
            totalFailed++;
            totalProcessed++;
          }
        }

        logger.info('Product group processing completed', {
          productId,
          productName: product?.name,
          totalPolicies: productPolicies.length,
          successful: totalUpdated,
          failed: totalFailed
        });

      } catch (error) {
        logger.error('Failed to process product group', {
          productId,
          productName: product?.name,
          policyCount: productPolicies.length,
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
    logger.info('Date Filter (T+90) cron job completed', {
      summary: {
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
      targetDate: formattedDate,
      totalProcessed,
      totalUpdated,
      totalFailed,
      duration,
      successRate: totalProcessed > 0 ? (totalUpdated / totalProcessed) * 100 : 0
    };

  } catch (error) {
    const duration = Date.now() - startTime;

    logger.error('Date Filter (T+90) cron job failed', {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
      processed: totalProcessed,
      updated: totalUpdated,
      failed: totalFailed
    });

    throw error;
  }
};

