import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../../_lib/security';
import { getStudentDiscountsData } from '../../_lib/data/studentData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'student_discounts_list',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getStudentDiscountsData();
  },
);

export default handler;
