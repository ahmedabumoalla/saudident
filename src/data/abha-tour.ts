export const abhaTourScenes = Array.from({ length: 11 }, (_, index) => {
  const number = index + 1;
  return {
    id: `abha-${String(number).padStart(2, "0")}`,
    number,
    image: `/assets/branches/abha/tour/abha-tour-${String(number).padStart(2, "0")}.webp`,
    alt: `المشهد رقم ${number} من الجولة التفاعلية داخل فرع سعودي دنت بأبها`,
  };
});

export type AbhaTourItemKind =
  | "arrow"
  | "clinic"
  | "sterilization"
  | "radiology"
  | "lounge"
  | "reception"
  | "prayer"
  | "examination"
  | "administration";

export type AbhaTourOverlay = {
  id: string;
  sceneId: string;
  kind: AbhaTourItemKind;
  x: number;
  y: number;
  scale: number;
  angle: number;
  tilt: number;
  depth: number;
  required?: boolean;
  targetSceneNumber?: number;
};

export const abhaTourItemLabels: Record<AbhaTourItemKind, string> = {
  arrow: "سهم انتقال",
  clinic: "عيادة",
  sterilization: "التعقيم المركزي",
  radiology: "أشعة",
  lounge: "استراحة",
  reception: "استقبال",
  prayer: "مصلى",
  examination: "فحص",
  administration: "مكتب إداري",
};

export type AbhaTourItemContent = {
  eyebrow: string;
  title: string;
  message: string;
};

