import type { ServiceReview, ServiceReviewInput, ServiceSummary } from '../../../src/services/api/types';
import { supabaseInsert, supabaseSelect } from './supabaseRest';

interface ServiceRow {
  id: string;
  name: string;
  district?: string | null;
  verified?: boolean | null;
  category_id?: string | null;
  metadata?: {
    expatScore?: number;
  } | null;
}

interface ServiceCategoryRow {
  id: string;
  name: string;
}

interface ServiceReviewRow {
  id: string;
  service_id: string;
  user_id: string;
  rating: number;
  title?: string | null;
  body: string;
  tags?: string[] | null;
  created_at: string;
}

interface ServiceSearchParams {
  query?: string;
  category?: string;
  district?: string;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function fallbackServices(): ServiceSummary[] {
  return [
    {
      id: 'fallback-service-1',
      name: 'mBank',
      category: 'Banks',
      district: 'Centrum',
      verified: true,
      expatScore: 4.8,
    },
    {
      id: 'fallback-service-2',
      name: 'LegalExpat Warsaw',
      category: 'Immigration Lawyers',
      district: 'Srodmiescie',
      verified: true,
      expatScore: 4.9,
    },
    {
      id: 'fallback-service-3',
      name: 'Expat Dental Care',
      category: 'Health',
      district: 'Mokotow',
      verified: true,
      expatScore: 4.6,
    },
  ];
}

function matchesFilters(service: ServiceSummary, filters: ServiceSearchParams): boolean {
  const query = filters.query ? normalizeText(filters.query) : '';
  const category = filters.category ? normalizeText(filters.category) : '';
  const district = filters.district ? normalizeText(filters.district) : '';

  if (query) {
    const haystack = `${service.name} ${service.category} ${service.district || ''}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  if (category && !service.category.toLowerCase().includes(category)) return false;
  if (district && !(service.district || '').toLowerCase().includes(district)) return false;
  return true;
}

export async function getServicesData(filters: ServiceSearchParams = {}): Promise<ServiceSummary[]> {
  const [services, categories] = await Promise.all([
    supabaseSelect<ServiceRow>('services', 'id,name,district,verified,category_id,metadata', {
      limit: 1000,
      orderBy: 'updated_at',
      ascending: false,
    }),
    supabaseSelect<ServiceCategoryRow>('service_categories', 'id,name', {
      limit: 200,
      orderBy: 'name',
      ascending: true,
    }),
  ]);

  if (!services.length) {
    return fallbackServices().filter((service) => matchesFilters(service, filters));
  }

  const categoryById = new Map(categories.map((category) => [category.id, category.name]));
  const mapped: ServiceSummary[] = services.map((service) => ({
    id: service.id,
    name: service.name,
    category: categoryById.get(service.category_id || '') || 'General',
    district: service.district || undefined,
    verified: Boolean(service.verified),
    expatScore:
      typeof service.metadata?.expatScore === 'number'
        ? Number(service.metadata.expatScore)
        : undefined,
  }));

  return mapped.filter((service) => matchesFilters(service, filters));
}

export async function createServiceCheckinData(serviceId: string, userId: string): Promise<void> {
  const created = await supabaseInsert<
    {
      service_id: string;
      user_id: string;
      checked_in_at: string;
    },
    { id: string }
  >(
    'service_checkins',
    {
      service_id: serviceId,
      user_id: userId,
      checked_in_at: new Date().toISOString(),
    },
    { returning: 'representation' },
  );

  const checkinId = created[0]?.id;
  if (!checkinId) return;

  await supabaseInsert('review_prompts', {
    checkin_id: checkinId,
    user_id: userId,
    service_id: serviceId,
    prompt_status: 'pending',
    due_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  });
}

export async function getServiceReviewsData(serviceId: string): Promise<ServiceReview[]> {
  const rows = await supabaseSelect<ServiceReviewRow>(
    'service_reviews',
    'id,service_id,user_id,rating,title,body,tags,created_at',
    {
      limit: 200,
      orderBy: 'created_at',
      ascending: false,
      filters: [{ column: 'service_id', op: 'eq', value: serviceId }],
    },
  );

  return rows.map((row) => ({
    id: row.id,
    serviceId: row.service_id,
    userId: row.user_id,
    rating: Number(row.rating),
    title: row.title || undefined,
    body: row.body,
    tags: row.tags || [],
    createdAt: row.created_at,
  }));
}

interface InsertedServiceReviewRow {
  id: string;
  service_id: string;
  user_id: string;
  rating: number;
  title?: string | null;
  body: string;
  tags?: string[] | null;
  created_at: string;
}

export async function createServiceReviewData(
  serviceId: string,
  userId: string,
  input: ServiceReviewInput,
): Promise<ServiceReview> {
  const rows = await supabaseInsert<
    {
      service_id: string;
      user_id: string;
      rating: number;
      title?: string;
      body: string;
      tags: string[];
    },
    InsertedServiceReviewRow
  >(
    'service_reviews',
    {
      service_id: serviceId,
      user_id: userId,
      rating: input.rating,
      title: input.title,
      body: input.body,
      tags: input.tags || [],
    },
    { returning: 'representation' },
  );

  const row = rows[0];
  if (!row) {
    return {
      id: `service-review-${Date.now()}`,
      serviceId,
      userId,
      rating: input.rating,
      title: input.title,
      body: input.body,
      tags: input.tags || [],
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: row.id,
    serviceId: row.service_id,
    userId: row.user_id,
    rating: Number(row.rating),
    title: row.title || undefined,
    body: row.body,
    tags: row.tags || [],
    createdAt: row.created_at,
  };
}
