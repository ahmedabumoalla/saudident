export const VERIFIED_AT = "2026-08-07";

export type Sourced = { source: string; verifiedAt: string };
export type SaudiDentStat = Sourced & { value: string; label: string };
export type SaudiDentService = Sourced & { id: string; title: string; description?: string; icon: "implant" | "root" | "prostho" | "gum" | "braces" | "smile" | "oral" | "filling" | "kids" | "crown" };
export type SaudiDentDoctor = Sourced & { id: string; name: string; specialty: string; image?: string };

const website = "https://saudident.sa/";
const about = "https://saudident.sa/about";
const servicesSource = "https://saudident.sa/services";
const team = "https://saudident.sa/team";
const clinics = "https://saudident.sa/clinics";

export const saudident = {
  appointment: { url: "https://saudident.sa/appointment", source: "https://saudident.sa/appointment", verifiedAt: VERIFIED_AT },
  contact: { phoneDisplay: "920011884", phoneUrl: "tel:+966920011884", email: "info@saudident.sa", emailUrl: "mailto:info@saudident.sa", source: website, verifiedAt: VERIFIED_AT },
  app: {
    googlePlay: "https://play.google.com/store/apps/details?id=com.saudident.app&hl=ar",
    appStore: "https://apps.apple.com/sa/app/%D8%B3%D8%B9%D9%88%D8%AF%D9%8A-%D8%AF%D9%86%D8%AA-saudi-dent/id6787029901?l=ar",
    description: "تصفّح الأطباء وملفاتهم وأوقات العمل، اختر الموعد المناسب، وأدِر حجوزاتك وتنبيهاتك من مكان واحد",
    source: "https://play.google.com/store/apps/details?id=com.saudident.app&hl=ar",
    verifiedAt: VERIFIED_AT,
  },
  social: {
    instagram: "https://www.instagram.com/saudidentclinic/?hl=en",
    x: "https://x.com/saudidentclinic",
    facebook: "https://www.facebook.com/saudidentclinic",
    source: website,
    verifiedAt: VERIFIED_AT,
  },
} as const;

export const stats: SaudiDentStat[] = [
  { value: "+45", label: "طبيب", source: website, verifiedAt: VERIFIED_AT },
  { value: "+10", label: "سنوات من الخبرة والخدمة", source: about, verifiedAt: VERIFIED_AT },
  { value: "2", label: "فرعان في عسير", source: clinics, verifiedAt: VERIFIED_AT },
];

export const storyMoments = [
  { id: "specialties", index: "01", title: "طب الأسنان تحت سقف واحد", body: "عيادات أسنان استشارية تضم خدمات طب الأسنان الحديث وتخصصاته في مكان واحد", source: about, verifiedAt: VERIFIED_AT },
  { id: "quality", index: "02", title: "الجودة ممارسة يومية", body: "رسالتنا تقديم خدمات الأسنان بحرفية عالية وضمن الجودة المرجوة، بممارسات موثوقة وواضحة", source: about, verifiedAt: VERIFIED_AT },
  { id: "expertise", index: "03", title: "كفاءة علمية وإكلينيكية", body: "فريق مؤهل يضم استشاريين وأخصائيين وأعضاء هيئة تدريس، بخبرة علمية وإكلينيكية", source: about, verifiedAt: VERIFIED_AT },
  { id: "learning", index: "04", title: "تعليم مستمر", body: "برنامج نشط للتعليم الطبي المستمر ونقل الخبرات من خلال أكاديمية سعودي دنت", source: about, verifiedAt: VERIFIED_AT },
  { id: "vision", index: "05", title: "رؤية تتقدم", body: "طموح معلن لأن تصبح سعودي دنت من رواد طب الأسنان في أنحاء المملكة", source: about, verifiedAt: VERIFIED_AT },
];

