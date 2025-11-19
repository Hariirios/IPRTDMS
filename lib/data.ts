export interface Event {
  id: string;
  title: string;
  titleSo: string;
  titleAr?: string;
  description: string;
  descriptionSo: string;
  descriptionAr?: string;
  fullDescription: string;
  fullDescriptionSo: string;
  fullDescriptionAr?: string;
  date: string;
  location: string;
  locationSo: string;
  locationAr?: string;
  speakers: string[];
  image: string;
  isPast: boolean;
  isFree: boolean;
  price?: number;
}

export interface Service {
  id: string;
  title: string;
  titleSo: string;
  description: string;
  descriptionSo: string;
  fullDescription: string;
  fullDescriptionSo: string;
  icon: string;
  mentors: Mentor[];
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  roleSo: string;
  bio: string;
  bioSo: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  roleSo: string;
  rating: number;
  feedback: string;
  feedbackSo: string;
  serviceType: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: "Mindfulness and Stress Management Workshop",
    titleSo: "Aqoon-kororsiga Miyir-qabashada iyo Maaraynta Walbahaarka",
    description: "Learn practical techniques to manage stress and cultivate mindfulness in daily life.",
    descriptionSo: "Baro hab-dhaqanno wax ku ool ah oo lagu maareyo walbahaarka oo lagu kormeero miyir-qabashada nolol maalmeedka.",
    fullDescription: "Join us for an interactive workshop where you'll learn evidence-based mindfulness techniques and stress management strategies. This session will include guided meditation, breathing exercises, and practical tools you can use immediately in your daily life. Perfect for anyone feeling overwhelmed or seeking better emotional balance.",
    fullDescriptionSo: "Nagu soo biir aqoon-kororsi wada-shaqayn leh halkaas oo aad ka baran doonto farsamooyinka miyir-qabashada caddaynta ku salaysan iyo xeeladaha maaraynta walbahaarka. Kulankan wuxuu ku jiri doonaa duceyn la hagayo, jimicsiyada neefsashada, iyo qalabka wax ku oolka ah oo aad si degdeg ah ugu isticmaali karto nolol maalmeedkaaga. Wuxuu ku habboon yahay qof kasta oo dareemaya inuu ku dhacay culays ama raadinaya miisaaminta dareenka ee ka fiican.",
    date: "2025-11-05",
    location: "Jigjiga Yar Community Center",
    locationSo: "Xarunta Bulshada Jigjiga Yar",
    speakers: ["Dr. Amina Hassan", "Mohamed Abdi"],
    image: "https://images.unsplash.com/photo-1635545999375-057ee4013deb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5kZnVsbmVzcyUyMHlvZ2ElMjB3ZWxsbmVzc3xlbnwxfHx8fDE3NjA5ODYyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isPast: false,
    isFree: false,
    price: 25
  },
  {
    id: "2",
    title: "Building Resilient Communities",
    titleSo: "Dhisidda Bulshooyin Adag",
    description: "Community event focused on fostering resilience and collective mental wellness.",
    descriptionSo: "Dhacdo bulsheed oo diirada saareysa kobcinta adkaanshaha iyo caafimaadka maskaxeed ee wadajirka ah.",
    fullDescription: "A community gathering to discuss and develop strategies for building resilience in our neighborhoods. We'll explore how community support, shared experiences, and collective action can strengthen our mental health. Open to community leaders, families, and anyone interested in community wellness.",
    fullDescriptionSo: "Isu-imaatin bulsheed si looga wada-hadlo oo loo horumariyo xeelado lagu dhisayo adkaansho xaafadahayada. Waxaan baadhi doonnaa sida taageerada bulshada, waayo-aragnimada la wadaago, iyo ficilka wadajirka ahi u xoojin karto caafimaadka maskaxeed. Furan hogaamiyeyaasha bulshada, qoysaska, iyo qof kasta oo xiisaynaya caafimaadka bulshada.",
    date: "2025-11-15",
    location: "Hargeisa Main Hall",
    locationSo: "Hoolka Weyn ee Hargaysa",
    speakers: ["Fatima Jama", "Ahmed Khalif", "Hawa Yusuf"],
    image: "https://images.unsplash.com/photo-1759347115771-b9bf87e1dce1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzdXBwb3J0JTIwZ3JvdXB8ZW58MXx8fHwxNzYwOTg2MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    isPast: false,
    isFree: true
  },
  {
    id: "3",
    title: "Mental Health Awareness Campaign",
    titleSo: "Ololaha Wacyi-gelinta Caafimaadka Maskaxeed",
    description: "Breaking stigma and promoting mental health awareness in our community.",
    descriptionSo: "Jabinta cay iyo horumarin wacyiga caafimaadka maskaxeed bulshadeenna.",
    fullDescription: "Join our awareness campaign dedicated to breaking mental health stigma and promoting open conversations about mental wellness. The event featured educational booths, personal story sharing, mental health screenings, and resources for getting help. It was a powerful day of community connection and healing.",
    fullDescriptionSo: "Nagu soo biir ololeheenna wacyi-gelinta ee u heellan jabinta cayda caafimaadka maskaxeed iyo horumarin wadahadalada furan ee ku saabsan caafimaadka maskaxeed. Dhacdadii waxay ka koobnaa meelo waxbarasho, wadaaga sheekooyin shakhsi ah, baaritaanka caafimaadka maskaxeed, iyo kheyraadka helitaanka caawinta. Waxay ahayd maalin awood badan oo xiriirka bulshada iyo bogsiinta.",
    date: "2025-09-20",
    location: "City Center Park",
    locationSo: "Beerta Xarunta Magaalada",
    speakers: ["Community Members", "Mental Health Professionals"],
    image: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjBhd2FyZW5lc3N8ZW58MXx8fHwxNzYwOTg2MjU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    isPast: true,
    isFree: true
  },
  {
    id: "4",
    title: "Parenting with Emotional Intelligence",
    titleSo: "Dhalinta oo leh Sirdoonka Dareenka",
    description: "Workshop for parents on raising emotionally healthy children.",
    descriptionSo: "Aqoon-kororsi waalidiinta oo ku saabsan korinta carruurta caafimaad dareen leh.",
    fullDescription: "This workshop helped parents develop skills to raise emotionally intelligent and resilient children. Topics included understanding children's emotions, effective communication, managing difficult behaviors, and creating emotionally safe home environments. Parents left with practical strategies they could use immediately.",
    fullDescriptionSo: "Aqoon-kororsigan wuxuu waalidiinta ka caawiyay in ay horumariyaan xirfado lagu korayo carruurta sirdoonka dareenka leh iyo kuwa adag. Mawduucyada waxaa ka mid ahaa fahamka dareenka carruurta, xiriirka wax ku oolka ah, maaraynta dhaqamada adagga ah, iyo abuurista deegaanno guriyo oo ammaan dareen ah. Waalidiinta waxay kala tageen xeeladaha wax ku oolka ah oo ay si degdeg ah u isticmaali karaan.",
    date: "2025-08-10",
    location: "Sirta Maanka Center",
    locationSo: "Xarunta Sirta Maanka",
    speakers: ["Sahra Ibrahim", "Bashir Omar"],
    image: "https://images.unsplash.com/photo-1728933102332-a4f1a281a621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHNlbWluYXIlMjBldmVudHxlbnwxfHx8fDE3NjA5ODYyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    isPast: true,
    isFree: false,
    price: 30
  }
];

