const NODES_DATA = [
    {
        id: "core",
        section: "Overview",
        titleEn: "Amplifier",
        titleAr: "مُضخِّم الإشارات",
        contentEn: "Core electronic building block used to amplify and process electrical signals.",
        contentAr: "العنصر الأساسي في الدوائر الإلكترونية لتكبير ومعالجة الإشارات الكهربائية."
    },
    {
        id: "definition",
        section: "1. Definition",
        titleEn: "Definition",
        titleAr: "تعريف المُضخِّم",
        contentEn: "An amplifier is an electronic device or circuit that increases the amplitude of an electrical signal using energy from an external power supply.",
        contentAr: "جهاز أو دائرة إلكترونية تزيد من سعة الإشارة الكهربائية باستخدام طاقة من مصدر تغذية خارجي."
    },
    {
        id: "principle",
        section: "2. Working Principle",
        titleEn: "Working Principle",
        titleAr: "مبدأ العمل",
        contentEn: "It receives a weak input signal and produces a stronger output signal by controlling energy from a power supply.\n\nInput Signal → Amplifier → Output Signal",
        contentAr: "يستقبل إشارة دخل ضعيفة وينتج إشارة خرج أقوى عبر التحكم في طاقة مصدر التغذية."
    },
    {
        id: "comp-input",
        section: "3. Main Components",
        titleEn: "Input Signal",
        titleAr: "إشارة الدخل",
        contentEn: "The original weak electrical signal that needs to be amplified.",
        contentAr: "الإشارة الكهربائية الأصلية الضعيفة المُراد تكبيرها."
    },
    {
        id: "comp-element",
        section: "3. Main Components",
        titleEn: "Amplifying Element",
        titleAr: "عنصر التضخيم",
        contentEn: "The active component (such as a Transistor) that performs the amplification process.",
        contentAr: "عنصر التكبير الفعلي في الدائرة (مثل الترانزستور Transistor)."
    },
    {
        id: "comp-power",
        section: "3. Main Components",
        titleEn: "Power Supply",
        titleAr: "مصدر التغذية",
        contentEn: "Provides the external electrical energy required to produce the stronger output signal.",
        contentAr: "يوفر الطاقة الكهربائية الخارجية اللازمة لإنتاج إشارة خرج قوية."
    },
    {
        id: "comp-output",
        section: "3. Main Components",
        titleEn: "Output Signal",
        titleAr: "إشارة الخرج",
        contentEn: "The amplified signal produced by the circuit and delivered to the load.",
        contentAr: "الإشارة المكبرة الناتجة من الدائرة والمسلمة للحمل."
    },
    {
        id: "type-voltage",
        section: "4. Types of Amplifiers",
        titleEn: "Voltage Amplifier",
        titleAr: "مضخم الجهد",
        contentEn: "Increases voltage.",
        contentAr: "مضخم مخصص لزيادة فرق الجهد الكهربائي للإشارة."
    },
    {
        id: "type-current",
        section: "4. Types of Amplifiers",
        titleEn: "Current Amplifier",
        titleAr: "مضخم التيار",
        contentEn: "Increases current.",
        contentAr: "مضخم مخصص لزيادة شدة التيار الكهربائي للإشارة."
    },
    {
        id: "type-power",
        section: "4. Types of Amplifiers",
        titleEn: "Power Amplifier",
        titleAr: "مضخم القدرة",
        contentEn: "Increases power delivered to a load.",
        contentAr: "مضخم يزيد القدرة الكهربائية الكلية المسلّمة للحمل."
    },
    {
        id: "type-opamp",
        section: "4. Types of Amplifiers",
        titleEn: "Operational Amplifier (Op-Amp)",
        titleAr: "المضخم التشغيلي",
        contentEn: "Used for amplification and signal processing.",
        contentAr: "دائرة متكاملة تستخدم لتكبير ومعالجة الإشارات والعمليات الحسابية التناظرية."
    },
    {
        id: "app-audio",
        section: "5. Applications",
        titleEn: "Audio Systems",
        titleAr: "أنظمة الصوت",
        contentEn: "Used in audio and sound systems.",
        contentAr: "يُستخدم في أنظمة الصوت ومكبرات الصوت السمعية."
    },
    {
        id: "app-medical",
        section: "5. Applications",
        titleEn: "Medical Devices",
        titleAr: "الأجهزة الطبية",
        contentEn: "Used in medical devices, such as ECG machines.",
        contentAr: "يُستخدم في الأجهزة الطبية مثل أجهزة تخطيط القلب (ECG)."
    },
    {
        id: "app-radio",
        section: "5. Applications",
        titleEn: "Radio & Communication",
        titleAr: "الاتصالات والراديو",
        contentEn: "Used in radio and communication systems.",
        contentAr: "يُستخدم في أنظمة الراديو والاتصالات اللاسلكية."
    },
    {
        id: "app-scientific",
        section: "5. Applications",
        titleEn: "Measuring Instruments",
        titleAr: "أجهزة القياس",
        contentEn: "Used in scientific measuring instruments.",
        contentAr: "يُستخدم في أجهزة القياس والاختبار العلمية والمعملية."
    },
    {
        id: "gain",
        section: "6. Voltage Gain",
        titleEn: "Voltage Gain Equation",
        titleAr: "معادلة كسب الجهد",
        contentEn: "Voltage gain measures how much the output voltage increases relative to the input voltage:\n\nAv = Vout / Vin",
        contentAr: "مقياس يحدد نسبة زيادة جهد الخرج بالنسبة لجهد الدخل:\n\nAv = Vout / Vin"
    },
    {
        id: "conclusion",
        section: "7. Conclusion",
        titleEn: "Conclusion",
        titleAr: "الخاتمة",
        contentEn: "Amplifiers are essential components in modern electronics because they strengthen electrical signals and make them useful in many applications.",
        contentAr: "المضخمات مكونات أساسية في الإلكترونيات الحديثة لأنها تقوي الإشارات وتجعلها قابلة للاستخدام في تطبيقات متعددة."
    }
];