export const services: SaudiDentService[] = [
  { id: "implants", title: "زراعة الأسنان", description: "تعويض الأسنان المفقودة بزرعات تتلاءم مع الأسنان الموجودة دون التأثير على الأسنان المجاورة", icon: "implant", source: servicesSource, verifiedAt: VERIFIED_AT },
  { id: "root-canal", title: "علاج الجذور وعصب الأسنان", description: "علاج يهدف إلى إنقاذ السن التالف والمحافظة عليه عند اكتشاف المشكلة وعلاجها مبكرًا", icon: "root", source: servicesSource, verifiedAt: VERIFIED_AT },
  { id: "prostho", title: "التركيبات الثابتة والمتحركة", description: "تعويض الأسنان المفقودة لاستعادة المضغ والحفاظ على المسافات واستعادة الشكل الجمالي للفم", icon: "prostho", source: servicesSource, verifiedAt: VERIFIED_AT },
  { id: "gum", title: "جراحة اللثة والأسنان", description: "العناية بالتهابات وأمراض اللثة التي تؤثر على الأنسجة الرخوة والعظام المحيطة بالأسنان", icon: "gum", source: servicesSource, verifiedAt: VERIFIED_AT },
  { id: "braces", title: "تقويم الأسنان", description: "معالجة مشكلات ازدحام الأسنان ونمو الفك واصطفاف الأسنان بوسائل يحددها الطبيب", icon: "braces", source: servicesSource, verifiedAt: VERIFIED_AT },
  { id: "smile", title: "ابتسامة هوليوود", description: "قشور رقيقة مخصصة لتحسين لون وشكل وحجم الأسنان بما يحاكي مظهرها الطبيعي", icon: "smile", source: servicesSource, verifiedAt: VERIFIED_AT },
  { id: "oral", title: "علاج أمراض الفم والمفصل الصدغي", icon: "oral", source: website, verifiedAt: VERIFIED_AT },
  { id: "fillings", title: "الحشوات الطبية", icon: "filling", source: website, verifiedAt: VERIFIED_AT },
  { id: "pediatric", title: "طب أسنان الأطفال والتخدير العام", icon: "kids", source: website, verifiedAt: VERIFIED_AT },
];

export const xrayThirdFeatures = {
  "third-corridor-lounge": {
    shortLabel: "هدوء يسبق ابتسامتك",
    ariaLabel: "فتح رسالة الاستراحة",
    icon: "lounge",
    eyebrow: "مساحة تمنحك لحظة هدوء",
    title: "راحتك جزء من كل خطوة",
    message: "هيأنا هذه الاستراحة لتمنحك وقتًا هادئًا ومريحًا بين خطوات زيارتك، لأن العناية تبدأ من شعورك بالطمأنينة.",
  },
  "third-clinic-center": {
    shortLabel: "فهم أدق لاحتياجك",
    ariaLabel: "فتح رسالة العيادة الأولى",
    icon: "clinic",
    eyebrow: "عناية تبدأ بفهمك",
    title: "كل تفصيلة تقود إلى خطة أوضح",
    message: "نستمع إلى احتياجك ونراجع التفاصيل بعناية لنمنحك تصورًا واضحًا وخطوات علاج تناسب رحلتك بثقة وراحة.",
  },
  "third-clinic-right": {
    shortLabel: "عناية تتابع تفاصيلك",
    ariaLabel: "فتح رسالة العيادة الثانية",
    icon: "clinic",
    eyebrow: "اهتمام يستمر معك",
    title: "الدقة تصنع تجربة أكثر اطمئنانًا",
    message: "نهتم بتفاصيل كل خطوة ونتابع تقدم رحلتك لتبقى تجربتك واضحة ومريحة من بداية العناية حتى اكتمالها.",
  },
} as const;

export type XrayThirdFeatureId = keyof typeof xrayThirdFeatures;

export const xrayFourthFeatures = {
  "fourth-call-center": {
    shortLabel: "خدمتك تبدأ من هنا",
    ariaLabel: "فتح رسالة الكول سنتر",
    eyebrow: "الكول سنتر — صوتك يصل إلينا",
    title: "إجابة واضحة من أول اتصال",
    message: "فريق الكول سنتر يساعدك في الاستفسارات وتنظيم المواعيد وتوجيهك إلى الخطوة المناسبة لتبدأ زيارتك براحة ووضوح.",
  },
} as const;