export const abhaTourItemContentById: Record<string, AbhaTourItemContent> = {
  "abha-01-administration-1": {
    eyebrow: "المكتب الإداري في سعودي دنت",
    title: "تنسيق يدعم جودة كل زيارة",
    message: "نعمل خلف الكواليس لتنظيم تفاصيل الفرع ودعم فرقنا حتى تصل إليك عناية أكثر سلاسة واهتمامًا",
  },
  "abha-02-lounge-1": {
    eyebrow: "استراحة سعودي دنت",
    title: "لحظة هدوء تكمّل راحتك",
    message: "هيأنا لك مساحة مريحة تستعيد فيها هدوءك لأن راحتك جزء أساسي من تجربة سعودي دنت",
  },
  "abha-03-clinic-1": {
    eyebrow: "عيادة سعودي دنت",
    title: "نستمع أولًا لنعتني بدقة",
    message: "نفهم احتياجك ونراجع تفاصيل حالتك لنضع لك خطة علاج واضحة تبدأ معها رحلتك بثقة",
  },
  "abha-03-clinic-2": {
    eyebrow: "عيادة سعودي دنت",
    title: "خبرة تقود ابتسامتك بثقة",
    message: "نجمع بين الخبرة الطبية والتقنيات الحديثة لنقدم عناية متوازنة تراعي راحتك وتطلعاتك",
  },
  "abha-03-sterilization-1": {
    eyebrow: "التعقيم المركزي في سعودي دنت",
    title: "معايير دقيقة تحمي كل ابتسامة",
    message: "تمر الأدوات بمراحل تعقيم ومراجعة منظمة لضمان جاهزيتها وفق معايير تحافظ على سلامتك واطمئنانك",
  },
  "abha-04-lounge-1": {
    eyebrow: "استراحة سعودي دنت",
    title: "راحة تشبه اهتمامنا بك",
    message: "صممنا هذه المساحة لتمنحك الهدوء بين خطوات زيارتك وتبقي تجربتك أخف وأكثر راحة",
  },
  "abha-04-reception-1": {
    eyebrow: "استقبال سعودي دنت",
    title: "استقبال يختصر عليك الطريق",
    message: "نرتب موعدك ونوجهك إلى الوجهة المناسبة بوضوح لتبدأ زيارتك بسهولة واطمئنان",
  },
  "abha-05-administration-1": {
    eyebrow: "المكتب الإداري في سعودي دنت",
    title: "تنظيم يصنع تجربة أكثر سلاسة",
    message: "ننسق تفاصيل العمل داخل الفرع وندعم فرقنا لتبقى جودة الخدمة حاضرة في كل خطوة من زيارتك",
  },
  "abha-05-clinic-1": {
    eyebrow: "عيادة سعودي دنت",
    title: "خطة تبدأ من فهم احتياجك",
    message: "نستمع إليك بعناية ونبني خطة علاج تناسب حالتك لتكون كل خطوة أوضح وأكثر راحة",
  },
  "abha-05-clinic-2": {
    eyebrow: "عيادة سعودي دنت",
    title: "دقة تواكب كل مرحلة",
    message: "نتابع تقدمك ونهتم بالتفاصيل الصغيرة لنقودك نحو نتيجة صحية تمنحك الثقة بابتسامتك",
  },
  "abha-05-reception-1": {
    eyebrow: "استقبال سعودي دنت",
    title: "بداية واضحة لزيارة مطمئنة",
    message: "نستقبلك باهتمام ونرتب تفاصيل زيارتك لتصل إلى خدمتك بسهولة ومن دون تعقيد",
  },
  "abha-06-prayer-1": {
    eyebrow: "مصلى سعودي دنت",
    title: "مساحة سكينة تراعي وقتك",
    message: "وفرنا لك مكانًا هادئًا ومهيأً لأن عنايتنا بتجربتك تشمل راحتك وخصوصيتك في كل وقت",
  },
  "abha-06-sterilization-1": {
    eyebrow: "التعقيم المركزي في سعودي دنت",
    title: "جاهزية موثوقة قبل كل إجراء",
    message: "نتبع خطوات دقيقة في التعقيم والتغليف والحفظ لتصل الأدوات إلى العيادة جاهزة وآمنة",
  },
  "abha-07-clinic-1": {
    eyebrow: "عيادة سعودي دنت",
    title: "عناية شخصية تليق بثقتك",
    message: "نخصص وقتًا لفهم حالتك ونقدم لك رعاية تراعي احتياجك وتمنحك وضوحًا في كل مرحلة",
  },
  "abha-07-clinic-2": {
    eyebrow: "عيادة سعودي دنت",
    title: "تقنيات حديثة واهتمام إنساني",
    message: "نوظف خبرتنا وتقنياتنا لخدمة احتياجك مع اهتمام يحافظ على راحتك وثقتك طوال الرحلة",
  },
  "abha-07-reception-1": {
    eyebrow: "استقبال سعودي دنت",
    title: "نرتب زيارتك من أول خطوة",
    message: "نساعدك في تنظيم موعدك والوصول إلى العيادة المناسبة لتبدأ تجربتك براحة ووضوح",
  },
  "abha-08-lounge-1": {
    eyebrow: "استراحة سعودي دنت",
    title: "هدوء يرافقك بين خطوات العناية",
    message: "هيأنا لك مساحة تستعيد فيها راحتك لأن شعورك بالطمأنينة جزء من جودة الرعاية التي نقدمها",
  },
  "abha-08-radiology-1": {
    eyebrow: "الأشعة في سعودي دنت",
    title: "صورة أدق لقرار أوضح",
    message: "تدعم تقنيات التصوير فهم الحالة بدقة وتساعد فريقك الطبي على بناء خطة علاج أكثر وضوحًا",
  },
  "abha-09-lounge-1": {
    eyebrow: "استراحة سعودي دنت",
    title: "مساحتك للراحة والاطمئنان",
    message: "نمنحك مكانًا هادئًا يخفف انتظارك ويجعل كل لحظة في زيارتك أكثر راحة",
  },
  "abha-10-clinic-1": {
    eyebrow: "عيادة سعودي دنت",
    title: "فهم دقيق يصنع عناية أنسب",
    message: "نبدأ بتقييم احتياجك ونشرح لك الخيارات بوضوح لتشاركنا القرار وتطمئن إلى خطتك",
  },
  "abha-10-clinic-2": {
    eyebrow: "عيادة سعودي دنت",
    title: "متابعة تقرّبك من النتيجة",
    message: "نراجع تقدم علاجك بعناية ونواكب كل مرحلة لتبقى خطواتك ثابتة وتجربتك مريحة",
  },
  "abha-10-lounge-1": {
    eyebrow: "استراحة سعودي دنت",
    title: "تفاصيل هادئة تصنع فرقًا",
    message: "اخترنا لهذه المساحة أجواء مريحة لأن جودة زيارتك تبدأ قبل العيادة وتستمر بعدها",
  },
  "abha-10-reception-1": {
    eyebrow: "استقبال سعودي دنت",
    title: "نستقبلك باهتمام ونوجهك بثقة",
    message: "فريق الاستقبال حاضر لتنظيم زيارتك والإجابة عن استفسارك وتوجيهك إلى خطوتك التالية",
  },
  "abha-11-clinic-1": {
    eyebrow: "عيادة سعودي دنت",
    title: "رعاية تبدأ بك وتناسبك",
    message: "نضع احتياجك في مركز الاهتمام ونقدم لك خطة واضحة تجمع بين الدقة والراحة",
  },
  "abha-11-clinic-2": {
    eyebrow: "عيادة سعودي دنت",
    title: "اهتمام مستمر في كل زيارة",
    message: "نرافقك بالمتابعة ونراجع تفاصيل علاجك لتبقى تجربتك مطمئنة ونتيجتك أقرب لتوقعاتك",
  },
  "abha-11-clinic-3": {
    eyebrow: "عيادة سعودي دنت",
    title: "ابتسامتك تستحق دقة أكبر",
    message: "نجمع خبرة الفريق وجودة التجهيز لنمنحك عناية موثوقة تشعر بفرقها في كل خطوة",
  },
  "abha-11-reception-1": {
    eyebrow: "استقبال سعودي دنت",
    title: "خدمتك تبدأ بابتسامة",
    message: "نرحب بك ونرتب تفاصيل موعدك ونساعدك على الوصول إلى الخدمة المناسبة بسهولة",
  },
};

