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
    shortLabel: "استراحة",
    ariaLabel: "فتح رسالة الاستراحة",
    icon: "lounge",
    eyebrow: "استراحة سعودي دنت",
    title: "لحظة هدوء تكمل راحتك",
    message: "صممنا هذه المساحة لتمنحك الهدوء والراحة بين خطوات زيارتك لأن تجربة سعودي دنت تعتني بك في كل لحظة",
  },
  "third-clinic-center": {
    shortLabel: "عيادة",
    ariaLabel: "فتح رسالة العيادة الأولى",
    icon: "clinic",
    eyebrow: "عيادة سعودي دنت",
    title: "نفهم احتياجك لنرسم خطتك بثقة",
    message: "نبدأ بالاستماع إليك وفهم تفاصيل حالتك لنضع خطة علاج واضحة تناسبك وتقودك نحو ابتسامة أكثر صحة واطمئنانًا",
  },
  "third-clinic-right": {
    shortLabel: "عيادة",
    ariaLabel: "فتح رسالة العيادة الثانية",
    icon: "clinic",
    eyebrow: "عيادة سعودي دنت",
    title: "دقة في العلاج واهتمام في كل خطوة",
    message: "نجمع بين الخبرة الطبية والعناية الدقيقة لنمنحك تجربة علاج متكاملة تحفظ راحتك وتبني ثقتك من الزيارة الأولى",
  },
} as const;

export type XrayThirdFeatureId = keyof typeof xrayThirdFeatures;

export const xrayFourthFeatures = {
  "fourth-call-center": {
    shortLabel: "قسم الاتصال المركزي",
    ariaLabel: "فتح رسالة قسم الاتصال المركزي",
    eyebrow: "قسم الاتصال المركزي في سعودي دنت",
    title: "صوتك يصل والخدمة تبدأ",
    message: "من أول اتصال نجيب عن استفسارك وننظم موعدك ونوجهك إلى الخطوة المناسبة لتبدأ زيارتك براحة ووضوح",
  },
} as const;

export type XrayFourthFeatureId = keyof typeof xrayFourthFeatures;

export const xrayFifthFeatures = {
  "fifth-orthodontics-left": {
    shortLabel: "عيادة",
    ariaLabel: "فتح نافذة العيادة الأولى",
    icon: "orthodontics",
    eyebrow: "عيادة سعودي دنت",
    title: "نبدأ بالفهم لنصل إلى العناية الأنسب",
    message: "نستمع إلى احتياجك ونقرأ تفاصيل حالتك بعناية لنمنحك خطة علاج واضحة تناسبك وتبدأ معها رحلتك بثقة",
  },
  "fifth-orthodontics-center": {
    shortLabel: "عيادة",
    ariaLabel: "فتح نافذة العيادة الثانية",
    icon: "orthodontics",
    eyebrow: "عيادة سعودي دنت",
    title: "دقة اليوم تصنع ابتسامة الغد",
    message: "نجمع بين الخبرة الطبية والتقنيات الحديثة لنعتني بكل تفصيلة ونقود ابتسامتك نحو نتيجة أكثر صحة وتوازنًا",
  },
  "fifth-orthodontics-right": {
    shortLabel: "عيادة",
    ariaLabel: "فتح نافذة العيادة الثالثة",
    icon: "orthodontics",
    eyebrow: "عيادة سعودي دنت",
    title: "متابعة تبقي ابتسامتك على المسار",
    message: "نرافق تقدمك باهتمام ونراجع كل مرحلة بدقة لتبقى تجربتك مريحة وخطواتك أقرب إلى الابتسامة التي تتطلع إليها",
  },
  "fifth-preliminary-exam": {
    shortLabel: "غرفة الفحص الأولي",
    ariaLabel: "فتح نافذة غرفة الفحص الأولي",
    icon: "exam",
    eyebrow: "غرفة الفحص الأولي في سعودي دنت",
    title: "من هنا تبدأ خطتك بوضوح",
    message: "نبدأ بفحص شامل يساعدنا على فهم احتياجك بدقة وتوجيهك إلى التخصص والخطوة العلاجية الأنسب بثقة واطمئنان",
  },
} as const;

export type XrayFifthFeatureId = keyof typeof xrayFifthFeatures;

export const khamisLobbySideFeatures = {
  "khamis-side-lounge": {
    shortLabel: "استراحة",
    ariaLabel: "فتح رسالة استراحة الردهة",
    icon: "lounge",
    eyebrow: "استراحة سعودي دنت",
    title: "راحتك حاضرة في كل لحظة",
    message: "هيأنا لك مساحة هادئة تستعيد فيها راحتك لأن عنايتنا في سعودي دنت تبدأ من شعورك وتمتد إلى كل تفاصيل زيارتك",
  },
} as const;

export type KhamisLobbySideFeatureId = keyof typeof khamisLobbySideFeatures;