export type XrayFourthFeatureId = keyof typeof xrayFourthFeatures;

export const xrayFifthFeatures = {
  "fifth-orthodontics-left": {
    shortLabel: "بداية مدروسة",
    ariaLabel: "فتح رسالة عيادة التقويم الأولى",
    icon: "orthodontics",
    eyebrow: "عيادة تقويم — بداية مدروسة",
    title: "نفهم ابتسامتك قبل أن نرسم مسارها",
    message: "نبدأ بقراءة احتياجك بعناية لنرتب خطوات تقويم واضحة تناسب ابتسامتك وتمنحك الثقة من أول زيارة.",
  },
  "fifth-orthodontics-center": {
    shortLabel: "دقة كل خطوة",
    ariaLabel: "فتح رسالة عيادة التقويم الثانية",
    icon: "orthodontics",
    eyebrow: "عيادة تقويم — دقة في كل خطوة",
    title: "مسار متوازن نحو ابتسامة أكثر انسجامًا",
    message: "في رحلة التقويم نهتم بكل تفصيلة ونتابع كل خطوة بوضوح لتتقدم ابتسامتك بثبات وطمأنينة.",
  },
  "fifth-orthodontics-right": {
    shortLabel: "متابعة مستمرة",
    ariaLabel: "فتح رسالة عيادة التقويم الثالثة",
    icon: "orthodontics",
    eyebrow: "عيادة تقويم — اهتمام مستمر",
    title: "ابتسامتك تتغير… وعنايتنا تواكبها",
    message: "نرافق تقدمك باهتمام ونراجع التفاصيل في كل مرحلة لتبقى رحلتك مريحة وخطواتك أقرب إلى النتيجة التي تتطلع إليها.",
  },
  "fifth-preliminary-exam": {
    shortLabel: "بداية أوضح",
    ariaLabel: "فتح رسالة غرفة الفحص الأولي",
    icon: "exam",
    eyebrow: "غرفة الفحص الأولي — أول خيط للحكاية",
    title: "قبل الخطة… نمنح ابتسامتك وقتها",
    message: "هنا تبدأ الزيارة بنظرة شاملة واهتمام هادئ يساعدان على فهم احتياجك وتوجيهك إلى الخطوة الأنسب بثقة ووضوح.",
  },
} as const;

export type XrayFifthFeatureId = keyof typeof xrayFifthFeatures;

export const khamisLobbySideFeatures = {
  "khamis-side-lounge": {
    shortLabel: "استراحة تكمل راحتك",
    ariaLabel: "فتح رسالة استراحة الردهة",
    icon: "lounge",
    eyebrow: "زاوية هادئة في قلب الردهة",
    title: "خذ لحظتك… والباقي علينا",
    message: "في سعودي دنت نهتم بأن تكون كل لحظة من زيارتك أخف وأهدأ؛ لذلك هيأنا هذه الاستراحة لتستعيد فيها راحتك قبل أن تواصل يومك بابتسامة.",
  },
} as const;

export type KhamisLobbySideFeatureId = keyof typeof khamisLobbySideFeatures;

export const administrativeOfficeFeature = {
  shortLabel: "المكتب الإداري",
  ariaLabel: "فتح معلومات المكتب الإداري",
  eyebrow: "المكتب الإداري",
  title: "الإدارة والتنسيق داخل الفرع",
  message: "مساحة المكتب الإداري في فرع خميس مشيط.",
} as const;

export const leftReceptionFeature = {
  shortLabel: "الاستقبال",
  ariaLabel: "فتح معلومات الاستقبال",
  eyebrow: "الاستقبال",
  title: "استقبال فرع خميس مشيط",
  message: "منطقة الاستقبال في فرع خميس مشيط.",
} as const;

