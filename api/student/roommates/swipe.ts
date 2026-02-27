import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../../_lib/security';
import { validateStudentRoommateSwipe } from '../../_lib/validation';
import { swipeStudentRoommateData } from '../../_lib/data/studentData';

export const config = {
  runtime: 'edge',
};

const handler = withSecurity(
  {
    routeId: 'student_roommate_swipe',
    requireAuth: true,
    validateBody: validateStudentRoommateSwipe,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    await swipeStudentRoommateData(context.auth.userId!, context.body);
    return null;
  },
);

export default handler;