const abhaTourFallbackContent: Record<Exclude<AbhaTourItemKind, "arrow">, AbhaTourItemContent> = {
  clinic: {
    eyebrow: "عيادة سعودي دنت",
    title: "عناية دقيقة تبدأ بفهمك",
    message: "نستمع إلى احتياجك ونبني معك رحلة علاج واضحة تمنحك الراحة والثقة",
  },
  sterilization: {
    eyebrow: "التعقيم المركزي في سعودي دنت",
    title: "سلامتك تبدأ من أدق التفاصيل",
    message: "نطبق مراحل تعقيم منظمة تضمن جاهزية الأدوات وتحافظ على معايير السلامة في كل زيارة",
  },
  radiology: {
    eyebrow: "الأشعة في سعودي دنت",
    title: "دقة تساعدنا على رؤيتك بوضوح",
    message: "تمنحنا تقنيات التصوير تفاصيل أدق تساعد على توجيه خطتك العلاجية بثقة",
  },
  lounge: {
    eyebrow: "استراحة سعودي دنت",
    title: "راحتك حاضرة في كل لحظة",
    message: "هيأنا لك مساحة هادئة لأن راحتك جزء أصيل من تجربة سعودي دنت",
  },
  reception: {
    eyebrow: "استقبال سعودي دنت",
    title: "بداية سهلة لزيارة أكثر راحة",
    message: "ننظم زيارتك ونوجهك إلى الخدمة المناسبة باهتمام ووضوح",
  },
  prayer: {
    eyebrow: "مصلى سعودي دنت",
    title: "مساحة هادئة تراعي وقتك",
    message: "وفرنا لك مكانًا مهيأً يحفظ راحتك وخصوصيتك أثناء زيارتك",
  },
  examination: {
    eyebrow: "الفحص في سعودي دنت",
    title: "فهم أوضح قبل بدء العلاج",
    message: "نبدأ بفحص دقيق يساعدنا على تحديد احتياجك وتوجيهك إلى الخطوة الأنسب",
  },
  administration: {
    eyebrow: "المكتب الإداري في سعودي دنت",
    title: "تنظيم يدعم جودة تجربتك",
    message: "ننسق تفاصيل العمل داخل الفرع لضمان خدمة أكثر سلاسة واهتمامًا",
  },
};

export function getAbhaTourItemContent(item: Pick<AbhaTourOverlay, "id" | "kind">): AbhaTourItemContent | null {
  if (item.kind === "arrow") return null;
  return abhaTourItemContentById[item.id] ?? abhaTourFallbackContent[item.kind];
}
