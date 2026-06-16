import Link from 'next/link';

export default function CourseCard({ course }) {
  return (
    <article className="service-card course-card">
      <div className="service-card-img-wrap">
        <img src={course.img} alt={course.title} className="service-card-img" loading="lazy" />
        {course.badge ? <span className="course-card-badge">{course.badge}</span> : null}
        <span className="service-card-badge">{course.category}</span>
      </div>
      <div className="service-card-body">
        <div className="service-card-name">{course.title}</div>
        <div className="service-card-desc">{course.description}</div>
        <div className="course-card-meta">
          <span>⏱ {course.duration}</span>
          {course.seats ? <span>👥 {course.seats} seats</span> : null}
        </div>
        {course.syllabus?.length > 0 ? (
          <ul className="course-card-syllabus">
            {course.syllabus.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
            {course.syllabus.length > 4 ? <li>+ more topics</li> : null}
          </ul>
        ) : null}
        <div className="service-card-price">{course.fee}</div>
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
