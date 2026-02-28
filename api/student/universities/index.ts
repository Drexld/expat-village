import { RATE_LIMIT_POLICIES, methodNotAllowed, withSecurity } from '../../_lib/security';
import {
  createStudentUniversityData,
  getStudentUniversitiesData,
} from '../../_lib/data/studentData';
import { validateStudentUniversityCreate } from '../../_lib/validation';

export const config = {
  runtime: 'edge',
};

const readHandler = withSecurity(
  {
    routeId: 'student_universities_list',
    requireAuth: false,
    rateLimit: RATE_LIMIT_POLICIES.read,
  },
  async (request) => {
    if (request.method !== 'GET') {
      throw methodNotAllowed();
    }

    return getStudentUniversitiesData();
  },
);

const writeHandler = withSecurity(
  {
    routeId: 'student_universities_create',
    requireAuth: true,
    validateBody: validateStudentUniversityCreate,
    rateLimit: RATE_LIMIT_POLICIES.write,
  },
  async (request, context) => {
    if (request.method !== 'POST') {
      throw methodNotAllowed();
    }

    await createStudentUniversityData(context.auth.userId!, context.body);
    return null;
  },
);

export default async function routeHandler(request: Request): Promise<Response> {
  if (request.method === 'GET') return readHandler(request);
  if (request.method === 'POST') return writeHandler(request);
  return readHandler(request);
}
