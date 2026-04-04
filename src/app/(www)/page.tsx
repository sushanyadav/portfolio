import { Metadata } from 'next';

import {
  generatePageMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/common/tools/seo';

import { IntroSection } from '@/modules/homepage/components/intro-section';
import { RecentCrafts } from '@/modules/homepage/components/recent-crafts';
import { RecentThoughts } from '@/modules/homepage/components/recent-thoughts';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    path: '',
    type: 'website',
  });
}

export default function Homepage() {
  return (
    <div className="container pt-16 pb-32">
      <IntroSection />
      <RecentThoughts />
      <RecentCrafts />
    </div>
  );
}