export const administrativeOfficeFeature = {
  shortLabel: "قسم المحاسبة",
  ariaLabel: "فتح نافذة قسم المحاسبة",
  eyebrow: "قسم المحاسبة في سعودي دنت",
  title: "وضوح مالي يكمّل ثقتك",
  message: "نراجع تفاصيل الفواتير والمدفوعات بدقة ونقدم لك المعلومات المالية بوضوح لتبقى تجربتك سهلة ومطمئنة",
} as const;

export const marketingDepartmentFeature = {
  shortLabel: "قسم التسويق",
  ariaLabel: "فتح نافذة قسم التسويق",
  eyebrow: "قسم التسويق في سعودي دنت",
  title: "حضور يعكس جودة العناية",
  message: "نبني تواصلًا يعبّر عن هوية سعودي دنت ويقرّب خدماتنا من المجتمع بمحتوى واضح وتجربة تحفظ ثقتكم",
} as const;

export const leftReceptionFeature = {
  shortLabel: "الاستقبال",
  ariaLabel: "فتح معلومات الاستقبال",
  eyebrow: "استقبال سعودي دنت",
  title: "نستقبلك باهتمام ونبدأ معك بثقة",
  message: "من هنا نرتب تفاصيل زيارتك ونوجهك إلى الخطوة المناسبة لتكون تجربتك أسهل وأكثر راحة منذ اللحظة الأولى",
} as const;

export const receptionHallFeatures = {
  "reception-hall-reception": {
    shortLabel: "الاستقبال",
    ariaLabel: "فتح معلومات الاستقبال",
    icon: "reception",
    eyebrow: "الاستقبال في سعودي دنت",
    title: "بداية مرتبة لزيارة أكثر راحة",
    message: "نستقبلك بابتسامة ونرتب تفاصيل زيارتك بوضوح لتبدأ رحلتك معنا براحة وثقة",
  },
  "reception-hall-patient-relations": {
    shortLabel: "علاقات المرضى",
    ariaLabel: "فتح معلومات علاقات المرضى",
    icon: "patient-relations",
    eyebrow: "علاقات المرضى في سعودي دنت",
    title: "نسمعك لأن تجربتك تهمنا",
    message: "نصغي لملاحظاتك ونتابع تجربتك باهتمام لنضمن أن تبقى رعايتك قريبة من توقعاتك وثقتك",
  },
  "reception-hall-lounge": {
    shortLabel: "الاستراحة",
    ariaLabel: "فتح معلومات الاستراحة",
    icon: "lounge",
    eyebrow: "استراحة سعودي دنت",
    title: "هدوء يهيئك لابتسامة أجمل",
    message: "هيأنا لك مساحة مريحة تمنحك لحظة هدوء لأن راحتك جزء أصيل من كل زيارة",
  },
  "reception-hall-clinic": {
    shortLabel: "العيادة",
    ariaLabel: "فتح معلومات العيادة",
    icon: "clinic",
    eyebrow: "عيادة سعودي دنت",
    title: "عناية دقيقة تبدأ بفهمك",
    message: "نستمع لاحتياجك ونعتني بكل تفصيلة لنقدم لك رعاية تناسبك وتمنحك ثقة أكبر بابتسامتك",
  },
} as const;

export type ReceptionHallFeatureId = keyof typeof receptionHallFeatures;

export const implantCorridorFeatures = {
  "implant-corridor-clinic": {
    shortLabel: "العيادة",
    ariaLabel: "فتح معلومات العيادة",
    icon: "clinic",
    eyebrow: "عيادة سعودي دنت",
    title: "عناية تفهمك قبل أن تبدأ",
    message: "نبدأ بالاستماع إلى احتياجك ونراجع تفاصيل حالتك لنمنحك خطة علاج واضحة تناسبك وتطمئنك",
  },
  "implant-corridor-clinic-right": {
    shortLabel: "عيادة",
    ariaLabel: "فتح معلومات العيادة الجديدة",
    icon: "clinic",
    eyebrow: "عيادة سعودي دنت",
    title: "دقة تصنع فرقًا في كل زيارة",
    message: "نهتم بكل تفصيلة ونوظف خبرتنا الطبية لنقدم لك رعاية موثوقة تقودك نحو ابتسامة أكثر صحة وثقة",
  },
  "implant-corridor-unit": {
    shortLabel: "وحدة زراعة الأسنان",
    ariaLabel: "فتح معلومات وحدة زراعة الأسنان",
    icon: "implant",
    eyebrow: "وحدة زراعة الأسنان",
    title: "وحدة زراعة الأسنان",
    message: "وحدة زراعة الأسنان في فرع خميس مشيط.",
  },
} as const;

export type ImplantCorridorFeatureId = keyof typeof implantCorridorFeatures;

