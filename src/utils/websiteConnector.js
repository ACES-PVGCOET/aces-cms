/**
 * ACES CMS — Main Website Connector & API Bridge
 * 
 * Provides decoupled export utilities, webhook synchronizers, and REST/GraphQL
 * payload formatters to connect CMS updates directly with the public ACES main website.
 */

export const ACES_PUBLIC_API_CONFIG = {
  mainSiteUrl: 'https://acesclub.org',
  apiEndpoint: 'https://api.acesclub.org/v1/sync',
  version: '2026.1-public',
};

/**
 * Format events specifically for the public ACES website schedule component
 */
export function formatPublicEvents(events = []) {
  return events.map((e) => ({
    id: e.id,
    overview: e.overview,
    description: e.description,
    terms: e.terms,
    reg_form_id: e.reg_form_id,
    banner_url: e.banner_url,
    isHighlight: e.isHighlight,
    syncTimestamp: new Date().toISOString(),
  }));
}

/**
 * Format member directory for the public ACES "Our Team" / "Guilds" page
 */
export function formatPublicMembers(members = []) {
  return members
    .filter((m) => m.status === 'ACTIVE' || m.status === 'Active')
    .map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      team: m.team,
      position: m.position || m.role || 'Member',
      status: m.status || 'ACTIVE',
      roles: m.roles || [],
      profile_photo_url: m.profile_photo_url || m.avatar || '',
      social_links: {
        instagram: m.social_links?.instagram || m.socials?.instagram || '',
        linkedin: m.social_links?.linkedin || m.socials?.linkedin || '',
        github: m.social_links?.github || m.socials?.github || '',
      },
    }));
}

/**
 * Format magazine archive for the public ACES "Magazines & Research" publication hub
 */
export function formatPublicMagazines(magazines = []) {
  return magazines.map((m) => ({
    id: m.id,
    title: m.title,
    edition: m.edition,
    academicYear: m.academicYear,
    coverImage: m.coverImage,
    publishedDate: m.publishedDate,
    editor: m.editor,
    pageCount: m.pageCount,
    pdfUrl: m.pdfUrl,
    description: m.description,
    tags: m.tags,
    featured: m.featured,
  }));
}

/**
 * Export CMS data to a downloadable JSON payload for manual website deployments
 */
export function downloadJSON(data, filename = 'aces-public-data-2026-27.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Simulate live sync to public ACES website
 */
export async function syncToPublicWebsite(payload) {
  // Simulates network latency and successful cloud payload broadcast
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        syncedAt: new Date().toLocaleTimeString(),
        recordsCount:
          (payload.events?.length || 0) +
          (payload.members?.length || 0) +
          (payload.magazines?.length || 0),
        statusText: 'Live CDN cache invalidated & refreshed with 2026-27 datasets',
      });
    }, 600);
  });
}
