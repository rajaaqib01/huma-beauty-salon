import Link from 'next/link';

export default function CourseCard({ course }) {
  return (
    <article className="service-card course-card course-card--full">
      <div className="service-card-img-wrap">
        <img src={course.img} alt={course.title} className="service-card-img" loading="lazy" />
        {course.discount ? <span className="offer-discount-badge">{course.discount}</span> : null}
        {course.badge ? <span className="course-card-badge">{course.badge}</span> : null}
      </div>
      <div className="service-card-body course-card-body">
        <div className="service-card-name">{course.title}</div>
        {course.description ? (
          <div className="service-card-desc course-card-desc">{course.description}</div>
        ) : null}
        <div className="course-card-meta">
          {course.duration ? <span>⏱ {course.duration}</span> : null}
          {course.seats ? <span>👥 {course.seats} seats</span> : null}
        </div>
        {course.syllabus?.length > 0 ? (
          <div className="course-card-syllabus-wrap">
            <div className="course-card-syllabus-title">What you will learn</div>
            <ul className="course-card-syllabus">
              {course.syllabus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {course.fee ? (
          <div className="service-card-price course-card-price">
            {course.hasDiscount ? (
              <>
                <span className="service-card-price-old">{course.originalFee}</span>
                {course.fee}
              </>
            ) : (
              course.fee
            )}
          </div>
        ) : null}
        <div className="service-card-footer">
          <Link
            href={`/courses/apply?course=${encodeURIComponent(course.slug)}`}
            className="btn-rose btn-rose-small"
          >
            <span>Apply Now</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
