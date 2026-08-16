import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/index.js';
import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import type { IEvent } from '../models/Event.js';

const daysFromNow = (days: number, hour = 6): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
};

const IMG = {
  run: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80',
  nightRun: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  yoga: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=1200&q=80',
  strength: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
  trek: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80',
  marathon: 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=1200&q=80',
};

const baseEvents: IEvent[] = [
  {
    title: '5K Dawn Run — Tank Bund',
    tagline: 'Start the day faster than yesterday.',
    description:
      'An 8-week streak runner. Meet at the Tank Bund steps at first light. We warm up together, run a flat 5K along Hussain Sagar, and finish with chai and conversation. No matter your pace — if you show up, you belong.',
    category: 'Run Club',
    images: [IMG.run],
    startDate: daysFromNow(4),
    endDate: null,
    startTime: '05:30',
    endTime: '07:30',
    location: {
      name: 'Tank Bund Steps',
      address: 'Tank Bund Road, Hussain Sagar, Hyderabad',
      mapsUrl: 'https://maps.google.com/?q=Tank+Bund+Hyderabad',
    },
    registrationFee: { amount: 0, currency: 'INR', url: 'https://example.com/register/5k-dawn' },
    capacity: 100,
    thingsToBring: ['Running shoes', 'Water bottle', 'Light layers — it gets warm fast'],
    dos: ['Arrive 15 minutes early for the warm-up', 'Hydrate before you arrive'],
    donts: ['No headphones during the group run', 'No chip timing drama — it is a community run'],
    contacts: [
      { name: 'Arjun Rao', role: 'Run Lead', phone: '+91 90000 00001' },
      { name: 'Meera Nair', role: 'Community', email: 'meera@thepointone.club' },
    ],
  },
  {
    title: 'Ananthagiri Weekend Trek',
    tagline: '40 hillside kilometres of discipline.',
    description:
      'A two-day overnight trek through Ananthagiri forest. Long ascent on day one, a sunrise summit on day two. Physical endurance is the entry point — the group mindset gets you to the top.',
    category: 'Trek',
    images: [IMG.trek],
    startDate: daysFromNow(18),
    endDate: daysFromNow(19),
    startTime: '06:00',
    endTime: '18:00',
    location: {
      name: 'Ananthagiri Hills',
      address: 'Vikarabad, Telangana',
      mapsUrl: 'https://maps.google.com/?q=Ananthagiri+Hills',
    },
    registrationFee: { amount: 1200, currency: 'INR', url: 'https://example.com/register/trek' },
    capacity: 25,
    thingsToBring: ['Trekking shoes', 'Rain cover', 'Sunscreen & cap', 'Personal medication'],
    dos: ['Carry at least 2L of water', 'Stick with your group leader'],
    donts: ['No single-use plastic on the trail', 'No splitting from the group'],
    contacts: [{ name: 'Kabir Singh', role: 'Trek Lead', phone: '+91 90000 00002' }],
  },
  {
    title: 'Sunrise Vinyasa — KBR Park',
    tagline: 'Breath before burn.',
    description:
      'A flowing 60-minute vinyasa practice under the KBR canopy. Beginners welcome — every pose has a modification. We close with pranayama and a short breathwork circle.',
    category: 'Yoga',
    images: [IMG.yoga],
    startDate: daysFromNow(0),
    endDate: daysFromNow(2),
    startTime: '06:00',
    endTime: '07:15',
    location: {
      name: 'KBR Park Entrance',
      address: 'Kasu Brahmananda Reddy National Park, Jubilee Hills',
      mapsUrl: 'https://maps.google.com/?q=KBR+National+Park+Hyderabad',
    },
    registrationFee: { amount: 0, currency: 'INR', url: 'https://example.com/register/sunrise-yoga' },
    capacity: 40,
    thingsToBring: ['Yoga mat', 'Towel', 'Water'],
    dos: ['Practice on an empty stomach', 'Arrive for a silent 5-minute settle-in'],
    donts: ['No phones on the mat', 'No late entries after the opening circle'],
    contacts: [{ name: 'Ananya Iyer', role: 'Yoga Lead', phone: '+91 90000 00003' }],
  },
  {
    title: 'Strength Under the Sun — Gymkhana Ground',
    tagline: 'Discipline is the real weight.',
    description:
      'A functional strength circuit at the Gymkhana ground. Calisthenics, kettlebells and bodyweight stations coached in small crews. Leave your ego at the gate.',
    category: 'Strength',
    images: [IMG.strength],
    startDate: daysFromNow(-6),
    endDate: null,
    startTime: '06:30',
    endTime: '08:00',
    location: {
      name: 'Secunderabad Gymkhana Ground',
      address: 'Secunderabad',
      mapsUrl: 'https://maps.google.com/?q=Gymkhana+Ground+Secunderabad',
    },
    registrationFee: { amount: 300, currency: 'INR', url: 'https://example.com/register/strength' },
    capacity: 50,
    thingsToBring: ['Gym gloves', 'Towel', 'Water bottle'],
    dos: ['Warm up with the crew', 'Log your sets with your partner'],
    donts: ['No ego lifting', 'No phones between stations'],
    contacts: [{ name: 'Vikram Reddy', role: 'Strength Coach', phone: '+91 90000 00004' }],
  },
  {
    title: 'Hyderabad 10K Night Run',
    tagline: 'The city sleeps. We run.',
    description:
      'A 10K night loop through the illuminated city. Pacers from 5:30/km to 8:00/km. Ends with a finish-line brunch and a circle where first-timers get the loudest cheers.',
    category: 'Run Club',
    images: [IMG.nightRun],
    startDate: daysFromNow(-21),
    endDate: null,
    startTime: '21:00',
    endTime: '23:30',
    location: {
      name: 'Necklace Road',
      address: 'Necklace Road, Hussain Sagar',
      mapsUrl: 'https://maps.google.com/?q=Necklace+Road+Hyderabad',
    },
    registrationFee: { amount: 500, currency: 'INR', url: 'https://example.com/register/night-10k' },
    capacity: 200,
    thingsToBring: ['Reflective gear', 'Headlamp', 'Post-run change of clothes'],
    dos: ['Run with a pacer group', 'Carry your bib visibly'],
    donts: ['No street crossings outside marshal points', 'No casual walkers in the fast lanes'],
    contacts: [
      { name: 'Sana Khan', role: 'Race Director', phone: '+91 90000 00005' },
      { name: 'Arjun Rao', role: 'Run Lead', phone: '+91 90000 00001' },
    ],
  },
  {
    title: 'Hyderabad Marathon Prep Block',
    tagline: '12 weeks to a PB.',
    description:
      'A structured 12-week build-up for your next marathon. Weekly long runs, tempo sessions and a strength block — all coached, all accountable. We started with one goal: finish what you start.',
    category: 'Hybrid',
    images: [IMG.marathon],
    startDate: daysFromNow(30),
    endDate: daysFromNow(115),
    startTime: '05:00',
    endTime: '07:00',
    location: {
      name: 'People’s Plaza',
      address: 'Necklace Road, Hussain Sagar',
      mapsUrl: 'https://maps.google.com/?q=Peoples+Plaza+Hyderabad',
    },
    registrationFee: { amount: 2500, currency: 'INR', url: 'https://example.com/register/marathon-block' },
    capacity: 60,
    thingsToBring: ['Training log', 'Running shoes (road)', 'Compression gear'],
    dos: ['Show up to every session — consistency is the point', 'Report injuries early'],
    donts: ['No skipping the cooldown', 'No unplanned race-pace heroics'],
    contacts: [
      { name: 'Kabir Singh', role: 'Head Coach', phone: '+91 90000 00002' },
      { name: 'Meera Nair', role: 'Programme Ops', email: 'meera@thepointone.club' },
    ],
  },
];

