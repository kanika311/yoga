import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../lib/db";
import User from "../models/User";
import Program from "../models/Program";
import Blog from "../models/Blog";
import FAQ from "../models/FAQ";
import Testimonial from "../models/Testimonial";
import Page from "../models/Page";
import Settings from "../models/Settings";

config();

const img = {
  prenatal:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80",
  fertility:
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80",
  postnatal:
    "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1600&q=80",
  yogaStudio:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80",
  meditation:
    "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1600&q=80",
  nature:
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
  nutrition:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80",
  sleep:
    "https://images.unsplash.com/photo-1520206183501-b80df61043c2?auto=format&fit=crop&w=1600&q=80",
  founder:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
  t1: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  t2: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  t3: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
};

async function run() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Program.deleteMany({}),
    Blog.deleteMany({}),
    FAQ.deleteMany({}),
    Testimonial.deleteMany({}),
    Page.deleteMany({}),
    Settings.deleteMany({}),
  ]);

  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Admin@123", 10);
  await User.create({
    name: "MummaMove Admin",
    email: process.env.ADMIN_EMAIL || "admin@mummamove.com",
    password,
    role: "admin",
  });

  await Settings.create({
    siteName: "MummaMove",
    tagline: "Fertility | Preconception | Prenatal | Postnatal Holistic Healing, Tailored to You",
    email: "hr@mummamove.com",
    phone: "+91 9917580547",
    whatsapp: "919917580547",
    address: "A-43 Dheeraj Nagar, Yamuna Enclave, Faridabad, 121003",
    about:  
      "MummaMove is an online yoga training platform for prenatal, postnatal and therapeutic yoga sessions. We offer customized yoga with a holistic approach — integrating diet plans and lifestyle changes as per each client's body and health needs.",
    founderName: "Priya Sharma",
    founderBio:
      "Priya Sharma is a multifaceted expert in naturopathy, yoga, nutrition, and alternative therapies. She offers personalized guidance in diet and lifestyle changes. Together with her team, she has trained clients worldwide in prenatal, postnatal, and fertility yoga.",
    founderImage: img.founder,
    hours: "Online sessions by appointment — across 15+ time zones",
    social: {
      instagram: "https://www.instagram.com/mumma_move?igsi=cm04NGZldHhwcjBl&utm_source=qr",
      facebook: "https://www.facebook.com/share/1F2JsJna9K/?mibextid=wwXIfr",
      youtube: "https://youtube.com/@yogaforhealthylife-zf6rb?si=m-Kct9dCcJ7M8Obz",
    },
  });

  await Program.insertMany([
    {
      slug: "prenatal",
      title: "Pregnancy Care Program",
      subtitle: "First trimester to third trimester, tailored to you",
      excerpt:
        "Customized pregnancy yoga, diet and lifestyle counseling, plus childbirth and lactation prep — designed around your health status, body type and history of ailments.",
      description:
        "Because each pregnancy is unique, our online Pregnancy Care Program is built around you. Sessions adapt by trimester, medical history and comfort, combining yoga with diet counseling, lifestyle coaching, labor preparation and lactation readiness. Our team stays in touch during labor to guide you and your partner when it matters most.",
      image: img.prenatal,
      highlights: [
        "Free consultation and demo class",
        "Personal teacher + dietitian",
        "Labor and lactation preparation",
        "Couples labor readiness",
        "Support across 15 countries",
      ],
      benefits: [
        "Reduced pregnancy complications and anxiety",
        "Easier deliveries and higher chances of normal delivery",
        "Optimal baby birth position",
        "Increased physical stamina",
        "Mom is educated and prepared",
        "Support through uncertainty",
        "Preparation for postpartum recovery",
        "Lower potential risk for you and your baby",
      ],
      focusAreas: [
        "Trimester 2: flexibility, balance, pelvic floor, back pain, circulation",
        "Trimester 3: childbirth prep, stamina, ideal baby position, labor readiness",
      ],
      order: 1,
    },
    {
      slug: "fertility",
      title: "Fertility Rebalance Program",
      subtitle: "Naturally support reproductive health",
      excerpt:
        "Relaxation, pelvic circulation, weight management, fertility boosters, hormonal balance and improved blood flow — with yoga, diet and lifestyle counseling tailored to your needs.",
      description:
        "The Fertility Rebalance Program targets core fertility issues, prioritizing root-cause identification and holistic solutions. WHO research highlights ovulatory disorders (including PCOS and PCOD) and endometriosis among leading factors of female infertility. We personalize yoga, pranayama, meditation, nutrition and lifestyle work to your body and history.",
      image: img.fertility,
      highlights: [
        "Root-cause focused methodology",
        "Pranayama and meditation",
        "Dietitian-led nutrition",
        "Stress reduction techniques",
        "Complimentary trial session",
      ],
      benefits: [
        "Reduced stress and anxiety",
        "Increased circulation to the pelvic area",
        "Weight management",
        "Focus on fertility boosters",
        "Hormonal balance",
        "Improved blood circulation",
      ],
      focusAreas: [
        "Personalized approach",
        "Holistic wellness",
        "Expert guidance",
        "Lifestyle optimization",
        "Stress reduction",
        "Education and empowerment",
      ],
      order: 2,
    },
    {
      slug: "postnatal",
      title: "Postnatal Recovery Program",
      subtitle: "Restore body and mind after baby",
      excerpt:
        "Repair tissues, regain shape, manage hormonal mood swings and rebuild strength with tailored yoga, diet and lifestyle changes — scheduled around you and your baby.",
      description:
        "We understand the unique challenges and joys of motherhood. One-on-one postnatal sessions blend yoga with lifestyle adjustments, dietary guidance, lactation support and baby-growth advice. Choose times that work with your baby's schedule. The program aids tissue repair, core reconnection and emotional balance.",
      image: img.postnatal,
      highlights: [
        "One-on-one sessions on your schedule",
        "Pelvic floor and core restoration",
        "Lactation and baby support",
        "Nutrition and lifestyle coaching",
        "Serving clients in 15 countries",
      ],
      benefits: [
        "Strengthening of the pelvic floor",
        "Toning and weight management",
        "Helps knit back separated abdominal muscles",
        "Addresses specific pregnancy-related issues",
        "Reduction of postnatal anxiety and depression",
        "Promotes hormonal balance",
      ],
      focusAreas: [
        "Core strength and stability",
        "Pelvic floor health",
        "Posture correction",
        "Stress relief and relaxation",
        "Bonding and connection",
        "Energy restoration",
        "Flexibility and mobility",
      ],
      order: 3,
    },
  ]);

  await FAQ.insertMany([
    {
      question: "More details about the sessions?",
      answer:
        "Sessions are designed entirely around your schedule and preferences. We fine-tune each class to your health status, body type and medical history. Beyond yoga, you receive labor and birthing guidance, diet consultations and lifestyle modifications.",
      category: "general",
      order: 1,
    },
    {
      question: "How is MummaMove different from other prenatal yoga studios?",
      answer:
        "We take a holistic approach that extends far beyond the mat. Sessions are never generic — we work to address root causes. Trainers are certified, handpicked after a rigorous process, and supported by yoga experts, naturopaths, dietitians and birthing specialists.",
      category: "general",
      order: 2,
    },
    {
      question: "How are the sessions arranged?",
      answer:
        "We contact you to discuss health conditions and any ailments. That information helps us match you with the right trainer, design a customized session, and recommend diet and lifestyle changes. You also receive a free demo session so you can experience the approach first.",
      category: "general",
      order: 3,
    },
    {
      question: "What do prenatal sessions focus on?",
      answer:
        "Focus adapts by trimester and medical needs. Trimester 2 often covers flexibility, balance, stress, pelvic floor, back pain and circulation. Trimester 3 prepares the body for childbirth, builds stamina, supports ideal baby position and addresses complications with care.",
      category: "prenatal",
      order: 4,
    },
    {
      question: "What can I expect from prenatal sessions?",
      answer:
        "Clients often experience reduced complications, easier deliveries, optimal baby position, more stamina, higher chances of normal delivery, better education, support through uncertainty, postpartum preparation and lower potential risk for mother and baby.",
      category: "prenatal",
      order: 5,
    },
  ]);

  await Testimonial.insertMany([
    {
      name: "Ananya M.",
      role: "Pregnancy Care, Dubai",
      quote:
        "The one-on-one sessions felt like having a private teacher and a dietitian in the same room. I felt stronger, calmer, and far more prepared for labor.",
      image: img.t1,
      country: "UAE",
      rating: 5,
      order: 1,
    },
    {
      name: "Priya S.",
      role: "Fertility Rebalance, London",
      quote:
        "They looked at root causes, not just asanas. The combination of yoga, pranayama and nutrition coaching changed how I felt in my body.",
      image: img.t2,
      country: "UK",
      rating: 5,
      order: 2,
    },
    {
      name: "Meera K.",
      role: "Postnatal Recovery, Singapore",
      quote:
        "Classes flexed around my baby's naps. My core and pelvic floor came back slowly and safely, and the lactation guidance was a gift.",
      image: img.t3,
      country: "Singapore",
      rating: 5,
      order: 3,
    },
  ]);

  await Page.insertMany([
    {
      slug: "home",
      title: "Home",
      heroTitle: "Holistic Wellness Journey",
      heroSubtitle:
        "Fertility · Preconception · Prenatal · Postnatal — holistic healing, tailored to you.",
      heroImage:
        "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=2000&q=80",
    },
    {
      slug: "about",
      title: "About Us",
      heroTitle: "MummaMove's Trump Card",
      heroSubtitle: "Certified experts. Holistic methods. Personal care across 15 countries.",
      heroImage: img.yogaStudio,
      sections: [
        {
          heading: "Holistic Wellness Expertise",
          body: "Priya Sharma is a multifaceted expert in naturopathy, yoga, nutrition, and alternative therapies. She offers personalized guidance in diet and lifestyle changes.",
          image: img.founder,
        },
        {
          heading: "The MummaMove Advantage",
          body: "We are not just another online yoga class. Customized sessions integrate diet plans and lifestyle changes as per your body and health needs, with follow-up programs for lasting wellbeing.",
          image: img.nature,
        },
      ],
    },
  ]);

  await Blog.insertMany([
    {
      slug: "ultimate-guide-prenatal-yoga",
      title: "An ultimate guide on Prenatal Yoga",
      excerpt:
        "Pregnancy is a wonderful yet challenging experience, both physically and mentally. Prenatal yoga offers an excellent way to stay active with safety, breath and awareness.",
      image: img.prenatal,
      category: "Prenatal",
      content: `Pregnancy is a wonderful yet challenging experience, both physically and mentally. Prenatal yoga offers an excellent way to stay active, improve circulation, ease back pain and prepare the body for labor.

At MummaMove, sessions are never generic. We adapt asanas, breathing and rest to your trimester, body type and medical history. Combined with diet and lifestyle counseling, yoga becomes a complete pregnancy-care practice rather than a weekly stretch class.

Begin with a free consultation so we can understand your needs and match you with the right teacher.`,
    },
    {
      slug: "best-sleeping-postures-pregnancy",
      title: "Best sleeping postures during pregnancy",
      excerpt:
        "Sleeping during pregnancy can be challenging as the baby grows. The right posture, pillows and evening routine can restore rest.",
      image: img.sleep,
      category: "Prenatal",
      content: `Sleeping during pregnancy can be challenging due to the physical changes that occur in the body. As the baby grows, finding a comfortable position takes intention.

Left-side sleeping is often recommended to support circulation. A pillow between the knees and one behind the back can reduce hip strain. Evening pranayama and a consistent wind-down help the nervous system settle.

If sleep remains difficult, mention it in your session — we adjust restorative poses and lifestyle guidance accordingly.`,
    },
    {
      slug: "exercises-to-avoid-during-pregnancy",
      title: "Exercises to avoid during pregnancy",
      excerpt:
        "Staying active is important, but some movements are better skipped. Learn what to avoid and how personalized yoga keeps you safe.",
      image: img.yogaStudio,
      category: "Safety",
      content: `Staying active during pregnancy is important for both mother and baby. Exercise can improve circulation, reduce swelling and lift mood — yet certain movements increase risk.

Deep twists, intense core crunching, breath holds and overheating are typically avoided. Contact sports and unstable jumping are also best left out. The safer path is a teacher who knows your trimester and medical notes.

Our prenatal program replaces guesswork with a customized sequence for your body.`,
    },
    {
      slug: "what-isnt-safe-to-consume-pregnancy",
      title: "What isn't safe to consume during pregnancy",
      excerpt:
        "Pregnancy is a time to be extra careful about diet. A dietitian-led plan helps you eat well without unnecessary fear.",
      image: img.nutrition,
      category: "Nutrition",
      content: `Pregnancy is a time when women need to be extra careful about diet and lifestyle choices. A nourishing plate supports energy and baby's development, while a few items are commonly limited.

Alcohol, high-mercury fish, unpasteurized products and excess caffeine are typical examples your clinician may flag. Rather than a generic list, we work with a dietitian so guidance matches your culture, appetite and any ailments.

Lifestyle coaching sits alongside yoga so food, rest and movement work together.`,
    },
    {
      slug: "yoga-for-morning-sickness",
      title: "Yoga for pregnant women: easing morning sickness",
      excerpt:
        "If you're pregnant and struggling with morning sickness, gentle yoga and breathwork may help you feel more settled.",
      image: img.meditation,
      category: "Prenatal",
      content: `If you're pregnant and struggling with morning sickness, yoga might be just the thing you need to feel better. Slow breath, supported poses and avoiding an empty or overly full stomach can ease queasiness for many women.

We keep first-trimester sessions especially gentle: no overheating, plenty of rest, and options you can do at home between classes.

Book a free demo to feel the difference of a class designed around your symptoms, not a generic studio sequence.`,
    },
    {
      slug: "how-to-sleep-better-during-pregnancy",
      title: "How to sleep better during pregnancy",
      excerpt:
        "Practical tips for deeper rest — from evening routines to restorative yoga that prepares the nervous system for night.",
      image: img.nature,
      category: "Lifestyle",
      content: `Pregnancy is an exciting and challenging time, and sleep often takes the first hit. A calmer evening, cooler room, side-lying support and fewer screens can help.

We also teach restorative shapes and breathing that down-shift the nervous system. Combined with lifestyle coaching, better sleep becomes a practice, not a hope.

Reach out for a free consultation if rest is the issue you want to solve first.`,
    },
  ]);

  console.log("Seed complete.");
  console.log("Admin login:", process.env.ADMIN_EMAIL || "admin@mummamove.com");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
