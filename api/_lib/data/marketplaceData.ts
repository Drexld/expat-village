import type {
  MarketplaceCreateListingInput,
  MarketplaceInterestInput,
  MarketplaceReviewInput,
} from '../validation';
import type { MarketplaceListingSummary, MarketplaceReview } from '../../../src/services/api/types';
import { supabaseInsert, supabaseSelect, supabaseUpsert } from './supabaseRest';

interface MarketplaceListingRow {
  id: string;
  user_id: string;
  title: string;
  price: number;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  description: string;
  distance_text?: string | null;
  images_count?: number | null;
  escrow_available?: boolean | null;
  has_ar?: boolean | null;
  featured?: boolean | null;
  ai_scam_score?: number | null;
  created_at: string;
}

interface MarketplaceReviewRow {
  id: string;
  listing_id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
}

interface UserRow {
  id: string;
  display_name: string;
}

interface ListingFilters {
  query?: string;
  category?: string;
}

function formatRelativeTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'recently';
  const diffMs = Date.now() - date.getTime();
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;

  if (diffMs < hourMs) return 'just now';
  if (diffMs < dayMs) {
    const h = Math.max(1, Math.floor(diffMs / hourMs));
    return `${h} hour${h === 1 ? '' : 's'} ago`;
  }
  const d = Math.max(1, Math.floor(diffMs / dayMs));
  return `${d} day${d === 1 ? '' : 's'} ago`;
}

function matchesListingFilters(listing: MarketplaceListingSummary, filters: ListingFilters): boolean {
  const q = (filters.query || '').trim().toLowerCase();
  const category = (filters.category || '').trim().toLowerCase();

  if (q) {
    const haystack = `${listing.title} ${listing.description} ${listing.category}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (category && listing.category.toLowerCase() !== category) return false;
  return true;
}

export async function getMarketplaceListingsData(
  filters: ListingFilters = {},
): Promise<MarketplaceListingSummary[]> {
  const [listings, users, reviews] = await Promise.all([
    supabaseSelect<MarketplaceListingRow>(
      'marketplace_listings',
      'id,user_id,title,price,category,condition,description,distance_text,images_count,escrow_available,has_ar,featured,ai_scam_score,created_at',
      {
        limit: 500,
        orderBy: 'created_at',
        ascending: false,
        filters: [{ column: 'active', op: 'eq', value: true }],
      },
    ),
    supabaseSelect<UserRow>('users', 'id,display_name', {
      limit: 2000,
      orderBy: 'created_at',
      ascending: false,
    }),
    supabaseSelect<MarketplaceReviewRow>(
      'marketplace_reviews',
      'id,listing_id,user_id,rating,body,created_at',
      {
        limit: 10000,
        orderBy: 'created_at',
        ascending: false,
      },
    ),
  ]);

  if (!listings.length) {
    return [];
  }

  const userById = new Map(users.map((user) => [user.id, user.display_name]));
  const ownerByListingId = new Map(listings.map((listing) => [listing.id, listing.user_id]));

  const sellerStats = new Map<string, { sum: number; count: number }>();
  reviews.forEach((review) => {
    const ownerId = ownerByListingId.get(review.listing_id);
    if (!ownerId) return;
    const current = sellerStats.get(ownerId) || { sum: 0, count: 0 };
    sellerStats.set(ownerId, { sum: current.sum + Number(review.rating || 0), count: current.count + 1 });
  });

  const mapped: MarketplaceListingSummary[] = listings.map((listing) => {
    const sellerName = userById.get(listing.user_id) || 'Expat Seller';
    const stats = sellerStats.get(listing.user_id) || { sum: 0, count: 0 };
    const trustScore = stats.count ? Number((stats.sum / stats.count).toFixed(1)) : 5;
    const aiScamScore = Number(listing.ai_scam_score ?? 10);
    return {
      id: listing.id,
      title: listing.title,
      price: Number(listing.price),
      category: listing.category,
      condition: listing.condition || 'Good',
      seller: {
        name: sellerName,
        trustScore,
        reviews: stats.count,
        verified: true,
      },
      distance: listing.distance_text || 'Nearby',
      postedAt: formatRelativeTime(listing.created_at),
      images: Number(listing.images_count || 1),
      description: listing.description,
      hasAR: Boolean(listing.has_ar),
      escrowAvailable: listing.escrow_available !== false,
      featured: Boolean(listing.featured),
      aiScamScore,
      aiScamSource: 'rule-engine-v1',
      aiScamConfidence: Number((1 - Math.min(aiScamScore, 100) / 200).toFixed(2)),
    };
  });

  return mapped.filter((listing) => matchesListingFilters(listing, filters));
}

interface InsertedListingRow {
  id: string;
  user_id: string;
  title: string;
  price: number;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  description: string;
  distance_text?: string | null;
  images_count?: number | null;
  escrow_available?: boolean | null;
  has_ar?: boolean | null;
  featured?: boolean | null;
  ai_scam_score?: number | null;
  created_at: string;
}

export async function createMarketplaceListingData(
  userId: string,
  input: MarketplaceCreateListingInput,
): Promise<MarketplaceListingSummary> {
  const rows = await supabaseInsert<
    {
      user_id: string;
      title: string;
      price: number;
      category: string;
      condition: 'Good';
      description: string;
      escrow_available: boolean;
      ai_scam_score: number;
    },
    InsertedListingRow
  >(
    'marketplace_listings',
    {
      user_id: userId,
      title: input.title,
      price: input.price,
      category: input.category,
      condition: 'Good',
      description: input.description,
      escrow_available: input.escrowRequested !== false,
      ai_scam_score: 10,
    },
    { returning: 'representation' },
  );

  const row = rows[0];
  if (!row) {
    throw new Error('Listing was not created');
  }

  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    category: row.category,
    condition: row.condition || 'Good',
    seller: { name: 'You', trustScore: 5, reviews: 0, verified: true },
    distance: row.distance_text || 'Nearby',
    postedAt: formatRelativeTime(row.created_at),
    images: Number(row.images_count || 1),
    description: row.description,
    hasAR: Boolean(row.has_ar),
    escrowAvailable: row.escrow_available !== false,
    featured: Boolean(row.featured),
    aiScamScore: Number(row.ai_scam_score ?? 10),
    aiScamSource: 'rule-engine-v1',
    aiScamConfidence: 0.95,
  };
}

export async function createMarketplaceInterestData(
  userId: string,
  listingId: string,
  input: MarketplaceInterestInput,
): Promise<void> {
  await supabaseUpsert(
    'marketplace_interests',
    {
      user_id: userId,
      listing_id: listingId,
      mode: input.mode,
      created_at: new Date().toISOString(),
    },
    {
      onConflict: 'listing_id,user_id',
    },
  );
}

interface InsertedMarketplaceReviewRow {
  id: string;
  listing_id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
}

export async function createMarketplaceReviewData(
  userId: string,
  listingId: string,
  input: MarketplaceReviewInput,
): Promise<MarketplaceReview> {
  const rows = await supabaseInsert<
    {
      user_id: string;
      listing_id: string;
      rating: number;
      body: string;
    },
    InsertedMarketplaceReviewRow
  >(
    'marketplace_reviews',
    {
      user_id: userId,
      listing_id: listingId,
      rating: input.rating,
      body: input.body,
    },
    { returning: 'representation' },
  );

  const row = rows[0];
  if (!row) {
    throw new Error('Review was not created');
  }

  return {
    id: row.id,
    listingId: row.listing_id,
    userId: row.user_id,
    rating: Number(row.rating),
    body: row.body,
    createdAt: row.created_at,
  };
}
