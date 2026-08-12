export type BranchSceneId = "khamis" | "abha";

export type BranchSceneGalleryImage = {
  src: string;
  alt: string;
};

export type BranchSceneHotspot = {
  id: string;
  x: number;
  y: number;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  services: string[];
  equipment?: string[];
  gallery?: BranchSceneGalleryImage[];
  ctaLabel?: string;
};

export type BranchInteractiveScene = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  hotspots: BranchSceneHotspot[];
};

export type BranchInteractiveExperienceData = {
  id: BranchSceneId;
  branchName: string;
  title: string;
  description: string;
  scenes: BranchInteractiveScene[];
};

const khamisPath = "/assets/branches/khamis-mushait";
const abhaPath = "/assets/branches/abha";

export const branchInteractiveExperiences: Record<BranchSceneId, BranchInteractiveExperienceData> = {
  khamis: {
    id: "khamis",
    branchName: "خميس مشيط",
    title: "اكتشف فرع خميس مشيط",
    description: "اختر أحد الأقسام، ثم المس أي نقطة حيّة داخل المشهد.",
    scenes: [
      {
        id: "reception",
        label: "الاستقبال",
        eyebrow: "بداية الزيارة",
        title: "استقبال واضح وخدمة قريبة",
        description: "المحطة الأولى لتنظيم الزيارة والإجابة عن الاستفسارات ومتابعة المواعيد.",
        image: `${khamisPath}/reception.webp`,
        imageAlt: "الاستقبال الحقيقي في فرع سعودي دنت بخميس مشيط",
        hotspots: [
          {
            id: "main-desk",
            x: 49,
            y: 58,
            label: "كاونتر الاستقبال",
            eyebrow: "الاستقبال",
            title: "خدمة تبدأ من لحظة الوصول",
            description: "نقطة استقبال المراجعين وتنظيم المواعيد وتوجيه الزائر إلى محطته التالية.",
            services: ["تأكيد بيانات الموعد", "توجيه المراجع", "الإجابة عن الاستفسارات"],
            gallery: [
              { src: `${khamisPath}/logo-lobby.webp`, alt: "ردهة شعار سعودي دنت في فرع خميس مشيط" },
              { src: `${khamisPath}/waiting.webp`, alt: "منطقة الانتظار في فرع خميس مشيط" },
            ],
            ctaLabel: "احجز موعدك",
          },
          {
            id: "welcome-screen",
            x: 20,
            y: 24,
            label: "شاشة الفرع",
            eyebrow: "تجربة رقمية",
            title: "معلومات مرئية أثناء الزيارة",
            description: "شاشة مدمجة في الردهة لعرض محتوى سعودي دنت ومعلومات تهم المراجعين.",
            services: ["محتوى تعريفي", "إرشادات للزوار"],
            equipment: ["شاشة عرض داخل الردهة"],
            gallery: [{ src: `${khamisPath}/logo-lobby.webp`, alt: "شاشة وشعار سعودي دنت في الردهة" }],
            ctaLabel: "استعرض المزيد",
          },
          {
            id: "guest-care",
            x: 79,
            y: 70,
            label: "خدمة العملاء",
            eyebrow: "رعاية المراجع",
            title: "مساعدة مستمرة طوال الزيارة",
            description: "مسار قريب لدعم المراجع في المواعيد والاستفسارات والخطوات التالية.",
            services: ["دعم المواعيد", "متابعة الاستفسارات", "توضيح مسار الزيارة"],
            ctaLabel: "احجز موعدك",
          },
        ],
      },
      {
        id: "laboratory",
        label: "المختبر",
        eyebrow: "عمل دقيق",
        title: "بيئة مختبرية منظمة",
        description: "مشهد حقيقي لمحطات العمل والتجهيز داخل مختبر فرع خميس مشيط.",
        image: `${khamisPath}/laboratory.webp`,
        imageAlt: "مختبر سعودي دنت الحقيقي في فرع خميس مشيط",
        hotspots: [
          {
            id: "workstations",
            x: 46,
            y: 68,
            label: "محطات العمل",
            eyebrow: "المختبر",
            title: "مساحات عمل مهيأة للتفاصيل",
            description: "محطات متعددة تساعد الفريق على تنظيم خطوات العمل ضمن بيئة مضيئة وواضحة.",
            services: ["تنظيم خطوات العمل", "متابعة التفاصيل الفنية"],
            equipment: ["محطات عمل مستقلة", "إضاءة موجهة", "وحدات تخزين"],
            gallery: [{ src: `${khamisPath}/glass-lab.webp`, alt: "واجهة المختبر الزجاجية في فرع خميس مشيط" }],
            ctaLabel: "استعرض المزيد",
          },
          {
            id: "precision-tools",
            x: 22,
            y: 53,
            label: "التجهيزات الدقيقة",
            eyebrow: "التجهيز",
            title: "أدوات ضمن نطاق عمل مباشر",
            description: "توزيع عملي للأدوات والتجهيزات حول كل محطة لسهولة الوصول أثناء العمل.",
            services: ["تجهيز الأعمال المخبرية", "فحص ومراجعة التفاصيل"],
            equipment: ["أدوات عمل دقيقة", "إضاءة مكتبية موجهة"],
            ctaLabel: "استعرض المزيد",
          },
          {
            id: "workflow",
            x: 77,
            y: 45,
            label: "مسار العمل",
            eyebrow: "التنظيم",
            title: "كل مرحلة في مكانها",
            description: "توزيع مفتوح يدعم انتقال العمل بين المحطات مع حفظ المواد في وحدات واضحة.",
            services: ["تنظيم المواد", "تتابع مراحل العمل"],
            equipment: ["رفوف تخزين", "أسطح عمل ممتدة"],
            ctaLabel: "استعرض المزيد",
          },
        ],
      },
      {
        id: "radiology",
        label: "الأشعة",
        eyebrow: "الفحص والتشخيص",
        title: "رحلة تشخيص متكاملة",
        description: "تتكامل خطوات الفحص وعرض النتائج مع تجهيزات العيادة قبل وضع الخطة العلاجية.",
        image: `${khamisPath}/clinic-room.webp`,
        imageAlt: "غرفة علاج وفحص مجهزة في فرع سعودي دنت بخميس مشيط",
        imagePosition: "center",
        hotspots: [
          {
            id: "exam-zone",
            x: 26,
            y: 66,
            label: "منطقة الفحص",
            eyebrow: "الفحص",
            title: "نقطة انطلاق الخطة العلاجية",
            description: "مساحة علاج مجهزة لإجراء الفحص السريري وربط نتائجه بخطوات التشخيص المناسبة.",
            services: ["الفحص السريري", "تقييم الحالة", "تحديد الخطوة التالية"],
            equipment: ["وحدة وكرسي الأسنان", "إضاءة الفحص"],
            ctaLabel: "احجز موعدك",
          },
          {
            id: "results-screen",
            x: 58,
            y: 25,
            label: "شاشة النتائج",
            eyebrow: "عرض مرئي",
            title: "شرح أوضح للحالة",
            description: "شاشة داخل الغرفة تتيح عرض المعلومات المرئية ومناقشة الخطة مع المراجع.",
            services: ["عرض المعلومات", "شرح الخطة العلاجية"],
            equipment: ["شاشة عرض داخل العيادة"],
            ctaLabel: "استعرض المزيد",
          },
          {
            id: "clinical-equipment",
            x: 48,
            y: 52,
            label: "تجهيزات العيادة",
            eyebrow: "التجهيز",
            title: "أدوات قريبة من موضع العلاج",
            description: "ترتيب التجهيزات حول كرسي العلاج يدعم سهولة الوصول خلال خطوات الفحص والعلاج.",
            services: ["الفحص", "تجهيز الحالة للعلاج"],
            equipment: ["وحدة إضاءة", "أدوات الفحص الأساسية", "نظام شفط"],
            ctaLabel: "احجز موعدك",
          },
        ],
      },
      {
        id: "orthodontics",
        label: "عيادة تقويم",
        eyebrow: "تقويم الأسنان",
        title: "مساحة علاج بخطوات واضحة",
        description: "من الفحص إلى مناقشة الخطة، صُممت غرفة العلاج لتجربة هادئة ومنظمة.",
        image: `${khamisPath}/clinic-room.webp`,
        imageAlt: "غرفة علاج حقيقية في فرع سعودي دنت بخميس مشيط",
        imagePosition: "35% center",
        hotspots: [
          {
            id: "treatment-chair",
            x: 23,
            y: 69,
            label: "كرسي العلاج",
            eyebrow: "التقويم",
            title: "محطة الفحص والعلاج",
            description: "وحدة علاج متكاملة لإجراء الفحص ومتابعة مراحل العلاج داخل الغرفة.",
            services: ["فحص اصطفاف الأسنان", "متابعة مراحل التقويم", "إرشادات العناية"],
            equipment: ["وحدة وكرسي الأسنان", "إضاءة العلاج"],
            ctaLabel: "احجز موعدك",
          },
          {
            id: "exam-tools",
            x: 46,
            y: 53,
            label: "أدوات الفحص",
            eyebrow: "الدقة",
            title: "تجهيز قريب وسهل الوصول",
            description: "توزيع الأدوات حول موضع العلاج يدعم فحصًا منظمًا ومتابعة دقيقة.",
            services: ["الفحص الدوري", "متابعة تقدم العلاج"],
            equipment: ["أدوات الفحص الأساسية", "نظام شفط"],
            ctaLabel: "استعرض المزيد",
          },
          {
            id: "plan-screen",
            x: 59,
            y: 25,
            label: "شاشة الخطة",
            eyebrow: "الخطة العلاجية",
            title: "تفاصيل مرئية للمراجع",
            description: "مساحة عرض تساعد على شرح الخطوات ومناقشة رحلة العلاج بصورة أوضح.",
            services: ["شرح الخطة", "متابعة النتائج"],
            equipment: ["شاشة عرض داخل العيادة"],
            ctaLabel: "احجز موعدك",
          },
        ],
      },
      {
        id: "kids",
        label: "عيادة أطفال",
        eyebrow: "تجربة الأطفال",
        title: "زيارة تبدأ بمساحة محببة",
        description: "ركن حقيقي داخل الفرع يمنح الأطفال وقتًا ألطف قبل الانتقال إلى العناية السنية.",
        image: `${khamisPath}/kids-area.webp`,
        imageAlt: "منطقة الأطفال الحقيقية في فرع سعودي دنت بخميس مشيط",
        hotspots: [
          {
            id: "play-corner",
            x: 49,
            y: 71,
            label: "ركن الأطفال",
            eyebrow: "قبل الموعد",
            title: "مساحة صغيرة لانتظار ألطف",
            description: "ركن مهيأ للأطفال بطاولة ومقاعد ومساحة جلوس ضمن هوية مرحة وهادئة.",
            services: ["انتظار مريح للأطفال", "تهيئة قبل زيارة العيادة"],
            equipment: ["طاولة ومقاعد للأطفال", "مساحة جلوس لينة"],
            gallery: [{ src: `${khamisPath}/waiting.webp`, alt: "منطقة الانتظار في فرع خميس مشيط" }],
            ctaLabel: "احجز موعدك",
          },
          {
            id: "visual-wall",
            x: 72,
            y: 35,
            label: "الجدار التفاعلي",
            eyebrow: "تصميم مرح",
            title: "تفاصيل بصرية قريبة من الطفل",
            description: "رسومات مضاءة تضيف طابعًا محببًا إلى مساحة الأطفال داخل الفرع.",
            services: ["تهيئة نفسية لطيفة", "بيئة انتظار مناسبة للعائلة"],
            ctaLabel: "استعرض المزيد",
          },
        ],
      },
    ],
  },
  abha: {
    id: "abha",
    branchName: "أبها",
    title: "اكتشف فرع أبها",
    description: "جولة بصرية في مساحات الفرع الحقيقية من الوصول إلى غرفة العلاج.",
    scenes: [
      {
        id: "reception",
        label: "الاستقبال",
        eyebrow: "الوصول",
        title: "محطة استقبال هادئة وواضحة",
        description: "كاونتر مخصص لاستقبال المراجعين وتنظيم خطوات الزيارة.",
        image: `${abhaPath}/reception.webp`,
        imageAlt: "الاستقبال الحقيقي في فرع سعودي دنت بأبها",
        imagePosition: "center 62%",
        hotspots: [
          {
            id: "desk",
            x: 51,
            y: 69,
            label: "كاونتر الاستقبال",
            eyebrow: "الاستقبال",
            title: "بداية منظمة للزيارة",
            description: "نقطة تسجيل الوصول وتأكيد المواعيد وتوجيه المراجع داخل الفرع.",
            services: ["تأكيد الموعد", "خدمة الاستفسارات", "توجيه المراجع"],
            gallery: [{ src: `${abhaPath}/waiting-entrance.webp`, alt: "منطقة الانتظار عند مدخل فرع أبها" }],
            ctaLabel: "احجز موعدك",
          },
          {
            id: "welcome-display",
            x: 35,
            y: 45,
            label: "شاشة الترحيب",
            eyebrow: "معلومات الفرع",
            title: "محتوى مرئي عند الوصول",
            description: "شاشة استقبال لعرض معلومات تهم المراجع خلال وجوده في الفرع.",
            services: ["محتوى تعريفي", "معلومات للزوار"],
            equipment: ["شاشة استقبال"],
            ctaLabel: "استعرض المزيد",
          },
        ],
      },
      {
        id: "waiting",
        label: "الانتظار",
        eyebrow: "راحة المراجع",
        title: "مساحة انتظار رحبة",
        description: "جلسات موزعة ضمن مساحة مضيئة ومفتوحة في فرع أبها.",
        image: `${abhaPath}/waiting-main.webp`,
        imageAlt: "منطقة الانتظار الرئيسية في فرع سعودي دنت بأبها",
        hotspots: [
          {
            id: "seating",
            x: 69,
            y: 70,
            label: "منطقة الجلوس",
            eyebrow: "الانتظار",
            title: "جلسات موزعة براحة",
            description: "مقاعد متعددة مع مساحات حركة واضحة ضمن صالة الانتظار.",
            services: ["انتظار المواعيد", "مساحة مناسبة للمرافقين"],
            gallery: [{ src: `${abhaPath}/waiting-entrance.webp`, alt: "جلسات الانتظار قرب مدخل فرع أبها" }],
            ctaLabel: "احجز موعدك",
          },
          {
            id: "open-path",
            x: 30,
            y: 62,
            label: "مسار الحركة",
            eyebrow: "سهولة الوصول",
            title: "حركة واضحة داخل الصالة",
            description: "مسار مفتوح يربط منطقة الانتظار ببقية مرافق الفرع.",
            services: ["وصول واضح", "تنقل مريح داخل الفرع"],
            ctaLabel: "استعرض المزيد",
          },
        ],
      },
      {
        id: "corridor",
        label: "الممرات",
        eyebrow: "داخل الفرع",
        title: "مسار بصري منظم",
        description: "ممرات مضيئة تقود إلى غرف العلاج ومساحات الخدمة.",
        image: `${abhaPath}/clinic-corridor.webp`,
        imageAlt: "ممر العيادات الحقيقي في فرع سعودي دنت بأبها",
        hotspots: [
          {
            id: "clinic-route",
            x: 44,
            y: 68,
            label: "مسار العيادات",
            eyebrow: "التنقل",
            title: "طريق واضح إلى غرف العلاج",
            description: "ممر يربط مناطق الخدمة بغرف العلاج داخل الفرع.",
            services: ["الوصول إلى العيادات", "تنظيم حركة المراجعين"],
            gallery: [{ src: `${abhaPath}/doctor-room-sign.webp`, alt: "شاشة تعريف عند غرفة علاج في فرع أبها" }],
            ctaLabel: "استعرض المزيد",
          },
          {
            id: "digital-guide",
            x: 67,
            y: 43,
            label: "الدليل الرقمي",
            eyebrow: "التعريف",
            title: "معلومة قريبة من مسار الزيارة",
            description: "شاشة داخل الممر تعرض معلومات تعريفية ضمن تجربة الفرع.",
            services: ["تعريف بصري", "معلومات أثناء التنقل"],
            equipment: ["شاشة رقمية مستقلة"],
            ctaLabel: "استعرض المزيد",
          },
        ],
      },
      {
        id: "treatment",
        label: "غرفة العلاج",
        eyebrow: "العناية السنية",
        title: "تجهيز متكامل حول المراجع",
        description: "غرفة علاج حقيقية تضم وحدة الأسنان والإضاءة وشاشة العمل.",
        image: `${abhaPath}/clinic-room.webp`,
        imageAlt: "غرفة العلاج الحقيقية في فرع سعودي دنت بأبها",
        hotspots: [
          {
            id: "chair",
            x: 38,
            y: 70,
            label: "كرسي العلاج",
            eyebrow: "غرفة العلاج",
            title: "مركز خطوات الفحص والعناية",
            description: "وحدة علاج تحيط بها التجهيزات الأساسية لإجراء الفحص والعناية السنية.",
            services: ["الفحص السريري", "العناية السنية", "متابعة الخطة"],
            equipment: ["وحدة وكرسي الأسنان", "إضاءة العلاج", "نظام شفط"],
            ctaLabel: "احجز موعدك",
          },
          {
            id: "work-screen",
            x: 58,
            y: 39,
            label: "شاشة العمل",
            eyebrow: "المتابعة",
            title: "المعلومات أمام فريق العلاج",
            description: "شاشة موضوعة ضمن نطاق العمل لدعم متابعة معلومات الزيارة.",
            services: ["متابعة معلومات الحالة", "دعم شرح الخطة"],
            equipment: ["شاشة عمل داخل العيادة"],
            ctaLabel: "استعرض المزيد",
          },
          {
            id: "light",
            x: 34,
            y: 18,
            label: "إضاءة العلاج",
            eyebrow: "التجهيز",
            title: "إضاءة موجهة لموضع العلاج",
            description: "وحدة إضاءة قابلة للحركة ومتمركزة فوق كرسي العلاج.",
            services: ["دعم الفحص", "إضاءة موضع العلاج"],
            equipment: ["وحدة إضاءة متحركة"],
            ctaLabel: "احجز موعدك",
          },
        ],
      },
      {
        id: "screens",
        label: "شاشات الفرع",
        eyebrow: "تجربة رقمية",
        title: "محتوى مرئي في نقاط الانتظار",
        description: "شاشات مدمجة في مساحات الفرع لتقديم محتوى سعودي دنت للزوار.",
        image: `${abhaPath}/lobby-screen.webp`,
        imageAlt: "شاشة الردهة الحقيقية في فرع سعودي دنت بأبها",
        hotspots: [
          {
            id: "lobby-display",
            x: 45,
            y: 38,
            label: "شاشة الردهة",
            eyebrow: "المحتوى",
            title: "تجربة تعريفية أثناء الانتظار",
            description: "شاشة كبيرة داخل الردهة تعرض محتوى مرئيًا ضمن تجربة الفرع.",
            services: ["محتوى تعريفي", "معلومات للزوار"],
            equipment: ["شاشة عرض كبيرة"],
            gallery: [{ src: `${abhaPath}/doctor-room-sign.webp`, alt: "شاشة تعريف عند غرفة علاج في فرع أبها" }],
            ctaLabel: "استعرض المزيد",
          },
        ],
      },
    ],
  },
};
