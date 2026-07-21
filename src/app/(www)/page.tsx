import { Metadata } from 'next';

import {
  generatePageMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/common/tools/seo';

import { IntroSection } from '@/modules/homepage/components/intro-section';
import { VisualCrafts } from '@/modules/homepage/components/visual-crafts';

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
    <div className="pt-16 pb-32">
      <div className="container-wide">
        <div className="max-w-(--content-width)">
          <IntroSection />
        </div>
      </div>
      <VisualCrafts />
    </div>
  );
}