async function seedAdmin() {
  const existingByUsername = await User.findOne({ username: env.admin.username.toLowerCase() });
  if (existingByUsername) {
    console.log(`[seed] admin already present: ${env.admin.username}`);
    return;
  }

  const existingByEmail = await User.findOne({ email: env.admin.email.toLowerCase() });
  if (existingByEmail) {
    existingByEmail.username = env.admin.username.toLowerCase();
    await existingByEmail.save();
    console.log(`[seed] admin updated: ${env.admin.username}`);
    return;
  }

  await User.create({
    name: env.admin.name,
    username: env.admin.username,
    email: env.admin.email,
    passwordHash: env.admin.password,
    role: 'admin',
  });
  console.log(`[seed] admin created: ${env.admin.username}`);
}

async function seedEvents() {
  await Event.deleteMany({});
  const docs = await Event.insertMany(baseEvents);
  console.log(`[seed] inserted ${docs.length} events`);
}

async function seedDemoUser() {
  const username = 'demo';
  const existing = await User.findOne({ username });
  if (existing) {
    console.log(`[seed] demo user already present: ${username}`);
    return;
  }
  await User.create({
    name: 'Demo Member',
    username,
    email: 'demo@thepointone.club',
    passwordHash: 'demo2024',
    role: 'user',
  });
  console.log(`[seed] demo user created: ${username}`);
}

async function run() {
  await connectDB(env.mongoUri);
  await seedAdmin();
  await seedDemoUser();
  await seedEvents();
  await disconnectDB();
  console.log('[seed] done');
}

run().catch((err) => {
  console.error('[seed] failed', err);
  process.exit(1);
});