export const implantUnitLobbyFeatures = {
  "implant-unit-clinic-23": {
    shortLabel: "عيادة 23",
    ariaLabel: "فتح معلومات عيادة 23",
    icon: "clinic",
    eyebrow: "عيادة 23 في سعودي دنت",
    title: "عناية دقيقة تبدأ من فهمك",
    message: "نستمع إلى احتياجك ونبني خطتك العلاجية بعناية لتكون كل خطوة أوضح وأكثر راحة وثقة",
  },
  "implant-unit-clinic-24": {
    shortLabel: "عيادة 24",
    ariaLabel: "فتح معلومات عيادة 24",
    icon: "clinic",
    eyebrow: "عيادة 24 في سعودي دنت",
    title: "خبرة تواكب تفاصيل ابتسامتك",
    message: "نجمع بين الخبرة الطبية والتقنيات الحديثة لنمنحك رعاية متوازنة تليق بابتسامتك وتطلعاتك",
  },
  "implant-unit-clinic-25": {
    shortLabel: "عيادة 25",
    ariaLabel: "فتح معلومات عيادة 25",
    icon: "clinic",
    eyebrow: "عيادة 25 في سعودي دنت",
    title: "اهتمام مستمر نحو نتيجة تطمئنك",
    message: "نتابع تقدمك في كل مرحلة ونهتم بأدق التفاصيل لتبقى رحلتك العلاجية مريحة وواضحة",
  },
  "implant-unit-reception": {
    shortLabel: "الاستقبال",
    ariaLabel: "فتح معلومات الاستقبال",
    icon: "reception",
    eyebrow: "استقبال وحدة زراعة الأسنان",
    title: "بداية منظمة لعناية أكثر وضوحًا",
    message: "نرتب تفاصيل زيارتك ونوجهك إلى الخطوة المناسبة لتبدأ تجربتك بسهولة واطمئنان",
  },
  "implant-unit-lounge": {
    shortLabel: "الاستراحة",
    ariaLabel: "فتح معلومات الاستراحة",
    icon: "lounge",
    eyebrow: "استراحة وحدة زراعة الأسنان",
    title: "هدوء يرافقك بين خطوات العناية",
    message: "هيأنا لك مساحة مريحة تمنحك لحظة هدوء لأن راحتك جزء أساسي من تجربة سعودي دنت",
  },
} as const;

export type ImplantUnitLobbyFeatureId = keyof typeof implantUnitLobbyFeatures;

export const receptionRightCorridorFeatures = {
  "reception-right-clinic-near": {
    shortLabel: "عيادة",
    ariaLabel: "فتح معلومات العيادة الأولى",
    icon: "clinic",
    eyebrow: "عيادة سعودي دنت",
    title: "اهتمام يبدأ من أول تفصيلة",
    message: "نستمع إليك بعناية ونفهم احتياجك لنمنحك تجربة علاج واضحة ومريحة تليق بثقتك",
  },
  "reception-right-clinic-far": {
    shortLabel: "عيادة",
    ariaLabel: "فتح معلومات العيادة الثانية",
    icon: "clinic",
    eyebrow: "عيادة سعودي دنت",
    title: "عناية دقيقة ترافق ابتسامتك",
    message: "نهتم بكل خطوة في رحلتك العلاجية ونوظف خبرتنا لنقودك نحو ابتسامة أكثر صحة واطمئنانًا",
  },
} as const;

export type ReceptionRightCorridorFeatureId = keyof typeof receptionRightCorridorFeatures;

export const receptionRightLobbyFeatures = {
  "reception-right-lobby-clinic-near": {
    shortLabel: "عيادة",
    ariaLabel: "فتح معلومات العيادة الأولى",
    icon: "clinic",
    eyebrow: "عيادة سعودي دنت",
    title: "نعتني بتفاصيلك لنصنع فرقًا تشعر به",
    message: "نقدم لك عناية شخصية تجمع بين الدقة والاهتمام لتكون رحلتك العلاجية أكثر راحة ووضوحًا",
  },
  "reception-right-lobby-clinic-far": {
    shortLabel: "عيادة",
    ariaLabel: "فتح معلومات العيادة الثانية",
    icon: "clinic",
    eyebrow: "عيادة سعودي دنت",
    title: "خبرة تطمئنك ونتيجة تبتسم لها",
    message: "نوظف خبرات فريقنا وتقنياتنا الحديثة لنمنحك رعاية موثوقة تقودك إلى ابتسامة أكثر صحة وثقة",
  },
  "reception-right-lobby-lounge": {
    shortLabel: "الاستراحة",
    ariaLabel: "فتح معلومات الاستراحة",
    icon: "lounge",
    eyebrow: "استراحة سعودي دنت",
    title: "لحظة راحة تليق بتجربتك",
    message: "صممنا هذه الاستراحة لتمنحك الهدوء بين خطوات زيارتك لأن راحتك جزء من العناية التي نقدمها",
  },
  "reception-right-lobby-reception": {
    shortLabel: "الاستقبال",
    ariaLabel: "فتح معلومات الاستقبال",
    icon: "reception",
    eyebrow: "استقبال سعودي دنت",
    title: "استقبال يختصر عليك الطريق",
    message: "نرتب موعدك ونوجهك إلى الوجهة المناسبة بكل وضوح لتبدأ زيارتك بسلاسة واطمئنان",
    image: "/assets/branches/khamis-mushait/tour/saudident-reception-right-detail.webp",
    imageAlt: "منطقة الاستقبال والاستراحة في فرع خميس مشيط",
  },
} as const;

export type ReceptionRightLobbyFeatureId = keyof typeof receptionRightLobbyFeatures;

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
