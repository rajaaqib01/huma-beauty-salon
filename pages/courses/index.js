import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import SEO from '../../components/SEO';
import CourseCard from '../../components/CourseCard';

export default function CoursesPage({ courses = [] }) {
  return (
    <>
      <SEO
        title="Beauty Courses Jhelum — Makeup, Hair & More | Huma Beauty Academy"
        description="Professional beauty courses in Jhelum — makeup, hair, facials, nails, mehndi, waxing & full diploma. Online admission with Upaisa payment."
        keywords="beauty course Jhelum, makeup course Pakistan, hair styling course, beauty academy Jhelum"
        canonical="https://humabeautysaloon.site/courses"
        ogImage="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80"
      />
      <Navbar />

      <main className="page-main">
        <section className="courses-hero">
          <div className="courses-hero-inner">
            <div className="section-label">✦ Huma Beauty Academy</div>
            <h1 className="courses-hero-title">Professional <em>Beauty Courses</em></h1>
            <p className="courses-hero-text">
              Learn makeup, hair, facials, nails, mehndi & waxing from expert trainers. Fill the online admission form and pay via Upaisa.
            </p>
            <Link href="/courses/apply" className="btn-rose courses-hero-cta">
              <span>Apply for Admission</span>
            </Link>
          </div>
        </section>

        <section className="courses-section">
          <div className="courses-container">
            {courses.length > 0 ? (
              <div className="offers-grid courses-grid">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="courses-empty">
                <h2>Courses Coming Soon</h2>
                <p>Admissions will open shortly. Contact us on WhatsApp for details.</p>
                <Link href="/contact" className="btn-outline">Contact Us</Link>
              </div>
            )}
          </div>
        </section>

        <section className="courses-cta">
          <div className="courses-cta-inner">
            <h2>Complete Beauty Diploma — All 7 in 1</h2>
            <p>Save more with our full diploma covering every module. Limited seats each batch.</p>
            <Link href="/courses/apply?course=full-diploma" className="btn-secondary">Apply for Full Diploma</Link>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export async function getServerSideProps() {
  try {
    const { getActiveCourses } = await import('../../lib/courses');
    const courses = await getActiveCourses();
    return { props: { courses } };
  } catch (e) {
    console.error('Courses page load error:', e);
    return { props: { courses: [] } };
  }
}
