import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../../_lib/security';
import { analyzeDocumentData } from '../../_lib/data/aiData';
import { validateDocumentAnalyze } from '../../_lib/validation';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'ai_document_analyze',
    requireAuth: true,
    validateBody: validateDocumentAnalyze,
    rateLimit: RATE_LIMIT_POLICIES.ai,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    return analyzeDocumentData(context.auth.userId!, context.body);
  },
);

export default handler;
