import { PlaylistData } from '../types/video';

export const CATEGORIES = [
  'All',
  'Radio & mixtapes',
  'Travel & transit',
  'Folk & regional',
  'Classical & instrumental',
  'Nostalgia & retro',
  'Devotional & spiritual',
  'Ambient & mood'
] as const;

export type Category = typeof CATEGORIES[number];

export const PLAYLIST: PlaylistData = {
  title: "Curated Playlist Showcase",
  description: "A single curated sequence of independent web radio, audio playlists, and cultural soundscape sites.",
  videos: [
  {
    "id": "vid-01",
    "orderIndex": 1,
    "title": "Saloon WTF Radio",
    "externalLink": "https://saloon.wtf",
    "thumbnailUrl": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Radio & mixtapes",
    "accentColor": "#f59e0b"
  },
  {
    "id": "vid-02",
    "orderIndex": 2,
    "title": "DJ Rakesh Sound System",
    "externalLink": "https://djrakes.runable.site",
    "thumbnailUrl": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#ef4444"
  },
  {
    "id": "vid-03",
    "orderIndex": 3,
    "title": "Sangeet Classical Heritage",
    "externalLink": "https://sangeet.runable.site",
    "thumbnailUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Classical & instrumental",
    "accentColor": "#38bdf8"
  },
  {
    "id": "vid-04",
    "orderIndex": 4,
    "title": "Roadways Bus Express",
    "externalLink": "https://roadways.wtf",
    "thumbnailUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#10b981"
  },
  {
    "id": "vid-05",
    "orderIndex": 5,
    "title": "Safar-E-UP Highway Mixtape",
    "externalLink": "https://safar-e-up.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#eab308"
  },
  {
    "id": "vid-06",
    "orderIndex": 6,
    "title": "Horn OK Please Truck Vibe",
    "externalLink": "https://horn-ok-please-gray.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#f97316"
  },
  {
    "id": "vid-07",
    "orderIndex": 7,
    "title": "Safar FM Midnight Drive",
    "externalLink": "https://safarfm.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Radio & mixtapes",
    "accentColor": "#818cf8"
  },
  {
    "id": "vid-08",
    "orderIndex": 8,
    "title": "Chhath Puja Radio",
    "externalLink": "https://chhathpujaradio.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Devotional & spiritual",
    "accentColor": "#fb923c"
  },
  {
    "id": "vid-09",
    "orderIndex": 9,
    "title": "Seven Sisters FM",
    "externalLink": "https://seven-sisters-fm.pages.dev",
    "thumbnailUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Radio & mixtapes",
    "accentColor": "#34d399"
  },
  {
    "id": "vid-10",
    "orderIndex": 10,
    "title": "Haryana Roadways Express",
    "externalLink": "https://haryanaroadways.wtf",
    "thumbnailUrl": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#60a5fa"
  },
  {
    "id": "vid-11",
    "orderIndex": 11,
    "title": "Kassita Analog Mixtape",
    "externalLink": "https://kassita.xyz",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Radio & mixtapes",
    "accentColor": "#a78bfa"
  },
  {
    "id": "vid-12",
    "orderIndex": 12,
    "title": "Azaad Bharat Anthems",
    "externalLink": "https://azaad-bharat.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Devotional & spiritual",
    "accentColor": "#f43f5e"
  },
  {
    "id": "vid-13",
    "orderIndex": 13,
    "title": "Pind Radio Punjab",
    "externalLink": "https://pind-radio.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Radio & mixtapes",
    "accentColor": "#ca8a04"
  },
  {
    "id": "vid-14",
    "orderIndex": 14,
    "title": "Punjabi Wedding Dhol DJ",
    "externalLink": "https://punjabi-wedding-dj.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#ec4899"
  },
  {
    "id": "vid-15",
    "orderIndex": 15,
    "title": "Sharod Adda Kolkata Chai",
    "externalLink": "https://sharod-adda.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#065f46"
  },
  {
    "id": "vid-16",
    "orderIndex": 16,
    "title": "Sindhu Aamu Coastal Radio",
    "externalLink": "https://sindhuahamu.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Classical & instrumental",
    "accentColor": "#0284c7"
  },
  {
    "id": "vid-17",
    "orderIndex": 17,
    "title": "Durga Pujo Dhak Beats",
    "externalLink": "https://durgapujosong.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#dc2626"
  },
  {
    "id": "vid-18",
    "orderIndex": 18,
    "title": "Aakhri Jaam Late Night Ghazal",
    "externalLink": "https://aakhri-jaam.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Ambient & mood",
    "accentColor": "#831843"
  },
  {
    "id": "vid-19",
    "orderIndex": 19,
    "title": "Kalesh FM Desi Hip Hop",
    "externalLink": "https://kalesh-fm.pages.dev",
    "thumbnailUrl": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Ambient & mood",
    "accentColor": "#06b6d4"
  },
  {
    "id": "vid-20",
    "orderIndex": 20,
    "title": "Majdoor Folk Anthems",
    "externalLink": "https://majdoor-ashy.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#b45309"
  },
  {
    "id": "vid-21",
    "orderIndex": 21,
    "title": "Rearview Twilight Drive",
    "externalLink": "https://rearview-jade.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#64748b"
  },
  {
    "id": "vid-22",
    "orderIndex": 22,
    "title": "Kappiyum Paattum Kerala Rain",
    "externalLink": "https://kappiyumpaattum.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#047857"
  },
  {
    "id": "vid-23",
    "orderIndex": 23,
    "title": "Dhun Instrumental Sitar & Flute",
    "externalLink": "https://dhun.dploy.avichal.me",
    "thumbnailUrl": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Classical & instrumental",
    "accentColor": "#0284c7",
    "creator": "Avichal",
    "creatorUrl": "https://avichal.me"
  },
  {
    "id": "vid-24",
    "orderIndex": 24,
    "title": "Odia Old Album Songs",
    "externalLink": "https://sidd.app/odia-old-album-songs",
    "thumbnailUrl": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#ca8a04",
    "creator": "Siddharth",
    "creatorUrl": "https://sidd.app"
  },
  {
    "id": "vid-25",
    "orderIndex": 25,
    "title": "Truck Play GT Road",
    "externalLink": "https://truck-play.netlify.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#ea580c"
  },
  {
    "id": "vid-26",
    "orderIndex": 26,
    "title": "Indian Bus Songs",
    "externalLink": "http://indian-bus-songs.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#10b981"
  },
  {
    "id": "vid-27",
    "orderIndex": 27,
    "title": "Ilaiyaraaja Maestro Harmonies",
    "externalLink": "https://ilaya-raja.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Classical & instrumental",
    "accentColor": "#6366f1"
  },
  {
    "id": "vid-28",
    "orderIndex": 28,
    "title": "Chaiwala Morning Tea Radio",
    "externalLink": "https://chaiwala-ruby.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Ambient & mood",
    "accentColor": "#b45309"
  },
  {
    "id": "vid-29",
    "orderIndex": 29,
    "title": "Caravan Vintage Classics",
    "externalLink": "https://caravan.naveengumaste.me",
    "thumbnailUrl": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Nostalgia & retro",
    "accentColor": "#d97706",
    "creator": "Naveen Gumaste",
    "creatorUrl": "https://naveengumaste.me"
  },
  {
    "id": "vid-30",
    "orderIndex": 30,
    "title": "Mahashivratri Immersive Chants",
    "externalLink": "https://mahashivratri-immersive.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Devotional & spiritual",
    "accentColor": "#7c3aed"
  },
  {
    "id": "vid-31",
    "orderIndex": 31,
    "title": "Chhatt Sacred Sunrise",
    "externalLink": "https://chhatt.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Devotional & spiritual",
    "accentColor": "#f59e0b"
  },
  {
    "id": "vid-32",
    "orderIndex": 32,
    "title": "Bhakti Sagar Morning Prayers",
    "externalLink": "https://bhaktisagar.netlify.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Devotional & spiritual",
    "accentColor": "#fb923c"
  },
  {
    "id": "vid-33",
    "orderIndex": 33,
    "title": "90s TV Doordarshan Nostalgia",
    "externalLink": "https://90stv.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Nostalgia & retro",
    "accentColor": "#3b82f6"
  },
  {
    "id": "vid-34",
    "orderIndex": 34,
    "title": "Bhojpuri Raat Folk Rhythms",
    "externalLink": "https://bhojpuri-raat.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#b91c1c"
  },
  {
    "id": "vid-35",
    "orderIndex": 35,
    "title": "Safar FM Vol. 3",
    "externalLink": "https://safar-fm-three.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Radio & mixtapes",
    "accentColor": "#38bdf8"
  },
  {
    "id": "vid-36",
    "orderIndex": 36,
    "title": "Telugu Nostalgia Jnapakalu",
    "externalLink": "https://telugu-nostalgia-jnapakalu.netlify.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1609137144822-4a7dfbc15809?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#eab308"
  },
  {
    "id": "vid-37",
    "orderIndex": 37,
    "title": "Fibeats Lo-Fi Desi Beats",
    "externalLink": "https://ramslam007.github.io/fibeats",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Ambient & mood",
    "accentColor": "#8b5cf6",
    "creator": "ramslam007",
    "creatorUrl": "https://github.com/ramslam007"
  },
  {
    "id": "vid-38",
    "orderIndex": 38,
    "title": "UP Bus Driver Express",
    "externalLink": "https://upbusdriver.wtf",
    "thumbnailUrl": "https://images.unsplash.com/photo-1525962898597-a4ae6402826e?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#2563eb"
  },
  {
    "id": "vid-39",
    "orderIndex": 39,
    "title": "HRTC Mountain Bus Routes",
    "externalLink": "https://hrtcplaylist.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#059669"
  },
  {
    "id": "vid-40",
    "orderIndex": 40,
    "title": "Digital Bus Interstate Beats",
    "externalLink": "https://digitalbus.me",
    "thumbnailUrl": "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#0284c7"
  },
  {
    "id": "vid-41",
    "orderIndex": 41,
    "title": "Baraat Band Brass Trumpets",
    "externalLink": "https://baraat-band.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#e11d48"
  },
  {
    "id": "vid-42",
    "orderIndex": 42,
    "title": "Nostalgic List 90s Memories",
    "externalLink": "https://nostalgiclist.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Nostalgia & retro",
    "accentColor": "#ca8a04"
  },
  {
    "id": "vid-43",
    "orderIndex": 43,
    "title": "Scenote Ambient Soundscapes",
    "externalLink": "https://scenote.pages.dev",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Classical & instrumental",
    "accentColor": "#475569"
  },
  {
    "id": "vid-44",
    "orderIndex": 44,
    "title": "Musafir Acoustic Ballads",
    "externalLink": "https://musafir.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1445743432342-eac500ce72b7?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Ambient & mood",
    "accentColor": "#15803d"
  },
  {
    "id": "vid-45",
    "orderIndex": 45,
    "title": "Chhath Puja Devotional Archive",
    "externalLink": "https://chhathpuja-ten.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Devotional & spiritual",
    "accentColor": "#f97316"
  },
  {
    "id": "vid-46",
    "orderIndex": 46,
    "title": "UK Roadways Mountain Bus",
    "externalLink": "https://ukroadways.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#0d9488"
  },
  {
    "id": "vid-47",
    "orderIndex": 47,
    "title": "School Ke Baad 90s Afternoon",
    "externalLink": "https://schoolkebaad.fun",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Nostalgia & retro",
    "accentColor": "#3b82f6"
  },
  {
    "id": "vid-48",
    "orderIndex": 48,
    "title": "Train Window Sleeper Berth",
    "externalLink": "https://train.hereco.xyz",
    "thumbnailUrl": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#0284c7",
    "creator": "HereCo",
    "creatorUrl": "https://hereco.xyz"
  },
  {
    "id": "vid-49",
    "orderIndex": 49,
    "title": "Gali Old City Street Soul",
    "externalLink": "https://gali-roan.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Ambient & mood",
    "accentColor": "#b45309"
  },
  {
    "id": "vid-50",
    "orderIndex": 50,
    "title": "Woh Yaadein 2000s Pop",
    "externalLink": "https://wohyaadein.lovable.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Nostalgia & retro",
    "accentColor": "#ec4899"
  },
  {
    "id": "vid-51",
    "orderIndex": 51,
    "title": "Auto Waala City Rickshaw",
    "externalLink": "https://auto-waala-beta.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Travel & transit",
    "accentColor": "#eab308"
  },
  {
    "id": "vid-52",
    "orderIndex": 52,
    "title": "Bartan Wali Sunday Kitchen",
    "externalLink": "https://bartan-wali-playlist.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Nostalgia & retro",
    "accentColor": "#64748b"
  },
  {
    "id": "vid-53",
    "orderIndex": 53,
    "title": "Conductor FM Whistle & Beats",
    "externalLink": "https://conductor-fm.nikhilkumar007.com",
    "thumbnailUrl": "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Radio & mixtapes",
    "accentColor": "#10b981",
    "creator": "Nikhil Kumar",
    "creatorUrl": "https://nikhilkumar007.com"
  },
  {
    "id": "vid-54",
    "orderIndex": 54,
    "title": "Padayappa Superstar Elevation",
    "externalLink": "https://padayappa.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Ambient & mood",
    "accentColor": "#f59e0b"
  },
  {
    "id": "vid-55",
    "orderIndex": 55,
    "title": "Mehfil Midnight Classical",
    "externalLink": "https://mehfil-wtf.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Classical & instrumental",
    "accentColor": "#831843"
  },
  {
    "id": "vid-56",
    "orderIndex": 56,
    "title": "Cutting Shop Salon Melodies",
    "externalLink": "http://cuttingshop.lol",
    "thumbnailUrl": "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Nostalgia & retro",
    "accentColor": "#d97706"
  },
  {
    "id": "vid-57",
    "orderIndex": 57,
    "title": "Mi Marathi Natya Sangeet",
    "externalLink": "https://mi-marathi.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#ca8a04"
  },
  {
    "id": "vid-58",
    "orderIndex": 58,
    "title": "Desi Radio Transistor",
    "externalLink": "https://site-final-lyart.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1593078166039-c9878df5c520?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Radio & mixtapes",
    "accentColor": "#0284c7"
  },
  {
    "id": "vid-59",
    "orderIndex": 59,
    "title": "Desi Gym Akhada Workout",
    "externalLink": "https://desi-gym.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Ambient & mood",
    "accentColor": "#dc2626"
  },
  {
    "id": "vid-60",
    "orderIndex": 60,
    "title": "90s Hits Golden Era",
    "externalLink": "https://90s-hits.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Nostalgia & retro",
    "accentColor": "#f59e0b"
  },
  {
    "id": "vid-61",
    "orderIndex": 61,
    "title": "Calm Waiting Ambient Rain",
    "externalLink": "https://calm-dental-waiting.lovable.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Ambient & mood",
    "accentColor": "#38bdf8"
  },
  {
    "id": "vid-62",
    "orderIndex": 62,
    "title": "Chhath Geet Folk Archive",
    "externalLink": "https://chhath-geet.netlify.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Devotional & spiritual",
    "accentColor": "#ea580c"
  },
  {
    "id": "vid-63",
    "orderIndex": 63,
    "title": "Nani Ka Ghar Childhood Vacation",
    "externalLink": "https://nani-ka-ghar.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Nostalgia & retro",
    "accentColor": "#f97316"
  },
  {
    "id": "vid-64",
    "orderIndex": 64,
    "title": "Sukoon Acoustic Peace",
    "externalLink": "https://sukoon-old-songs.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Ambient & mood",
    "accentColor": "#34d399"
  },
  {
    "id": "vid-65",
    "orderIndex": 65,
    "title": "Chhath Music Holy Arghya",
    "externalLink": "https://chhath-music.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Devotional & spiritual",
    "accentColor": "#fb923c"
  },
  {
    "id": "vid-66",
    "orderIndex": 66,
    "title": "Deshbhakti Patriotic Radio",
    "externalLink": "https://deshbhaktiradio.netlify.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Devotional & spiritual",
    "accentColor": "#2563eb"
  },
  {
    "id": "vid-67",
    "orderIndex": 67,
    "title": "Woh Din Retro Days",
    "externalLink": "https://www.wohdin.xyz",
    "thumbnailUrl": "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Nostalgia & retro",
    "accentColor": "#818cf8"
  },
  {
    "id": "vid-68",
    "orderIndex": 68,
    "title": "Bhojpuri Folk Melodies",
    "externalLink": "https://bhojpuri.cfd",
    "thumbnailUrl": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#b91c1c"
  },
  {
    "id": "vid-69",
    "orderIndex": 69,
    "title": "Timro Acoustic Mountain Guitar",
    "externalLink": "https://timro.fun",
    "thumbnailUrl": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#059669"
  },
  {
    "id": "vid-70",
    "orderIndex": 70,
    "title": "Rajasthani Heritage Desert Sarangi",
    "externalLink": "https://rajasthani-heritage.vercel.app",
    "thumbnailUrl": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=75&fm=webp",
    "category": "Folk & regional",
    "accentColor": "#d97706"
  }
]
};

