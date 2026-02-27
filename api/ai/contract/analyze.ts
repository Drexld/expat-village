import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../../_lib/security';
import { analyzeContractData } from '../../_lib/data/aiData';
import { validateContractAnalyze } from '../../_lib/validation';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'ai_contract_analyze',
    requireAuth: true,
    validateBody: validateContractAnalyze,
    rateLimit: RATE_LIMIT_POLICIES.ai,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    return analyzeContractData(context.auth.userId!, context.body);
  },
);

export default handler;
