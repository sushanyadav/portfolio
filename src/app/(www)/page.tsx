import { Metadata } from 'next';

import {
  generatePageMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/common/tools/seo';

import { Hero } from '@/modules/homepage/components/hero';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `${SITE_NAME} - ${SITE_DESCRIPTION}`,
    description: SITE_DESCRIPTION,
    path: '',
    type: 'website',
  });
}

export default function Homepage() {
  return (
    <div className="grid place-items-center">
      <Hero />
    </div>
  );
}