export const receptionHallFeatures = {
  "reception-hall-reception": {
    shortLabel: "الاستقبال",
    ariaLabel: "فتح معلومات الاستقبال",
    icon: "reception",
    eyebrow: "الاستقبال",
    title: "استقبال فرع خميس مشيط",
    message: "منطقة الاستقبال في فرع خميس مشيط.",
  },
  "reception-hall-patient-relations": {
    shortLabel: "علاقات المرضى",
    ariaLabel: "فتح معلومات علاقات المرضى",
    icon: "patient-relations",
    eyebrow: "علاقات المرضى",
    title: "نقطة علاقات المرضى",
    message: "نقطة علاقات المرضى داخل فرع خميس مشيط.",
  },
  "reception-hall-lounge": {
    shortLabel: "الاستراحة",
    ariaLabel: "فتح معلومات الاستراحة",
    icon: "lounge",
    eyebrow: "الاستراحة",
    title: "استراحة فرع خميس مشيط",
    message: "منطقة الاستراحة داخل فرع خميس مشيط.",
  },
  "reception-hall-clinic": {
    shortLabel: "العيادة",
    ariaLabel: "فتح معلومات العيادة",
    icon: "clinic",
    eyebrow: "العيادة",
    title: "إحدى عيادات الفرع",
    message: "إحدى عيادات فرع خميس مشيط.",
  },
} as const;

export type ReceptionHallFeatureId = keyof typeof receptionHallFeatures;

