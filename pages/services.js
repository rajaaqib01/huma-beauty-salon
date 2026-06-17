import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';
import ServiceSection from '../components/ServiceSection';
import MakeupServiceSection from '../components/MakeupServiceSection';
import ServicesPageHero from '../components/ServicesPageHero';
import { SERVICE_SECTIONS } from '../lib/serviceConfig';

const GROUPED_SECTION_IDS = ['makeup', 'hair', 'facials', 'nails', 'mehndi', 'waxing'];

export default function ServicesPage({
  groupedServices = {},
  makeupGroups = [],
  hairGroups = [],
  facialGroups = [],
  nailsGroups = [],
  mehndiGroups = [],
  waxingGroups = [],
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  const groupedBySectionId = useMemo(() => ({
    makeup: makeupGroups,
    hair: hairGroups,
    facials: facialGroups,
    nails: nailsGroups,
    mehndi: mehndiGroups,
    waxing: waxingGroups,
  }), [makeupGroups, hairGroups, facialGroups, nailsGroups, mehndiGroups, waxingGroups]);

  const sectionsWithServices = useMemo(
    () => SERVICE_SECTIONS.filter((section) => {
      if (GROUPED_SECTION_IDS.includes(section.id)) {
        return groupedBySectionId[section.id]?.some((g) => g.services?.length > 0);
      }
      return groupedServices[section.id]?.length > 0;
    }),
    [groupedServices, groupedBySectionId]
  );

  const visibleSections = useMemo(() => {
    if (activeTab === 'all') return sectionsWithServices;
    return sectionsWithServices.filter((section) => section.id === activeTab);
  }, [activeTab, sectionsWithServices]);

  useEffect(() => {
    if (!router.isReady) return;
    const hash = String(router.asPath.split('#')[1] || '').trim();
    if (!hash || hash === 'all') {
      setActiveTab('all');
      return;
    }
    if (sectionsWithServices.some((section) => section.id === hash)) {
      setActiveTab(hash);
    }
  }, [router.isReady, router.asPath, sectionsWithServices]);

  const hasServices = sectionsWithServices.length > 0;

  return (
    <>
      <SEO
        title="Beauty Services Jhelum — Bridal Makeup & More | Huma Beauty Saloon"
        description="Bridal makeup Jhelum, hair styling, hydra facial, nail art, mehndi & waxing at Huma Beauty Saloon. Premium salon services in Main Market Jhelum."
        keywords="bridal makeup Jhelum, beauty services Jhelum, hair salon Jhelum, facial Jhelum"
        canonical="https://humabeautysaloon.site/services"
        ogImage="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80"
      />
      <Navbar />

      <main className="page-main">
        <ServicesPageHero />

        {hasServices ? (
          <div id="services">
              {visibleSections.map((section) => {
                if (GROUPED_SECTION_IDS.includes(section.id)) {
                  return (
                    <MakeupServiceSection
                      key={section.id}
                      id={section.id}
                      label={section.label}
                      title={section.title}
                      italic={section.italic}
                      groupedServices={groupedBySectionId[section.id] || []}
                      bg={section.bg}
                    />
                  );
                }
                return (
                  <ServiceSection
                    key={section.id}
                    id={section.id}
                    label={section.label}
                    title={section.title}
                    italic={section.italic}
                    services={groupedServices[section.id] || []}
                    bg={section.bg}
                  />
                );
              })}
          </div>
        ) : (
          <section className="services-page-empty-wrap">
            <div className="services-page-empty">
              <div className="services-page-empty-icon">✦</div>
              <h2>Services Coming Soon</h2>
              <p>Our service list is being updated. Please contact us or book a consultation.</p>
              <div className="services-page-empty-actions">
                <Link href="/contact" className="btn-rose"><span>Contact Us</span></Link>
                <Link href="/book" className="btn-outline">Book Appointment</Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const {
      getGroupedServices,
      getMakeupGroupedBySubcategory,
      getHairGroupedBySubcategory,
      getFacialGroupedBySubcategory,
      getNailsGroupedBySubcategory,
      getMehndiGroupedBySubcategory,
      getWaxingGroupedBySubcategory,
    } = await import('../lib/services');
    const [
      groupedServices,
      makeupGroups,
      hairGroups,
      facialGroups,
      nailsGroups,
      mehndiGroups,
      waxingGroups,
    ] = await Promise.all([
      getGroupedServices(),
      getMakeupGroupedBySubcategory(),
      getHairGroupedBySubcategory(),
      getFacialGroupedBySubcategory(),
      getNailsGroupedBySubcategory(),
      getMehndiGroupedBySubcategory(),
      getWaxingGroupedBySubcategory(),
    ]);
    return {
      props: {
        groupedServices,
        makeupGroups,
        hairGroups,
        facialGroups,
        nailsGroups,
        mehndiGroups,
        waxingGroups,
      },
    };
  } catch (e) {
    console.error('Services page load error:', e);
    const empty = {};
    for (const section of SERVICE_SECTIONS) empty[section.id] = [];
    return {
      props: {
        groupedServices: empty,
        makeupGroups: [],
        hairGroups: [],
        facialGroups: [],
        nailsGroups: [],
        mehndiGroups: [],
        waxingGroups: [],
      },
    };
  }
}
