import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import SEO from '../components/SEO';

const makeupServices = [
  { name: 'Everyday Makeup', desc: 'Fresh, natural makeup perfect for daily wear and casual occasions.', price: 'Rs. 3,000', badge: '', img: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80' },
  { name: 'Simple Party Makeup', desc: 'Elegant and subtle makeup for evening parties and casual gatherings.', price: 'Rs. 6,000', badge: '', img: 'https://i.pinimg.com/736x/e6/af/b9/e6afb9c6a80772b09996759f53c95442.jpg?w=600&q=80' },
  { name: 'Glam Party Makeup', desc: 'Bold, glamorous looks for special celebrations and events.', price: 'Rs. 8,000', badge: 'Trending', img: 'https://i.pinimg.com/736x/26/b4/3d/26b43dcf9d2c50d9ffdd4394608ca43a.jpg?w=600&q=80' },
  { name: 'Engagement Makeup', desc: 'Radiant, camera-ready looks for your special engagement day.', price: 'Rs. 8,000', badge: '', img: 'https://i.pinimg.com/736x/c6/17/c2/c617c29257fbaaf381ddb1f7b568fa94.jpg?w=600&q=80' },
  { name: 'HD Makeup', desc: 'High-definition makeup designed for photos, videos, and close-ups.', price: 'Rs. 10,000', badge: 'Popular', img: 'https://i.pinimg.com/736x/c4/a0/62/c4a062383b4900d59fcb94665361a9a7.jpg?w=600&q=80' },
  { name: 'Mehndi Makeup', desc: 'Beautiful, coordinated makeup for mehndi ceremonies and celebrations.', price: 'Rs. 10,000', badge: '', img: 'https://i.pinimg.com/736x/93/cc/ed/93ccedb118f1336dc9f09c0a56873e86.jpg?w=600&q=80' },
  { name: 'Bridal Makeup', desc: 'Flawless, long-lasting bridal looks tailored to your style and dress.', price: 'Rs. 18,000', badge: '', img: 'https://i.pinimg.com/1200x/22/8a/fd/228afd7f46f794cf0e8c2f11f19863ea.jpg?w=600&q=80' },
  { name: 'Luxury Bridal', desc: 'Premium, high-end bridal makeup with premium products and services.', price: 'Rs. 25,000', badge: 'Most Popular', img: 'https://i.pinimg.com/736x/c8/2a/24/c82a24c245509066b76b3dc347924b15.jpg?w=600&q=80' },
];
const hairServices = [
  { name: 'Hair Cut', desc: 'Precision haircuts tailored to your face shape and style.', price: 'Rs. 1,000', badge: '', img: 'https://i.pinimg.com/1200x/7e/ee/ce/7eeece0d44b374dfe75cc09232162440.jpg?w=600&q=80' },
  { name: 'Hair Spa', desc: 'Deep conditioning and scalp therapy to restore shine and bounce.', price: 'Rs. 3,500', badge: '', img: 'https://i.pinimg.com/1200x/83/08/ae/8308ae065f6981ce3716760be8124943.jpg?w=600&q=80' },
  { name: 'Hair Protein', desc: 'Protein treatment to strengthen hair and reduce breakage.', price: 'Rs. 8,000', badge: '', img: 'https://i.pinimg.com/1200x/4e/f4/a8/4ef4a87c4da99edefc6c7b97d173a5cc.jpg?w=600&q=80' },
  { name: 'Hair Color', desc: 'Full hair coloring services including fashion and natural shades.', price: 'Rs. 9,000', badge: '', img: 'https://i.pinimg.com/736x/30/76/97/30769764d31c49e940676ffb652d79be.jpg?w=600&q=80' },
  { name: 'Highlights', desc: 'Custom highlights and balayage for dimension and brightness.', price: 'Rs. 12,000', badge: '', img: 'https://i.pinimg.com/736x/56/4e/25/564e25677bf29e7689469546211441f4.jpg?w=600&q=80' },
  { name: 'Keratin Treatment', desc: 'Professional keratin smoothing for frizz-free, sleek hair.', price: 'Rs. 15,000', badge: 'Popular', img: 'https://i.pinimg.com/736x/03/69/81/036981fd429c8d3dd07c1c450cae0c13.jpg?w=600&q=80' },
  { name: 'Rebonding', desc: 'Chemical straightening treatment for permanently smooth hair.', price: 'Rs. 18,000', badge: '', img: 'https://i.pinimg.com/736x/57/16/42/571642770c4147fad0d25b1be91ad17d.jpg?w=600&q=80' },
  { name: 'Hair Botox', desc: 'Advanced restorative treatment to repair and rejuvenate hair.', price: 'Rs. 25,000', badge: 'Signature', img: 'https://i.pinimg.com/736x/70/42/e7/7042e76897c8be684370361200c0ccbd.jpg?w=600&q=80' },
];
const facialServices = [
  { name: 'Cleanup Facial', desc: 'Deep cleansing treatment to remove impurities and refresh your skin.', price: 'Rs. 2,000', badge: '', img: 'https://i.pinimg.com/1200x/cc/1a/4e/cc1a4e2f556732f7a884890488a64290.jpg?w=600&q=80' },
  { name: 'Basic Facial', desc: 'Classic facial treatment for maintaining healthy, glowing skin.', price: 'Rs. 2,500', badge: '', img: 'https://i.pinimg.com/736x/0b/dc/1b/0bdc1b13923be2b4686488a874f7b353.jpg?w=600&q=80' },
  { name: 'Whitening Facial', desc: 'Brighten and even skin tone with our signature treatment.', price: 'Rs. 4,500', badge: 'Popular', img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80' },
  { name: 'Gold Facial', desc: 'Luxurious gold-infused facial for radiant and youthful skin.', price: 'Rs. 5,500', badge: '', img: 'https://i.pinimg.com/1200x/86/24/96/86249669d6cb25d9dcc5053a8f22bd78.jpg?w=600&q=80' },
  { name: 'Hydra Facial', desc: 'Deep hydration and rejuvenation for plump, glowing skin.', price: 'Rs. 8,000', badge: 'Trending', img: 'https://i.pinimg.com/736x/8e/2b/0f/8e2b0f96ad3dacf95330a05ab6a13bd0.jpg?w=600&q=80' },
  { name: 'Acne Facial', desc: 'Specialized treatment to reduce acne, scars, and breakouts.', price: 'Rs. 5,000', badge: '', img: 'https://i.pinimg.com/736x/53/ac/8f/53ac8fd0ccc2939742e096c68e9c5867.jpg?w=600&q=80' },
  { name: 'Anti-Aging Facial', desc: 'Reduce fine lines and restore youthful radiance and firmness.', price: 'Rs. 7,000', badge: '', img: 'https://i.pinimg.com/736x/8b/67/46/8b6746d604826728cf433b1ed3d87cd7.jpg?w=600&q=80' },
  { name: 'Luxury Glow Facial', desc: 'Premium facial with exclusive products for ultimate luxury glow.', price: 'Rs. 10,000', badge: 'Bestseller', img: 'https://i.pinimg.com/1200x/25/a5/4b/25a54bd9f0bbb32608305d744d32c201.jpg?w=600&q=80' },
];
const mehndiServices = [
  { name: 'Simple Mehndi Design', desc: 'Delicate, minimal designs perfect for casual events.', price: 'Rs. 500', badge: '', img: 'https://i.pinimg.com/736x/2d/86/59/2d86596f9bbb18306ac58f16ac9baf17.jpg?w=600&q=80' },
  { name: 'Arabic Mehndi', desc: 'Bold, flowing Arabic-style designs for hands and feet.', price: 'Rs. 1,500', badge: '', img: 'https://i.pinimg.com/736x/c0/89/dd/c089dd6e28cf82bee8f288f5e2524012.jpg?w=600&q=80' },
  { name: 'Front Hand Mehndi', desc: 'Intricate front hand designs focused on the palm and fingers.', price: 'Rs. 1,000', badge: '', img: 'https://i.pinimg.com/736x/96/6d/13/966d1356f472a18f3ff0335bb1778611.jpg?w=600&q=80' },
  { name: 'Full Hand Mehndi', desc: 'Full hand coverage with detailed bridal-style patterns.', price: 'Rs. 3,000', badge: 'Popular', img: 'https://i.pinimg.com/1200x/ff/0d/36/ff0d36ac307e3915188f2176e577feec.jpg?w=600&q=80' },
  { name: 'Feet Mehndi', desc: 'Beautiful mehndi designs for the feet and ankles.', price: 'Rs. 2,000', badge: '', img: 'https://i.pinimg.com/736x/13/5c/f1/135cf18c303293ec0535d2a7009c93ab.jpg?w=600&q=80' },
  { name: 'Customized Mehndi Design', desc: 'Bespoke designs tailored to your theme and preference.', price: 'Rs. 5,000', badge: '', img: 'https://i.pinimg.com/1200x/09/81/38/098138407955270eb4d8f77764fb25e3.jpg?w=600&q=80' },
  { name: 'Bridal Mehndi', desc: 'Traditional bridal mehndi with elaborate motifs and shading.', price: 'Rs. 8,000', badge: 'Signature', img: 'https://i.pinimg.com/736x/f7/b1/bb/f7b1bba43a6f56718ea6c53382f51247.jpg?w=600&q=80' },
  { name: 'Royal Bridal Mehndi', desc: 'Opulent, full-coverage bridal mehndi fit for royalty.', price: 'Rs. 15,000', badge: 'Premium', img: 'https://i.pinimg.com/736x/d0/dd/44/d0dd448ae5bf5fefbfd638bcac805417.jpg?w=600&q=80' },
];
const nailServices = [
  { name: 'Simple Nail Paint', desc: 'Quick polish application in your chosen color for a neat look.', price: 'Rs. 500', badge: '', img: 'https://i.pinimg.com/736x/f5/7a/07/f57a0701d73af79030afb2626dd87f56.jpg?w=600&q=80' },
  { name: 'Gel Nail Paint', desc: 'Long-lasting gel polish cured under UV/LED for chip-free wear.', price: 'Rs. 1,500', badge: '', img: 'https://i.pinimg.com/736x/70/e8/84/70e8842c746f2324de6cc999635af132.jpg?w=600&q=80' },
  { name: 'Basic Nail Art', desc: 'Simple patterns and accents to elevate your manicure.', price: 'Rs. 2,000', badge: '', img: 'https://i.pinimg.com/736x/ba/c7/13/bac713cd26e263bb3304f83b08c733d9.jpg?w=600&q=80' },
  { name: 'French Nail Art', desc: 'Classic French tips with precise, elegant lines.', price: 'Rs. 2,500', badge: '', img: 'https://i.pinimg.com/736x/75/6b/5d/756b5d45954e544d534038a7e6c6af7d.jpg?w=600&q=80' },
  { name: 'Glitter Nail Art', desc: 'Sparkling glitter finishes and ombre glitter effects.', price: 'Rs. 3,000', badge: 'Trending', img: 'https://i.pinimg.com/736x/f7/95/8f/f7958f0b9053ff458e172eed9eff16fc.jpg?w=600&q=80' },
  { name: 'Acrylic Nails', desc: 'Durable acrylic sculpting for custom lengths and shapes.', price: 'Rs. 5,000', badge: 'Popular', img: 'https://i.pinimg.com/736x/ff/1c/89/ff1c89dbdd45c5bd3d51136db5526cb3.jpg?w=600&q=80' },
  { name: 'Extension Nails', desc: 'Premium nail extensions for a dramatic, long-lasting look.', price: 'Rs. 6,000', badge: '', img: 'https://i.pinimg.com/736x/9b/83/68/9b83681f352f4348e7151cf42cdaf574.jpg?w=600&q=80' },
  { name: 'Luxury Nail Art', desc: 'High-end, bespoke nail art with crystals and 3D elements.', price: 'Rs. 8,000', badge: 'Signature', img: 'https://i.pinimg.com/736x/35/a0/70/35a0708af3a2df55d13ffd773acef555.jpg?w=600&q=80' },
];
const waxingServices = [
  { name: 'Upper Lips', desc: 'Gentle threading to remove fine hair above the lip for a smooth finish.', price: 'Rs. 200', badge: '', img: 'https://i.pinimg.com/736x/a4/42/73/a44273bd520404bffe87317d0da80abf.jpg?w=600&q=80' },
  { name: 'Eyebrows', desc: 'Shaping and threading for clean, defined brows.', price: 'Rs. 300', badge: '', img: 'https://i.pinimg.com/1200x/4a/48/d2/4a48d247b442449c2bb7326f11ff93c4.jpg?w=600&q=80' },
  { name: 'Full Face Threading', desc: 'Complete facial threading for a flawless, hair-free complexion.', price: 'Rs. 800', badge: 'Quick', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80' },
  { name: 'Manicure', desc: 'Nail shaping, cuticle care and polish for neat, healthy hands.', price: 'Rs. 2,000', badge: '', img: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80' },
  { name: 'Pedicure', desc: 'Foot soak, exfoliation and polish for soft, refreshed feet.', price: 'Rs. 2,500', badge: '', img: 'https://i.pinimg.com/1200x/55/de/06/55de061932671b34b2e223fe8cf2e419.jpg?w=600&q=80' },
  { name: 'Full Body Wax', desc: 'Complete body waxing for long-lasting smoothness.', price: 'Rs. 7,000', badge: 'Popular', img: 'https://i.pinimg.com/736x/69/f1/54/69f154bc5b6378ee69796f6af7eb8b04.jpg?w=600&q=80' },
  { name: 'Arms Wax', desc: 'Quick and gentle waxing for arms.', price: 'Rs. 1,500', badge: '', img: 'https://i.pinimg.com/736x/4f/19/66/4f1966d3bfef8f939068ad2030505c43.jpg?w=600&q=80' },
  { name: 'Legs Wax', desc: 'Full leg waxing for smooth, touchable skin.', price: 'Rs. 2,000', badge: '', img: 'https://i.pinimg.com/1200x/b3/6e/de/b36ede5de0d8b0a9f5691a5490287bf1.jpg?w=600&q=80' },
];
const testimonials = [
  { name: 'Ayesha Khan', loc: 'Jhelum', text: 'I got my bridal makeup done here and it was absolutely stunning! The team understood exactly what I wanted. Highly recommended!', stars: 5, img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80' },
  { name: 'Sana Malik', loc: 'Rawalpindi', text: "Best salon in the area. The keratin treatment transformed my hair completely. I've been coming here for 2 years now.", stars: 5, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { name: 'Fatima Raza', loc: 'Jhelum', text: 'The facials here are divine! My skin has never looked this glowing. The atmosphere is so relaxing and luxurious.', stars: 5, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { name: 'Zara Ahmed', loc: 'Gujrat', text: 'Excellent nail art! The nail artist is so talented and creative. Got exactly the design I wanted for my engagement.', stars: 5, img: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&q=80' },
  { name: 'Hira Baig', loc: 'Jhelum', text: 'Very professional staff, hygienic environment and affordable prices for such premium quality services. My go-to salon!', stars: 5, img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80' },
  { name: 'Nadia Hussain', loc: 'Kharian', text: "The party makeup they did for my sister's wedding was breathtaking. Everyone kept asking who did her makeup!", stars: 5, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80' },
  { name: 'Amna Riaz', loc: 'Lahore', text: 'Friendly staff and immaculate service. My lashes look amazing and last for weeks!', stars: 5, img: 'https://images.unsplash.com/photo-1545996124-1f1f6d9f5a1f?w=100&q=80' },
  { name: 'Zainab Ali', loc: 'Islamabad', text: 'Lovely ambience and true professionals. My bridal mehndi was flawless and lasted beautifully.', stars: 5, img: 'https://images.unsplash.com/photo-1544005313-2f8b3b4b3a2d?w=100&q=80' },
];
const galleryImgs = [
  'https://i.pinimg.com/1200x/af/88/07/af88072fa63f949a9669269726f9b408.jpg?w=500&q=80',
  'https://i.pinimg.com/736x/19/89/8b/19898bfd41b6ecfa10e087f59a01881a.jpg?w=500&q=80',
  'https://i.pinimg.com/736x/2c/a0/25/2ca0258ddeef532121c97c579a897541.jpg?w=500&q=80',
  'https://i.pinimg.com/736x/07/39/5c/07395cba511b8dcfe1b993b645c07e1b.jpg?w=500&q=80',
  'https://i.pinimg.com/736x/7e/8e/eb/7e8eeb52eadb3c1eea9d404bc90aaa40.jpg?w=500&q=80',
  'https://i.pinimg.com/1200x/22/65/0d/22650dcdc244e1cb42899bb77471e3a2.jpg?w=500&q=80',
  'https://i.pinimg.com/736x/cf/ff/8f/cfff8f8efd176a29a621f4563d777013.jpg?w=500&q=80',
  'http://i.pinimg.com/736x/95/b8/af/95b8af746dfed667714b64f193504c51.jpg?w=500&q=80',
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&q=80',
];

const tiktokProfileLink = 'https://www.tiktok.com/@humabeautysaloonjhe';
const tiktokVideoEmbedUrl = 'https://www.tiktok.com/embed/v2/7631137952298454292';

function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <div className="service-card-img-wrap">
        <img src={service.img} alt={service.name} className="service-card-img" loading="lazy" />
        {service.badge && <span className="service-card-badge">{service.badge}</span>}
      </div>
      <div className="service-card-body">
        <div className="service-card-name">{service.name}</div>
        <div className="service-card-desc">{service.desc}</div>
        <div className="service-card-price">{service.price}</div>
        <div className="service-card-footer">
          <Link href={`/book?service=${encodeURIComponent(service.name)}&price=${encodeURIComponent(service.price)}`}>
            <button className="btn-rose btn-rose-small"><span>Book Now</span></button>
          </Link>
          <Link href="/contact" className="service-link">Enquire →</Link>
        </div>
      </div>
    </div>
  );
}

function ServiceSection({ id, label, title, italic, services, bg }) {
  return (
    <section id={id} style={{ background: bg, padding: '96px 5%' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="section-label">{label}</div>
        <h2 className="section-title">{title} <em>{italic}</em></h2>
        <div className="section-divider" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 28 }}>
          {services.map(s => <ServiceCard key={s.name} service={s} />)}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SEO
        title="Huma Beauty Saloon — Premium Beauty in Jhelum"
        description="Jhelum's most luxurious beauty salon. Expert bridal makeup, hair styling, facials, nail art and more."
        canonical="https://humabeautysaloon.site/"
        ogImage="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80"
      />
      <Navbar />
      <main className="page-main">

        {/* HERO */}
        <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600&q=90')" }} >
          <div className="hero-overlay" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-label">Welcome to</div>
              <h1>Huma <span>Beauty</span> Saloon</h1>
              <p className="hero-subtitle">Luxury beauty services crafted for your perfect moment</p>
              <p className="hero-text">We deliver bridal makeup, hair styling, facials, nails, and waxing with the same care, hygiene, and premium touch every time.</p>
              <div className="hero-ctas">
                <Link href="/book"><button className="btn-rose">✦ Book Appointment</button></Link>
                <Link href="/contact"><button className="btn-outline">Contact Us</button></Link>
              </div>
              <div className="hero-badges">
                <span>Bridal Specialist</span>
                <span>Clean Salon</span>
                <span>Fast WhatsApp Booking</span>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-tag">Quick Salon Guide</div>
              <h2>Book in 3 easy steps</h2>
              <ol className="hero-card-list">
                <li>Select the service you love</li>
                <li>Pick a convenient date & time</li>
                <li>Confirm instantly on WhatsApp</li>
              </ol>
              <a className="btn-secondary hero-card-whatsapp" href="https://wa.me/923355462214" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </div>
          </div>
          <div className="hero-scroll-tip">Scroll to explore</div>
        </section>

        {/* SERVICES */}
        <div id="services">
          <ServiceSection id="makeup" label="✦ Signature Services" title="Bridal &" italic="Party Makeup" services={makeupServices} bg="var(--cream)" />
          <ServiceSection id="hair" label="✦ Hair Studio" title="Hair Care &" italic="Styling" services={hairServices} bg="var(--champagne-pale)" />
          <ServiceSection id="facials" label="✦ Skincare Studio" title="Facials &" italic="Skin Treatments" services={facialServices} bg="var(--cream)" />
          <ServiceSection id="nails" label="✦ Nail Lounge" title="Nail Art &" italic="Lashes" services={nailServices} bg="var(--blush)" />
          <ServiceSection id="mehndi" label="✦ Mehndi Studio" title="Mehndi &" italic="Henna" services={mehndiServices} bg="var(--champagne-pale)" />
          <ServiceSection id="waxing" label="✦ Body Care" title="Waxing &" italic="Threading" services={waxingServices} bg="var(--cream)" />
        </div>

        {/* WHY US */}
        <section id="about" className="why-us-section">
          <div className="why-us-background-circle" />
          <div className="why-us-wrapper">
            <div className="section-label">✦ Our Promise</div>
            <h2 className="section-title" style={{ color: 'white' }}>Why Choose <em>Us</em></h2>
            <div className="section-divider" style={{ margin: '20px auto 52px' }} />
            <div className="why-us-cards">
              {[
                { icon: '✦', title: 'Expert Stylists', desc: 'Professionally trained artists with years of experience in bridal and beauty transformations.' },
                { icon: '◈', title: 'Premium Products', desc: 'We use only international-grade, skin-safe products from trusted beauty brands worldwide.' },
                { icon: '❋', title: 'Hygienic Environment', desc: 'Strict sanitization protocols ensure every tool and surface is impeccably clean and safe.' },
                { icon: '♡', title: 'Relaxing Atmosphere', desc: 'Escape into our serene, spa-like ambiance designed for total relaxation and comfort.' },
                { icon: '✿', title: 'Affordable Luxury', desc: 'Premium quality services at prices that make luxury accessible to every woman in Jhelum.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="why-us-card">
                  <div className="why-us-card-icon">{icon}</div>
                  <h3 className="why-us-card-title">{title}</h3>
                  <p className="why-us-card-text">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ background: 'var(--champagne-pale)', padding: '96px 5%' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <div className="section-label">✦ Client Love</div>
              <h2 className="section-title">What Our Clients <em>Say</em></h2>
              <div className="section-divider" style={{ margin: '20px auto' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-quote">"</div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-meta">
                    <img src={t.img} alt={t.name} className="testimonial-avatar" loading="lazy" />
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-loc">{t.loc}</div>
                    </div>
                    <div className="testimonial-stars">
                      {Array(t.stars).fill(0).map((_, j) => <span key={j}>★</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" style={{ background: 'var(--cream)', padding: '96px 5%' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="section-label">✦ Our Work</div>
                <h2 className="section-title">Instagram <em>Gallery</em></h2>
                <div className="section-divider" style={{ marginBottom: 0 }} />
              </div>
              <a href="https://www.instagram.com/huma_beauty.saloon/" target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--rose-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Follow @HumaBeauty →</a>
            </div>
            <div className="gallery-grid">
              {galleryImgs.map((src, i) => (
                <div key={i} className="gallery-item">
                  <img src={src} alt={`Gallery ${i + 1}`} className="gallery-img" loading="lazy" />
                  <div className="gallery-overlay">
                    <span>♡</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, alignItems: 'stretch' }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', background: 'white', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
                  <iframe
                    src={tiktokVideoEmbedUrl}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    title="Huma Beauty TikTok Video"
                  />
                </div>
              </div>
              <div style={{ borderRadius: 24, padding: '28px', background: 'white', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="section-label">TikTok</div>
                  <h3 style={{ margin: '16px 0 12px', fontSize: 'clamp(1.6rem, 2.2vw, 2rem)', lineHeight: 1.1 }}>Watch our latest TikTok beauty reel</h3>
                  <p style={{ color: 'var(--text-mid)', lineHeight: 1.8, marginBottom: 24 }}>See the newest transformation videos, makeup tips and salon highlights from Huma Beauty Salon.</p>
                </div>
                <a href={tiktokProfileLink} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 22px', borderRadius: 999, background: '#010101', color: 'white', textDecoration: 'none', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Visit TikTok Profile</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'linear-gradient(135deg, var(--rose-gold-dark), var(--rose-gold), var(--champagne))', padding: '80px 5%', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>Ready to Glow?</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white', fontWeight: 300, marginBottom: 16 }}>Book Your Beauty Experience Today</h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginBottom: 36, lineHeight: 1.7 }}>Whether it is a bridal transformation or a relaxing facial, our expert team is ready to make you feel extraordinary.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/book">
                <button style={{ background: 'white', color: 'var(--rose-gold-dark)', fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '15px 34px', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.3s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'none'}>✦ Book Appointment</button>
              </Link>
              <a href="https://wa.me/923355462214" target="_blank" rel="noreferrer" className="btn-secondary">WhatsApp Us</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