export const mentors: Mentor[] = [
  {
    id: "1",
    name: "Dr. Amina Hassan",
    role: "Clinical Psychologist",
    roleSo: "Dhakhtarka Cilmiga Maskaxda",
    bio: "Dr. Amina has over 15 years of experience in mental health coaching and therapy, specializing in trauma recovery and family counseling.",
    bioSo: "Dr. Amina waxay leedahay in ka badan 15 sano oo waayo-aragnimo ah tababarka caafimaadka maskaxeed iyo daawaynta, oo ku takhasustay soo kabashada dhaawaca iyo la-talinta qoyska.",
    image: "https://images.unsplash.com/photo-1758273241078-8eec353836be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVyYXB5JTIwY291bnNlbGluZyUyMHNlc3Npb258ZW58MXx8fHwxNzYwOTMyMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "2",
    name: "Mohamed Abdi",
    role: "Life Coach & Mindfulness Instructor",
    roleSo: "Tababare Nolol & Macalin Miyir-qabasho",
    bio: "Mohamed brings a holistic approach to wellness, combining life coaching with mindfulness practices to help clients achieve balance and clarity.",
    bioSo: "Mohamed wuxuu keenaa hab dhammaystiran caafimaad, iyada oo isku dhafaya tababarka nololeed iyo dhaqanka miyir-qabashada si loo caawiyo macaamiisha inay helaan miisaan iyo caddaalad.",
    image: "https://images.unsplash.com/photo-1745970347703-687874c5ddbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGdyb3d0aCUyMGNvYWNoaW5nfGVufDF8fHx8MTc2MDk4NjI1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "3",
    name: "Fatima Jama",
    role: "Social Worker & Group Facilitator",
    roleSo: "Shaqaale Bulsheed & Fududeeyaha Kooxaha",
    bio: "Fatima specializes in group therapy and community support, creating safe spaces for healing and shared growth.",
    bioSo: "Fatima waxay ku takhasustay daawaynta kooxaha iyo taageerada bulshada, abuurista meelo ammaan ah oo loogu talagalay bogsashada iyo koritaanka la wadaago.",
    image: "https://images.unsplash.com/photo-1759347115771-b9bf87e1dce1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzdXBwb3J0JTIwZ3JvdXB8ZW58MXx8fHwxNzYwOTg2MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export const services: Service[] = [
  {
    id: "1",
    title: "Mental Health Coaching",
    titleSo: "Tababarka Caafimaadka Maskaxeed",
    description: "Individual, couple, family, and group sessions with personalized healing and growth plans.",
    descriptionSo: "Kulamada shaqsi, lamaane, qoys, iyo kooxo oo leh qorshe bogsasho iyo koris shakhsi ah.",
    fullDescription: "Our mental health coaching provides a safe, confidential space for you to explore your thoughts, feelings, and behaviors. We offer personalized support to help you overcome challenges and achieve your wellness goals through evidence-based techniques and compassionate guidance.",
    fullDescriptionSo: "Tababorooyinkeena caafimaadka maskaxeed waxay bixiyaan meel ammaan ah oo sir ah oo aad ku baadhi karto fikirradaada, dareenkaaga, iyo dhaqankaaga. Waxaan bixinaa taageero shakhsi ah si ay kaaga caawiso adiga inaad ka gudubto caqabadaha oo aad gaarto yoolalka caafimaadkaaga iyada oo loo marayo farsamooyinka caddaynta ku salaysan iyo hagitaanka naxariista leh.",
    icon: "Brain",
    mentors: [mentors[0], mentors[1]]
  },
  {
    id: "2",
    title: "Teaching Social Skills",
    titleSo: "Barashada Xirfadaha Bulshada",
    description: "Educational seminars and workshops on stress management, resilience, mindfulness, communication, and self-care.",
    descriptionSo: "Shir-wadayaal waxbarasho iyo aqoon-kororsi ku saabsan maaraynta walbahaarka, adkaanshaha, miyir-qabashada, xiriirka, iyo is-daryeelka.",
    fullDescription: "Through interactive workshops and seminars, we teach essential social and life skills that enhance your ability to navigate relationships, manage stress, and build resilience. Our programs are designed for individuals, families, and organizations seeking to improve overall well-being.",
    fullDescriptionSo: "Iyada oo loo marayo aqoon-kororsiyada wada-shaqaynta leh, waxaan baraynaa xirfadaha bulshada iyo nololeed ee muhiimka ah ee kor u qaada awooda aad ugu maamusho xiriirka, aad u maamusho walbahaarka, iyo aad u dhisto adkaansho. Barnaamijyadayada waxaa loogu talagalay shakhsiyaad, qoysas, iyo ururo raadinaya in ay hagaajiyaan caafimaadka guud.",
    icon: "Users",
    mentors: [mentors[1], mentors[2]]
  },
  {
    id: "3",
    title: "Support Groups",
    titleSo: "Kooxaha Taageerada",
    description: "Safe group spaces to share, express, and receive encouragement from others on similar journeys.",
    descriptionSo: "Meelo kooxeed oo ammaan ah si aad ugu wadaagto, muujiso, iyo u hesho dhiirigelin dadka safar la mid ah.",
    fullDescription: "Our support groups provide a welcoming environment where you can connect with others, share experiences, and receive mutual support in a judgment-free space. Groups are facilitated by trained professionals and focus on various themes including grief, anxiety, parenting, and personal growth.",
    fullDescriptionSo: "Kooxahayaga taageeradu waxay bixiyaan jawi soo dhawayn leh halkaas oo aad kula xiriiri karto dadka kale, aad la wadaagto waayo-aragnimo, oo aad ka hesho taageero is-wada-taageereed oo meel xukun la'aan ah. Kooxaha waxaa hagaya xirfadayaal la tababaray waxayna diirada saaraan mawduucyo kala duwan oo ay ka mid yihiin murugo, walbahaare, dhalinta, iyo koritaanka shakhsi.",
    icon: "Heart",
    mentors: [mentors[2]]
  },
  {
    id: "4",
    title: "Scheduled Events & Collaborations",
    titleSo: "Dhacdooyin Jadwalsan iyo Wada-shaqayn",
    description: "Working with organizations to raise mental health awareness through community events and partnerships.",
    descriptionSo: "Ka shaqaynta ururrada si aan kor loogu qaado wacyiga caafimaadka maskaxeed iyada oo loo marayo dhacdooyin bulsheed iyo iskaashi.",
    fullDescription: "We collaborate with various organizations to host awareness campaigns, community events, and educational programs that promote mental health and well-being across our community. Our events bring people together to learn, share, and support one another in creating a mentally healthy society.",
    fullDescriptionSo: "Waxaan ka wada shaqaynaa ururo kala duwan si aan ugu marti-qaadno ololeyaal wacyi-gelin, dhacdooyin bulsheed, iyo barnaamijyo waxbarasho oo horumariya caafimaadka maskaxeed iyo fayoobida bulshadeena oo dhan. Dhacdooyinkayaga waxay isku keenaan dadka si ay wax u bartaan, wadaagaan, oo is-taageeraan abuurista bulsho caafimaad maskaxeed leh.",
    icon: "Calendar",
    mentors: [mentors[0], mentors[1], mentors[2]]
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Hawa Ahmed",
    role: "Business Owner",
    roleSo: "Milkiile Ganacsi",
    rating: 5,
    feedback: "Sirta Maanka helped me regain clarity and emotional balance. The coaching sessions were transformative and gave me tools I use every day. Truly grateful!",
    feedbackSo: "Sirta Maanka waxay iga caawisay inaan dib u helo caddaalad iyo miisaaminta dareenka. Kulamadii tababorku waxay ahaayeen wax isbeddel ah oo ay i siiyeen qalabka aan maalin kasta isticmaalo. Run ahaantii waan ku mahadcelinayaa!",
    serviceType: "Mental Health Coaching"
  },
  {
    id: "2",
    name: "Ahmed Yusuf",
    role: "Teacher",
    roleSo: "Macalin",
    rating: 5,
    feedback: "The stress management workshop changed my life. I learned practical techniques that have helped me both personally and professionally. Highly recommend!",
    feedbackSo: "Aqoon-kororsiga maaraynta walbahaarka ayaa noloshayda beddelay. Waxaan bartay farsamooyin wax ku ool ah oo iga caawiyay labadaba shakhsi ahaan iyo xirfad ahaan. Aad ayaan u talineynaa!",
    serviceType: "Teaching Social Skills"
  },
  {
    id: "3",
    name: "Sahra Mohamed",
    role: "Student",
    roleSo: "Arday",
    rating: 5,
    feedback: "The support group became my safe space. Being able to share my struggles with others who understand has been incredibly healing. Thank you Sirta Maanka!",
    feedbackSo: "Kooxda taageeradu waxay noqotay meeshaydii badbaadada. Awooda in aan la wadaago dagaalladayda dadka kale ee fahma ayaa ahaa mid aad u bogsiiso. Mahadsanid Sirta Maanka!",
    serviceType: "Support Groups"
  },
  {
    id: "4",
    name: "Fatima Ali",
    role: "Parent",
    roleSo: "Waalid",
    rating: 5,
    feedback: "As a parent, the parenting workshop gave me invaluable insights. I now understand my children better and our family relationships have improved tremendously.",
    feedbackSo: "Waalid ahaan, aqoon-kororsiga dhalintu wuxuu i siiyay aragtiyo qiimo badan. Hadda waxaan si fiican u fahmay carruurta oo xiriirka qoyskeennuna si weyn ayuu u hagaagay.",
    serviceType: "Teaching Social Skills"
  },
  {
    id: "5",
    name: "Omar Hassan",
    role: "Community Leader",
    roleSo: "Hogaamiye Bulsheed",
    rating: 5,
    feedback: "Sirta Maanka's community events have brought our neighborhood together. The mental health awareness campaign was eye-opening and much needed.",
    feedbackSo: "Dhacdooyinka bulshada ee Sirta Maanka ayaa isku keenay xaafadayada. Ololihii wacyi-gelinta caafimaadka maskaxeed ayaa ahaa mid indha-fur ah oo aad loo baahnaa.",
    serviceType: "Scheduled Events & Collaborations"
  },
  {
    id: "6",
    name: "Khadija Ibrahim",
    role: "Healthcare Worker",
    roleSo: "Shaqaale Caafimaad",
    rating: 5,
    feedback: "The mindfulness training I received has not only helped me manage work stress but also improved my overall quality of life. Professional and compassionate service!",
    feedbackSo: "Tababarka miyir-qabashada aan helay kuma caawinin oo keliya maaraynta walbahaarka shaqada laakiin sidoo kale wuxuu hagaajiyay tayada guud ee noloshayda. Adeeg xirfad iyo naxariis leh!",
    serviceType: "Mental Health Coaching"
  }
];