export const doctors: SaudiDentDoctor[] = [
  { id:"youssef-alqarni",name:"أ. د. يوسف عبدالله القرني",specialty:"استشاري جذور وأعصاب",image:"/media/doctors/youssef-alqarni.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"saad-alqahtani",name:"أ.د. سعد محمد علي القحطاني",specialty:"استشاري زراعة وأمراض اللثة",image:"/media/doctors/saad-alqahtani.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"mohamed-alqarni",name:"أ.د. محمد القرني",specialty:"بروفيسور واستشاري إصلاح وتجميل الأسنان",image:"/media/doctors/mohamed-alqarni.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"amani-alqahtani",name:"د. أماني شريف القحطاني",specialty:"طبيب أسنان عام",source:team,verifiedAt:VERIFIED_AT },
  { id:"jamal-baathman",name:"د. جمال عمر باعثمان",specialty:"نائب تركيبات الأسنان",image:"/media/doctors/jamal-baathman.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"khalil-ibrahim",name:"د. خليل إبراهيم",specialty:"أخصائي أول إصلاح وتجميل أسنان",image:"/media/doctors/khalil-ibrahim.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"rawan-sorour",name:"د. روان سرور",specialty:"أخصائي تقويم الأسنان",source:team,verifiedAt:VERIFIED_AT },
  { id:"saeed-alsarhani",name:"د. سعيد السرحاني",specialty:"استشاري إصلاح وتجميل",image:"/media/doctors/saeed-alsarhani.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"shabina-shafi",name:"د. شابينا شافي",specialty:"أخصائي طب أسنان الأطفال",source:team,verifiedAt:VERIFIED_AT },
  { id:"tareq-abdulkareem",name:"د. طارق سعيد عبدالكريم",specialty:"أخصائي طب أسنان الأسرة",image:"/media/doctors/tareq-abdulkareem.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"abdulilah-sindi",name:"د. عبدالإله سمير سندى",specialty:"استشاري جذور وأعصاب",image:"/media/doctors/abdulilah-sindi.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"abdulghafour-naji",name:"د. عبدالغفور ناجي",specialty:"نائب تركيبات",image:"/media/doctors/abdulghafour-naji.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"abdullah-farah",name:"د. عبدالله أحمد فارع",specialty:"نائب طب أسنان الأسرة",image:"/media/doctors/abdullah-farah.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"fares-alrabeean",name:"د. فارس الربيعان",specialty:"طبيب أسنان عام",image:"/media/doctors/fares-alrabeean.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"mohammed-althabit",name:"د. محمد آل ثابت",specialty:"طبيب أسنان عام",image:"/media/doctors/mohammed-althabit.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"mohammed-thamer",name:"د. محمد ثامر",specialty:"استشاري إصلاح وتجميل وزراعة الأسنان",image:"/media/doctors/mohammed-thamer.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"mohammed-zarba",name:"د. محمد عبدالله جابر زربه",specialty:"استشاري تركيبات الأسنان",image:"/media/doctors/mohammed-zarba.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"mohammed-alattas",name:"د. محمد علي العطاس",specialty:"أخصائي تقويم الأسنان",image:"/media/doctors/mohammed-alattas.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"maryam-abdulmohsen",name:"د. مريم عبدالمحسن",specialty:"أخصائي جراحة الوجه والفكين",image:"/media/doctors/maryam-abdulmohsen.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"maha-allabdan",name:"د. مها آل لبدان",specialty:"استشاري إصلاح وتجميل الأسنان",source:team,verifiedAt:VERIFIED_AT },
  { id:"haitham-asiri",name:"د. هيثم عسيري",specialty:"طب الأسنان العام",image:"/media/doctors/haitham-asiri.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"yasser-alharmali",name:"د. ياسر مسفر الحرملي",specialty:"استشاري إصلاح وتجميل الأسنان",image:"/media/doctors/yasser-alharmali.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"ahmed-alshahrani",name:"د. أحمد الشهراني",specialty:"استشاري علاج الجذور وعصب الأسنان",image:"/media/doctors/ahmed-alshahrani.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"khalid-mujthel",name:"د. خالد مجثل",specialty:"طبيب أسنان عام",image:"/media/doctors/khalid-mujthel.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"razan-alhajari",name:"د. رزان الحجري",specialty:"طبيب أسنان عام",image:"/media/doctors/razan-alhajari.png",source:team,verifiedAt:VERIFIED_AT },
  { id:"salem-alqahtani",name:"د. سالم القحطاني",specialty:"طبيب أسنان عام",image:"/media/doctors/salem-alqahtani.png",source:team,verifiedAt:VERIFIED_AT },
  { id:"sami-alawwadh",name:"د. سامي آل عواض",specialty:"أخصائي علاج عصب وجذور الأسنان",image:"/media/doctors/sami-alawwadh.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"salman-alqahtani",name:"د. سلمان القحطاني",specialty:"أخصائي أول إصلاح وتجميل أسنان",image:"/media/doctors/salman-alqahtani.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"abdulkhaleq-alshadidi",name:"د. عبدالخالق الشديدي",specialty:"استشاري التركيبات",image:"/media/doctors/abdulkhaleq-alshadidi.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"abdulaziz-asiri",name:"د. عبدالعزيز عسيري",specialty:"استشاري التركيبات",image:"/media/doctors/abdulaziz-asiri.jpg",source:team,verifiedAt:VERIFIED_AT },
  { id:"ali-alqahtani",name:"د. علي القحطاني",specialty:"استشاري تقويم الأسنان",source:team,verifiedAt:VERIFIED_AT },
  { id:"moayad-alqaysi",name:"د. مؤيد القيسي",specialty:"طبيب أسنان عام",image:"/media/doctors/moayad-alqaysi.png",source:team,verifiedAt:VERIFIED_AT },
];

export const branches = [
  { id:"khamis", name:"خميس مشيط", kicker:"فرع سعودي دنت في خميس مشيط", image:"/assets/branches/khamis-mushait/exterior-wide.webp", locationUrl:"https://maps.app.goo.gl/AdQxbjxT3fU1Xagh6", source:clinics, verifiedAt:VERIFIED_AT },
  { id:"abha", name:"أبها", kicker:"فرع سعودي دنت في أبها", image:"/assets/branches/abha/branch-hero.webp", locationUrl:"https://maps.app.goo.gl/gLo6Hw5tso8auNmPA", source:clinics, verifiedAt:VERIFIED_AT },
];
