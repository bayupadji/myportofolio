import { Project } from "@/domain/entities/Project";
import { Profile } from "@/domain/entities/Profile";
import { Experience } from "@/domain/entities/Experience";
import { Skill } from "@/domain/entities/Skill";
import { Service } from "@/domain/entities/Service";

export const seedProfile: Profile = {
  id: "profile-1",
  name: "Bayu",
  role: {
    en: "Generalist Product Designer (UI/UX)",
    id: "Product Designer Generalis (UI/UX)",
  },
  headline: {
    en: "Crafting clear, high-impact digital experiences across web, mobile, and complex systems.",
    id: "Merancang pengalaman digital yang jelas dan berdampak tinggi lintas web, mobile, dan sistem kompleks.",
  },
  summary: {
    en: "Generalist Product Designer with 6+ years orchestrating end-to-end design: user research, information architecture, interaction design, and design systems. Focused on measurable business outcomes and rigorous craft.",
    id: "Product Designer generalis dengan 6+ tahun pengalaman menangani desain end-to-end: riset pengguna, arsitektur informasi, interaksi, dan design system. Berfokus pada dampak bisnis terukur dan kualitas eksekusi yang presisi.",
  },
  location: "Jakarta, Indonesia (UTC+7) · Available Worldwide",
  email: "bayu.design@example.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  cvUrl: "/cv/Bayu-Product-Designer-Resume.pdf",
  availabilityStatus: {
    en: "Available for Full-time & Selected Freelance",
    id: "Terbuka untuk Peluang Kerja & Freelance Terpilih",
  },
  isAvailableForFreelance: true,
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/bayu-designer", handle: "linkedin.com/in/bayu-designer" },
    { platform: "GitHub", url: "https://github.com/bayu-design", handle: "github.com/bayu-design" },
    { platform: "Figma", url: "https://figma.com/@bayu", handle: "figma.com/@bayu" },
    { platform: "Dribbble", url: "https://dribbble.com/bayu", handle: "dribbble.com/bayu" },
  ],
  keyMetrics: [
    {
      value: "6+",
      label: { en: "Years Experience", id: "Tahun Pengalaman" },
      description: { en: "Building B2B & B2C products", id: "Membangun produk B2B & B2C" },
    },
    {
      value: "100M+",
      label: { en: "Users Impacted", id: "Pengguna Terdampak" },
      description: { en: "Through payment & consumer apps", id: "Melalui produk fintech & konsumen" },
    },
    {
      value: "28%",
      label: { en: "Drop-off Reduction", id: "Penurunan Drop-off" },
      description: { en: "In merchant payment funnel", id: "Pada alur pembayaran merchant" },
    },
    {
      value: "3.4x",
      label: { en: "Handoff Velocity", id: "Kecepatan Handoff" },
      description: { en: "With unified token design system", id: "Melalui implementasi token design system" },
    },
  ],
};

export const seedProjects: Project[] = [
  {
    id: "proj-1",
    slug: "paypulse-merchant-checkout",
    title: {
      en: "PayPulse: Streamlining Multi-Payment Checkout for Merchants",
      id: "PayPulse: Optimasi Alur Pembayaran Multi-Channel untuk Merchant",
    },
    summary: {
      en: "Redesigning a high-volume payment checkout SDK to cut transaction friction and boost completion rates by 28%.",
      id: "Mendesain ulang SDK checkout pembayaran bervolume tinggi untuk memangkas friksi dan meningkatkan konversi sebesar 28%.",
    },
    role: "Lead Product Designer (Research, IA, Prototyping)",
    duration: "3 Months (Q1 2025)",
    team: "1 PM, 1 Tech Lead, 3 Full-stack Engineers, 1 UX Researcher",
    platforms: ["Web SDK", "iOS & Android Mobile SDK", "Merchant Dashboard"],
    tools: ["Figma", "Maze", "ProtoPie", "Tailwind CSS"],
    category: "Fintech",
    coverUrl:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { value: "+28%", label: { en: "Checkout Completion Rate", id: "Tingkat Penyelesaian Transaksi" } },
      { value: "18s", label: { en: "Avg. Completion (from 42s)", id: "Rata-rata Waktu Transaksi (dari 42d)" } },
      { value: "-64%", label: { en: "Drop-off during 3D Secure verification", id: "Drop-off saat Verifikasi 3D Secure" } },
    ],
    tldr: {
      problem: {
        en: "Merchants suffered an alarming 41% drop-off at checkout due to cognitive overload, hidden fees, and fractured 3D Secure transitions.",
        id: "Merchant mengalami tingkat kegagalan transaksi sebesar 41% karena informasi yang membingungkan, biaya tersembunyi, dan transisi 3D Secure yang terputus.",
      },
      solution: {
        en: "Unified accordion payment method architecture with smart fee transparency, progressive authentication, and instant fallback channels.",
        id: "Merancang arsitektur pembayaran accordion terpadu dengan transparansi biaya instan, autentikasi progresif, dan opsi pembayaran cadangan otomatis.",
      },
      impact: {
        en: "Increased successful checkouts by 28%, saved 24 seconds per customer journey, and deployed across 450+ partner merchants.",
        id: "Meningkatkan konversi transaksi sebesar 28%, memangkas waktu transaksi 24 detik, dan diimplementasikan di 450+ mitra merchant.",
      },
    },
    sections: [
      {
        id: "sec-1",
        type: "context",
        title: { en: "Context & Business Goals", id: "Konteks & Tujuan Bisnis" },
        body: {
          en: "PayPulse serves high-velocity e-commerce merchants in Southeast Asia. While backend processing latency was under 400ms, the user drop-off rate was high. The leadership team set a strict objective: increase completion by at least 15% without compromising fraud prevention or regulatory requirements.",
          id: "PayPulse melayani ribuan merchant e-commerce bervolume tinggi di Asia Tenggara. Meskipun latensi sistem backend di bawah 400ms, tingkat drop-off checkout mencapai angka yang mengkhawatirkan. Manajemen menargetkan kenaikan transaksi minimal 15% tanpa mengorbankan keamanan fraud maupun kepatuhan regulasi.",
        },
        highlights: [
          { en: "Over $12M monthly GMV at stake", id: "Volume transaksi bulanan lebih dari $12M terdampak" },
          { en: "Legacy interface had 9 disjointed payment steps", id: "Antarmuka lama memiliki 9 langkah pembayaran terpisah" },
          { en: "Mobile users accounted for 78% of all drop-offs", id: "78% drop-off berasal dari pengguna perangkat mobile" },
        ],
      },
      {
        id: "sec-2",
        type: "research",
        title: { en: "User Research & Problem Definition", id: "Riset Pengguna & Definisi Masalah" },
        body: {
          en: "Through 18 moderated usability tests and 1,200 Hotjar session recordings, we identified three critical friction vectors: unannounced processing surcharges at step 3, failure to auto-save preferred local payment methods (QRIS, E-Wallet, Virtual Accounts), and disruptive redirects to unbranded bank authentication screens.",
          id: "Melalui 18 sesi uji usabilitas termoderasi dan analisis rekaman 1.200 sesi, kami menemukan tiga titik gesekan utama: biaya admin mendadak di langkah terakhir, ketiadaan memori metode pembayaran favorit (QRIS, E-Wallet, VA), dan perpindahan ke halaman autentikasi bank pihak ketiga yang tidak responsif.",
        },
        highlights: [
          { en: "73% of users felt anxious when redirected outside the merchant store", id: "73% pengguna merasa was-was saat dialihkan ke luar toko merchant" },
          { en: "Payment fee surprise accounted for 48% of deliberate cancellations", id: "Biaya admin tak terduga menjadi alasan 48% pembatalan sepihak" },
        ],
      },
      {
        id: "sec-3",
        type: "process",
        title: { en: "Design Decisions & Information Architecture", id: "Keputusan Desain & Arsitektur Informasi" },
        body: {
          en: "We discarded the multi-page wizard in favor of a single-surface progressive accordion. Smart method detection pre-selects the fastest available payment based on user device and historical tokens. Total price updates dynamically in real-time, eliminating surprises.",
          id: "Kami menghapus alur multi-halaman dan menggantinya dengan accordion satu halaman yang adaptif. Sistem secara cerdas menyarankan metode tercepat berdasarkan riwayat dan tipe perangkat, disertai pembaruan rincian biaya secara langsung (real-time).",
        },
      },
      {
        id: "sec-4",
        type: "solution",
        title: { en: "Final Solution & UI States", id: "Solusi Final & Ragam State UI" },
        body: {
          en: "Every micro-interaction was engineered for zero latency perception. We designed comprehensive edge states: network timeout with 1-click retry, banking OTP expiration with countdown recovery, and automated QRIS barcode brightness boost on mobile screens.",
          id: "Setiap mikro-interaksi dirancang untuk meminimalkan persepsi waktu tunggu. Kami merancang state komprehensif: pemulihan otomatis saat jaringan terputus, batas waktu OTP dengan opsi kirim ulang instan, dan peningkatan kontras QRIS otomatis pada layar ponsel.",
        },
      },
      {
        id: "sec-5",
        type: "impact",
        title: { en: "Impact & Key Learnings", id: "Dampak & Pembelajaran Utama" },
        body: {
          en: "Within 60 days of the A/B testing rollout, PayPulse saw a 28% increase in successful checkouts. The merchant NPS score improved from +14 to +49. Key learning: in financial checkouts, perceived transparency and speed build trust far more effectively than purely decorative visual embellishments.",
          id: "Dalam 60 hari uji A/B, PayPulse mencatatkan lonjakan transaksi sukses sebesar 28%. Skor kepuasan merchant (NPS) melonjak dari +14 ke +49. Pembelajaran utama: pada alur transaksi keuangan, transparansi biaya dan kecepatan interaksi membangun rasa aman jauh lebih baik dibanding dekorasi visual semata.",
        },
      },
    ],
    solutionStates: [
      {
        title: { en: "Default Checkout State", id: "State Default Checkout" },
        description: { en: "Clean single-view layout with pre-selected favorite payment method and sticky live price breakdown.", id: "Tata letak ringkas dengan metode favorit terpilih otomatis dan rincian harga sticky transparan." },
        stateType: "default",
        previewUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "Instant Retrying / Empty State", id: "State Pemulihan / Kosong" },
        description: { en: "When bank API reports momentary downtime, alternative low-fee channels are proactively recommended.", id: "Ketika channel bank tertentu sedang maintenance, sistem langsung merekomendasikan metode alternatif tanpa mengulang alur." },
        stateType: "empty",
        previewUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "Network & Payment Error Recovery", id: "State Penanganan Error" },
        description: { en: "Human-readable failure explanation with one-tap card re-entry without clearing previously filled data.", id: "Pesan kendala dengan bahasa manusia tanpa istilah teknis, memungkinkan pengisian ulang tanpa mereset data sebelumnya." },
        stateType: "error",
        previewUrl: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "Optimistic Loading & Skeleton Feedback", id: "State Loading & Animasi Verifikasi" },
        description: { en: "Smooth 180ms skeleton transitions with secure biometric confirmation cue.", id: "Transisi skeleton halus 180ms dengan indikator biometrik yang meyakinkan pengguna." },
        stateType: "loading",
        previewUrl: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    learnings: [
      { en: "Clarity and price transparency always beat gamification in payment funnels.", id: "Transparansi biaya dan kemudahan alur selalu mengalahkan elemen dekoratif pada transaksi pembayaran." },
      { en: "Mobile touch targets must comfortably exceed 48px to prevent frustrating miss-taps under time pressure.", id: "Target sentuh mobile wajib di atas 48px agar tidak terjadi salah tekan saat pengguna terburu-buru." },
      { en: "Edge states (network drop, OTP expiry) should be designed as primary flows, not afterthoughts.", id: "Kondisi error (koneksi terputus, OTP kedaluwarsa) harus diperlakukan sebagai alur prioritas, bukan sekadar pelengkap." },
    ],
    status: "published",
    isSampleProject: true,
    order: 1,
    publishedAt: new Date().toISOString(),
  },
  {
    id: "proj-2",
    slug: "omniflow-logistics-control-tower",
    title: {
      en: "OmniFlow: Enterprise Fleet Dispatch & Operations Control Tower",
      id: "OmniFlow: Dashboard Operasional & Kendali Armada Logistik Skala Besar",
    },
    summary: {
      en: "Transforming a cluttered legacy transport management tool into a high-density, real-time command center.",
      id: "Mentransformasi sistem logistik warisan menjadi pusat kendali armada berkecepatan tinggi dengan efisiensi waktu 41%.",
    },
    role: "Senior Product Designer (Design Systems, Information Architecture)",
    duration: "4 Months (Q3 2024)",
    team: "2 Product Managers, 4 Backend Engineers, 2 Frontend Engineers",
    platforms: ["Desktop Web (1200px+)", "Rugged Tablet View"],
    tools: ["Figma", "Storybook", "React", "AG-Grid"],
    category: "Admin Tools",
    coverUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { value: "-41%", label: { en: "Dispatch Turnaround Time", id: "Efisiensi Waktu Alokasi Armada" } },
      { value: "99.4%", label: { en: "On-Time Delivery SLA Adherence", id: "Kepatuhan SLA Pengiriman Tepat Waktu" } },
      { value: "1,200+", label: { en: "Daily Shipments Managed Error-Free", id: "Paket Harian Dikelola Tanpa Kesalahan" } },
    ],
    tldr: {
      problem: {
        en: "Dispatch coordinators were juggling 6 browser tabs and sluggish spreadsheets, causing 35-minute delays per delivery batch during morning peak hours.",
        id: "Koordinator logistik harus membuka 6 tab browser dan spreadsheet terpisah, menyebabkan keterlambatan 35 menit per pengiriman di jam sibuk pagi.",
      },
      solution: {
        en: "Crafted a unified keyboard-first control tower featuring dense data grids, contextual timeline flyouts, and proactive routing alert signals.",
        id: "Membangun dashboard operasional berorientasi keyboard dengan grid data densitas tinggi, timeline terpadu, dan peringatan keterlambatan dini.",
      },
      impact: {
        en: "Reduced fleet allocation time from 12 minutes to under 7 minutes per cluster and eliminated 98% of routing misassignments.",
        id: "Memangkas waktu penugasan armada dari 12 menit menjadi kurang dari 7 menit serta menekan salah alur hingga 98%.",
      },
    },
    sections: [
      {
        id: "sec-1",
        type: "context",
        title: { en: "Context & Challenge", id: "Konteks & Tantangan" },
        body: {
          en: "Operations teams work 10-hour shifts under constant pressure. Every minute a truck idles at the depot costs the company money. The goal was to consolidate GPS tracking, cargo capacity forecasting, and driver communication into a single, high-contrast, responsive workspace.",
          id: "Tim operasional bekerja dalam tempo tinggi di bawah tenggat ketat. Setiap menit keterlambatan armada di gudang menimbulkan biaya operasional nyata. Target proyek ini adalah menggabungkan pelacakan GPS, utilisasi muatan, dan komunikasi driver dalam satu ruang kerja berdensitas tinggi.",
        },
      },
      {
        id: "sec-2",
        type: "research",
        title: { en: "Field Observation & Operator Workflows", id: "Observasi Lapangan & Alur Kerja Operator" },
        body: {
          en: "Shadowing 8 dispatchers on the warehouse floor revealed that operators rarely use a mouse; their hands stay on numeric keypads and shortcut keys. The previous UI required 14 clicks to reassign an emergency breakdown route.",
          id: "Observasi langsung terhadap 8 operator menunjukkan bahwa mereka lebih banyak mengandalkan shortcut keyboard dibanding mouse. Antarmuka lama membutuhkan 14 kali klik hanya untuk mengalihkan rute saat armada mengalami mogok darurat.",
        },
      },
      {
        id: "sec-3",
        type: "process",
        title: { en: "High-Density Architecture & Keyboard Navigation", id: "Arsitektur Densitas Tinggi & Navigasi Cepat" },
        body: {
          en: "We introduced a modular 3-pane layout: Live Fleet Hierarchy, Interactive Map/Timeline, and Fleet Batch Inspector. We incorporated global hotkeys (J/K for row navigation, Space for status inspection, Enter for rapid dispatch confirm).",
          id: "Kami menerapkan tata letak modular 3 panel: Hierarki Armada Aktif, Peta Rute Interaktif, dan Panel Inspeksi Muatan. Dilengkapi tombol pintas global untuk navigasi instan tanpa mouse.",
        },
      },
      {
        id: "sec-4",
        type: "solution",
        title: { en: "Final System & Accessibility in High Contrast", id: "Sistem Final & Aksesibilitas Kontras Tinggi" },
        body: {
          en: "Because depot monitors often sit in poorly lit or glare-heavy dock environments, we engineered both dark and high-contrast light modes meeting WCAG AAA color contrast ratios across all critical status badges.",
          id: "Mengingat layar monitor di gudang sering terkena pantulan cahaya atau minim penerangan, kami merancang tema gelap dan terang dengan rasio kontras tinggi yang memenuhi standar WCAG AAA pada setiap status badge.",
        },
      },
      {
        id: "sec-5",
        type: "impact",
        title: { en: "Measurable Results", id: "Hasil Terukur" },
        body: {
          en: "Dispatcher onboarding time dropped from 3 weeks to 4 days. Peak-hour vehicle turnaround improved by 41%, saving over 120 operational team hours monthly across four regional hubs.",
          id: "Waktu pelatihan operator baru terpangkas dari 3 minggu menjadi hanya 4 hari. Perputaran armada jam sibuk meningkat 41%, menghemat lebih dari 120 jam operasional per bulan di empat depo utama.",
        },
      },
    ],
    solutionStates: [
      {
        title: { en: "Command Center Overview", id: "State Dashboard Utama" },
        description: { en: "Dense real-time status table with active map split and live filter chips.", id: "Tabel data berdensitas tinggi dengan pembagian peta live dan filter cepat." },
        stateType: "default",
        previewUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "No Dispatches Pending (Clean Slate)", id: "State Selesai / Kosong" },
        description: { en: "Affirmative empty state showing all morning deliveries successfully cleared on schedule.", id: "State positif yang mengonfirmasi seluruh armada telah diberangkatkan sesuai target." },
        stateType: "empty",
        previewUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "Telemetry Sensor Offline Alert", id: "State Peringatan Sensor" },
        description: { en: "Pinned critical notification with manual checkpoint confirmation override.", id: "Peringatan sensor dengan opsi verifikasi manual tanpa menghambat alur kerja utama." },
        stateType: "error",
        previewUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "Data Stream Syncing State", id: "State Sinkronisasi Real-Time" },
        description: { en: "Subtle table cell pulse without blocking user keyboard commands.", id: "Indikator pembaruan data halus pada sel tabel tanpa mengunci input keyboard operator." },
        stateType: "loading",
        previewUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    learnings: [
      { en: "Enterprise tools need density and information hierarchy, not excessive whitespace.", id: "Aplikasi back-office membutuhkan hierarki informasi yang padat, bukan ruang kosong berlebihan." },
      { en: "Keyboard shortcuts transform daily repetitive tasks from tedious to effortless.", id: "Navigasi keyboard mempercepat pekerjaan repetitif harian hingga berkali-kali lipat." },
    ],
    status: "published",
    isSampleProject: true,
    order: 2,
    publishedAt: new Date().toISOString(),
  },
  {
    id: "proj-3",
    slug: "aura-health-preventive-wellness",
    title: {
      en: "Aura Health: Habit Architecture & Behavioral Wellness Companion",
      id: "Aura Health: Pembentukan Kebiasaan Sehat & Aplikasi Kesejahteraan Personal",
    },
    summary: {
      en: "Designing a habit-forming mobile experience that boosted 30-day user retention from 19% to 44% through empathetic micro-interactions.",
      id: "Mendesain aplikasi mobile berbasis sains perilaku yang meningkatkan retensi 30 hari dari 19% ke 44% melalui interaksi mikro yang empatik.",
    },
    role: "Product Designer (UX Research, Mobile UI, Interaction Design)",
    duration: "2.5 Months (Q2 2024)",
    team: "1 PM, 2 iOS Engineers, 2 Android Engineers, 1 Behavioral Scientist",
    platforms: ["iOS App (SwiftUI)", "Android App (Jetpack Compose)"],
    tools: ["Figma", "ProtoPie", "Mixpanel"],
    category: "Mobile Apps",
    coverUrl:
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { value: "44%", label: { en: "30-Day Retention (up from 19%)", id: "Retensi Hari ke-30 (dari 19%)" } },
      { value: "4.8★", label: { en: "App Store & Google Play Rating", id: "Rating di App Store & Google Play" } },
      { value: "120k+", label: { en: "Active Monthly Habit Streaks", id: "Kebiasaan Aktif Tercatat Tiap Bulan" } },
    ],
    tldr: {
      problem: {
        en: "Users enthusiastically downloaded the app but abandoned their health tracking within 5 days due to guilt-inducing notifications and rigid logging chores.",
        id: "Pengguna antusias mengunduh aplikasi namun berhenti mencatat dalam 5 hari pertama akibat notifikasi yang menekan dan formulir pencatatan yang kaku.",
      },
      solution: {
        en: "Pioneered a 'zero-guilt' flexible streak model with gentle tactile completions, widget check-ins, and adaptive goal calibration.",
        id: "Menciptakan model habit fleksibel tanpa rasa bersalah dengan konfirmasi haptic yang memuaskan, widget layar depan, dan penyesuaian target otomatis.",
      },
      impact: {
        en: "Retention more than doubled, daily active engagement rose 52%, and user reviews frequently praised the calming, non-intrusive design ethos.",
        id: "Retensi meningkat lebih dari dua kali lipat, interaksi harian naik 52%, dan pengguna mengapresiasi desain yang menenangkan tanpa rasa tertekan.",
      },
    },
    sections: [
      {
        id: "sec-1",
        type: "context",
        title: { en: "The Challenge: Habit Burnout", id: "Tantangan: Burnout Mencatat Kebiasaan" },
        body: {
          en: "Most wellness apps copy the aggressive gamification of gaming apps: streaks that break permanently if you miss one day, leading to disappointment and uninstallations. Aura wanted to prove that kindness and flexibility drive sustainable behavior change.",
          id: "Banyak aplikasi kesehatan menerapkan gamifikasi agresif yang mematahkan streak secara permanen saat pengguna melewatkan satu hari, memicu kekecewaan dan uninstall. Aura ingin membuktikan bahwa pendekatan yang empatik justru menghasilkan perubahan jangka panjang.",
        },
      },
      {
        id: "sec-2",
        type: "research",
        title: { en: "Behavioral Insights & User Testing", id: "Riset Perilaku & Pengujian Pengguna" },
        body: {
          en: "We partnered with a behavioral scientist to run diary studies with 24 diverse participants. We learned that the moment of friction was the evening log-in: when tired, filling out 4 inputs felt exhausting. Logging needed to take under 3 seconds.",
          id: "Kami bekerja sama dengan behavioral scientist untuk mengamati rutinitas 24 pengguna. Titik kelelahan terbesar terjadi pada malam hari: saat lelah, mengisi 4 data terasa berat. Pencatatan harus bisa diselesaikan dalam waktu kurang dari 3 detik.",
        },
      },
      {
        id: "sec-3",
        type: "solution",
        title: { en: "Delightful Micro-interactions & Zero-Guilt Philosophy", id: "Mikro-Interaksi Halus & Filosofi Tanpa Tekanan" },
        body: {
          en: "We built custom gesture-based cards where a single swipe records a habit. The completion triggers a subtle haptic pulse and a calming organic gradient expansion. If a day is missed, Aura encourages a 'rest day' rather than resetting your streak to zero.",
          id: "Kami merancang kartu interaktif berbasis swipe sekali usap. Tiap penyelesaian disambut getaran haptic halus dan gradien organik yang menenangkan. Saat libur atau sakit, pengguna dapat mencatat 'rest day' tanpa kehilangan riwayat pencapaian.",
        },
      },
    ],
    solutionStates: [
      {
        title: { en: "Habit Journey Dashboard", id: "Tampilan Utama Habit" },
        description: { en: "Calm pastel color palette with glanceable progress rings and fluid gestures.", id: "Palet warna menenangkan dengan cincin progres yang mudah dipahami dalam satu tatapan." },
        stateType: "default",
        previewUrl: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "First Day / Zero Habits Created", id: "State Awal / Belum Ada Data" },
        description: { en: "Warm invitation with 3 scientifically proven starter habits ready to activate in 1 tap.", id: "Penyambutan ramah dengan rekomendasi 3 kebiasaan awal yang terbukti secara ilmiah." },
        stateType: "empty",
        previewUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "Device HealthKit Permission Prompt", id: "State Izin Integrasi Data" },
        description: { en: "Clear explanation of why step data is read without leaving users stuck in case of denial.", id: "Penjelasan transparan mengenai alasan data langkah dibaca, tanpa memblokir fitur lain jika izin ditolak." },
        stateType: "error",
        previewUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "Syncing Wearable State", id: "State Sinkronisasi Smartwatch" },
        description: { en: "Playful animated breathing loop during wearable Bluetooth connection.", id: "Animasi pernapasan ritmis selama sinkronisasi data smartwatch berlangsung." },
        stateType: "loading",
        previewUrl: "https://images.unsplash.com/photo-1510519138161-5844a4928b57?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    learnings: [
      { en: "Emotional design directly correlates with long-term digital product retention.", id: "Kenyamanan emosional berpengaruh langsung pada kesetiaan pengguna dalam jangka panjang." },
      { en: "Haptic feedback bridges the tactile gap between physical accomplishments and digital taps.", id: "Umpan balik haptic menjembatani rasa puas antara aksi fisik dan ketukan di layar digital." },
    ],
    status: "published",
    isSampleProject: true,
    order: 3,
    publishedAt: new Date().toISOString(),
  },
  {
    id: "proj-4",
    slug: "nexus-design-system",
    title: {
      en: "Nexus: Multi-Brand Design System & Token Architecture",
      id: "Nexus: Sistem Desain Multi-Brand & Arsitektur Token Komponen",
    },
    summary: {
      en: "Architecting a scalable design system that unified 4 separate enterprise products, elevating engineering velocity by 3.4x and ensuring 100% accessibility.",
      id: "Membangun design system terpadu untuk 4 produk enterprise, meningkatkan kecepatan rilis tim engineering 3.4x dengan kepatuhan aksesibilitas 100%.",
    },
    role: "Design System Architect & Lead UI Designer",
    duration: "5 Months (Q4 2024 - Q1 2025)",
    team: "Cross-functional team of 6 designers, 8 frontend engineers, 1 accessibility specialist",
    platforms: ["Web (React)", "Mobile (React Native)", "Design Tokens (JSON)"],
    tools: ["Figma Tokens", "Storybook", "TypeScript", "Tailwind CSS", "GitHub Actions"],
    category: "Design Systems",
    coverUrl:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    metrics: [
      { value: "3.4x", label: { en: "Design-to-Code Delivery Speed", id: "Kecepatan Pengiriman Desain ke Kode" } },
      { value: "98%", label: { en: "Component Reuse across 4 Core Products", id: "Tingkat Penggunaan Komponen Ulang di 4 Produk" } },
      { value: "0", label: { en: "WCAG 2.2 AA Contrast Failures", id: "Pelanggaran Kontras Aksesibilitas WCAG 2.2" } },
    ],
    tldr: {
      problem: {
        en: "Four acquired enterprise products had fragmented UIs, 18 different button styles, conflicting color palettes, and recurring accessibility violations.",
        id: "Empat produk enterprise memiliki antarmuka terfragmentasi, 18 gaya tombol berbeda, palet warna bertabrakan, dan sering gagal audit aksesibilitas.",
      },
      solution: {
        en: "Engineered an automated W3C design token pipeline connecting Figma Variables directly to Tailwind CSS and React component libraries.",
        id: "Merancang alur otomatisasi token desain standar W3C yang menghubungkan Variabel Figma langsung ke Tailwind CSS dan library React.",
      },
      impact: {
        en: "Eliminated design debt across 140+ screens, reduced design handoff discrepancies to near zero, and achieved full WCAG 2.2 AA certification.",
        id: "Menghilangkan hutang desain di 140+ layar, meniadakan selisih handoff desain-ke-kode, dan meraih sertifikasi penuh WCAG 2.2 AA.",
      },
    },
    sections: [
      {
        id: "sec-1",
        type: "context",
        title: { en: "The Challenge of Brand Sprawl", id: "Tantangan Fragmentasi Multi-Produk" },
        body: {
          en: "Following a series of acquisitions, the company had multiple codebases duplicating common UI components. Design debt slowed down feature delivery and caused constant QA bugs.",
          id: "Setelah beberapa akuisisi produk, perusahaan memiliki beragam basis kode yang menduplikasi komponen dasar secara acak. Hal ini memperlambat rilis fitur dan memicu bug antarmuka berulang.",
        },
      },
      {
        id: "sec-2",
        type: "process",
        title: { en: "Design Token Taxonomy & Automation", id: "Taksonomi Token Desain & Otomasi" },
        body: {
          en: "We established a 3-tier token structure: Global (color primitives), Semantic (bg-surface, text-muted, border-focus), and Component-level. When a designer modifies a token in Figma, a GitHub action automatically compiles and opens a PR with updated CSS variables.",
          id: "Kami menyusun struktur token 3 tingkat: Global (nilai primitif), Semantik (surface, border, text), dan Komponen. Setiap perubahan di Figma secara otomatis diproses melalui GitHub Actions menjadi variabel CSS siap pakai.",
        },
      },
      {
        id: "sec-3",
        type: "solution",
        title: { en: "Comprehensive Component Gallery & Documentation", id: "Dokumentasi & Galeri Komponen Interaktif" },
        body: {
          en: "Every component was delivered with comprehensive interactive states (default, hover, active, focus-visible, disabled, loading, error) alongside clear copy guidelines and dos & don'ts.",
          id: "Setiap komponen dilengkapi seluruh state interaktif (default, hover, focus-visible, loading, error) beserta panduan penulisan copy dan contoh implementasi yang tepat.",
        },
      },
    ],
    solutionStates: [
      {
        title: { en: "Token Inspector & Component Playground", id: "Tampilan Playground Komponen" },
        description: { en: "Interactive Storybook environment with instant light/dark theme swapping and token diagnostics.", id: "Lingkungan Storybook interaktif dengan pengujian tema gelap/terang dan audit token otomatis." },
        stateType: "default",
        previewUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "Unused Token Audit State", id: "State Audit Token Bersih" },
        description: { en: "Automated CLI report highlighting zero orphaned styles or mismatched variable references.", id: "Laporan CLI otomatis yang memastikan tidak ada style usang atau token tak terpakai." },
        stateType: "empty",
        previewUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "Accessibility Contrast Warning State", id: "State Peringatan Kontras" },
        description: { en: "Real-time linting flags any custom color combination dipping below the 4.5:1 ratio threshold.", id: "Pemeriksaan otomatis mendeteksi jika ada kombinasi warna yang berada di bawah rasio 4.5:1." },
        stateType: "error",
        previewUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: { en: "Asynchronous Token Compilation State", id: "State Kompilasi Token" },
        description: { en: "Non-blocking pipeline compiling multi-platform CSS/JS exports within 800ms.", id: "Alur kompilasi non-blocking yang menghasilkan file ekspor CSS/JS multi-platform dalam 800ms." },
        stateType: "loading",
        previewUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    learnings: [
      { en: "A design system is 20% components and 80% governance and developer communication.", id: "Design system adalah 20% komponen dan 80% komunikasi tim, tata kelola, serta dokumentasi." },
      { en: "Design tokens form the indestructible bridge between Figma and production code.", id: "Design token adalah jembatan paling kokoh antara desain di Figma dan kode produksi." },
    ],
    status: "published",
    isSampleProject: true,
    order: 4,
    publishedAt: new Date().toISOString(),
  },
];

export const seedExperiences: Experience[] = [
  {
    id: "exp-1",
    company: "Fintech Scale-Up",
    role: { en: "Lead Product Designer", id: "Lead Product Designer" },
    period: { en: "2023 - Present", id: "2023 - Sekarang" },
    location: "Jakarta, ID / Hybrid",
    bullets: [
      {
        action: { en: "Led end-to-end design strategy", id: "Memimpin strategi desain end-to-end" },
        context: { en: "for the core payments and merchant checkout ecosystem", id: "untuk ekosistem pembayaran utama dan checkout merchant" },
        result: { en: "boosting transaction completion by 28% and driving $12M+ monthly GMV", id: "meningkatkan konversi transaksi 28% dan melayani $12M+ volume transaksi bulanan" },
        fullText: {
          en: "Led end-to-end design strategy for the core payments and merchant checkout ecosystem, boosting transaction completion by 28% and driving $12M+ monthly GMV.",
          id: "Memimpin strategi desain end-to-end untuk ekosistem pembayaran utama dan checkout merchant, meningkatkan konversi transaksi 28% dan melayani $12M+ volume transaksi bulanan.",
        },
      },
      {
        action: { en: "Architected cross-platform design token system", id: "Merancang sistem token desain lintas platform" },
        context: { en: "unifying Web, iOS, and Android applications across 5 product squads", id: "menyatukan aplikasi Web, iOS, dan Android di 5 squad produk" },
        result: { en: "slashing engineering design QA turnaround by 50%", id: "memangkas waktu perbaikan QA antarmuka sebesar 50%" },
        fullText: {
          en: "Architected cross-platform design token system unifying Web, iOS, and Android applications across 5 product squads, slashing engineering design QA turnaround by 50%.",
          id: "Merancang sistem token desain lintas platform menyatukan aplikasi Web, iOS, dan Android di 5 squad produk, memangkas waktu perbaikan QA antarmuka sebesar 50%.",
        },
      },
      {
        action: { en: "Instituted weekly qualitative user discovery sessions", id: "Menginisiasi sesi riset kualitatif mingguan bersama pengguna" },
        context: { en: "with over 60 enterprise merchants", id: "bersama lebih dari 60 merchant skala besar" },
        result: { en: "uncovering 3 high-friction drop-off triggers before engineering investment", id: "menemukan 3 titik friksi kritis sebelum pengembangan kode dimulai" },
        fullText: {
          en: "Instituted weekly qualitative user discovery sessions with over 60 enterprise merchants, uncovering 3 high-friction drop-off triggers before engineering investment.",
          id: "Menginisiasi sesi riset kualitatif mingguan bersama pengguna bersama lebih dari 60 merchant skala besar, menemukan 3 titik friksi kritis sebelum pengembangan kode dimulai.",
        },
      },
    ],
    skillsUsed: ["Product Strategy", "Figma", "Design Tokens", "Usability Testing", "Payments UX"],
    order: 1,
  },
  {
    id: "exp-2",
    company: "Logistics & Supply Chain Tech",
    role: { en: "Senior Product Designer", id: "Senior Product Designer" },
    period: { en: "2021 - 2023", id: "2021 - 2023" },
    location: "Jakarta, ID",
    bullets: [
      {
        action: { en: "Spearheaded complete UX overhaul of fleet dispatch control tower", id: "Memimpin perombakan total UX dashboard kontrol armada" },
        context: { en: "transitioning 4 regional hubs from fragmented spreadsheets to a centralized web app", id: "mentransisikan 4 depo wilayah dari spreadsheet terpisah ke aplikasi web terpadu" },
        result: { en: "cutting truck dispatch turnaround by 41% and saving 120 operational hours monthly", id: "memangkas waktu alokasi truk 41% dan menghemat 120 jam operasional per bulan" },
        fullText: {
          en: "Spearheaded complete UX overhaul of fleet dispatch control tower, transitioning 4 regional hubs from fragmented spreadsheets to a centralized web app, cutting truck dispatch turnaround by 41%.",
          id: "Memimpin perombakan total UX dashboard kontrol armada, mentransisikan 4 depo wilayah dari spreadsheet terpisah ke aplikasi web terpadu, memangkas waktu alokasi truk 41%.",
        },
      },
      {
        action: { en: "Designed keyboard-centric micro-interactions and high-density data tables", id: "Mendesain mikro-interaksi navigasi keyboard dan tabel berdensitas tinggi" },
        context: { en: "for high-tempo warehouse dispatchers under time pressure", id: "untuk operator gudang yang bekerja di bawah ritme cepat" },
        result: { en: "reducing misrouted deliveries by 98%", id: "menekan angka salah alur pengiriman hingga 98%" },
        fullText: {
          en: "Designed keyboard-centric micro-interactions and high-density data tables for warehouse dispatchers, reducing misrouted deliveries by 98%.",
          id: "Mendesain mikro-interaksi navigasi keyboard dan tabel berdensitas tinggi untuk operator gudang, menekan angka salah alur pengiriman hingga 98%.",
        },
      },
    ],
    skillsUsed: ["Information Architecture", "Data Density", "Keyboard Navigation", "Field Research", "B2B SaaS"],
    order: 2,
  },
  {
    id: "exp-3",
    company: "Digital Product Studio",
    role: { en: "UI/UX Designer", id: "UI/UX Designer" },
    period: { en: "2019 - 2021", id: "2019 - 2021" },
    location: "Bandung, ID",
    bullets: [
      {
        action: { en: "Designed and delivered 14 bespoke web and mobile products", id: "Mendesain dan merilis 14 produk web dan mobile kustom" },
        context: { en: "for funded early-stage startups and corporate innovation labs", id: "untuk startup tahap awal dan laboratorium inovasi korporasi" },
        result: { en: "taking products from concept brief to live App Store launches in under 12 weeks", id: "membawa ide dari brief konsep hingga peluncuran di App Store dalam waktu kurang dari 12 minggu" },
        fullText: {
          en: "Designed and delivered 14 bespoke web and mobile products for startups, taking products from concept brief to live App Store launches in under 12 weeks.",
          id: "Mendesain dan merilis 14 produk web dan mobile kustom untuk startup, membawa ide dari brief konsep hingga peluncuran di App Store dalam waktu kurang dari 12 minggu.",
        },
      },
      {
        action: { en: "Conducted interactive prototyping and usability interviews", id: "Menjalankan prototyping interaktif dan wawancara usabilitas" },
        context: { en: "testing low- and high-fidelity artifacts with 100+ targeted end users", id: "menguji artefak wireframe dan prototipe presisi tinggi ke 100+ pengguna akhir" },
        result: { en: "validating core product hypotheses prior to client engineering spend", id: "memvalidasi hipotesis nilai produk sebelum anggaran pengembangan dikeluarkan" },
        fullText: {
          en: "Conducted interactive prototyping and usability interviews with 100+ users, validating core product hypotheses prior to client engineering spend.",
          id: "Menjalankan prototyping interaktif dan wawancara usabilitas ke 100+ pengguna akhir, memvalidasi hipotesis nilai produk sebelum anggaran pengembangan dikeluarkan.",
        },
      },
    ],
    skillsUsed: ["Rapid Prototyping", "User Interviews", "Visual Design", "Design Sprints", "Wireframing"],
    order: 3,
  },
];

export const seedSkills: Skill[] = [
  // Research
  { id: "sk-1", group: "Research", name: "User Interviews & Field Observation", level: "Expert", order: 1 },
  { id: "sk-2", group: "Research", name: "Usability Testing (Moderated & Unmoderated)", level: "Expert", order: 2 },
  { id: "sk-3", group: "Research", name: "Heuristic Evaluation & UX Audits", level: "Expert", order: 3 },
  { id: "sk-4", group: "Research", name: "Jobs-to-be-Done (JTBD) Mapping", level: "Proficient", order: 4 },
  { id: "sk-5", group: "Research", name: "Competitive Benchmarking", level: "Expert", order: 5 },

  // UX/Product
  { id: "sk-6", group: "UX/Product", name: "Information Architecture & User Flows", level: "Expert", order: 1 },
  { id: "sk-7", group: "UX/Product", name: "Wireframing & Low-Fidelity Sprints", level: "Expert", order: 2 },
  { id: "sk-8", group: "UX/Product", name: "Product Strategy & Feature Prioritization", level: "Proficient", order: 3 },
  { id: "sk-9", group: "UX/Product", name: "Interaction Design & Micro-animations", level: "Expert", order: 4 },
  { id: "sk-10", group: "UX/Product", name: "Edge Case & Error State Modeling", level: "Expert", order: 5 },

  // UI/Visual
  { id: "sk-11", group: "UI/Visual", name: "Design Systems & Token Architecture", level: "Expert", order: 1 },
  { id: "sk-12", group: "UI/Visual", name: "WCAG 2.2 AA Accessibility Compliance", level: "Expert", order: 2 },
  { id: "sk-13", group: "UI/Visual", name: "Visual Hierarchy & Typography Scaling", level: "Expert", order: 3 },
  { id: "sk-14", group: "UI/Visual", name: "High-Density Data Grid & Dashboard UI", level: "Expert", order: 4 },
  { id: "sk-15", group: "UI/Visual", name: "Responsive Mobile & Desktop Patterns", level: "Expert", order: 5 },

  // Tools
  { id: "sk-16", group: "Tools", name: "Figma & FigJam (Variables, Auto-layout)", level: "Expert", order: 1 },
  { id: "sk-17", group: "Tools", name: "ProtoPie & Interactive Micro-prototypes", level: "Proficient", order: 2 },
  { id: "sk-18", group: "Tools", name: "Maze & UserTesting", level: "Proficient", order: 3 },
  { id: "sk-19", group: "Tools", name: "Storybook & Notion Documentation", level: "Proficient", order: 4 },
  { id: "sk-20", group: "Tools", name: "Git & GitHub Workflows", level: "Proficient", order: 5 },

  // Light-dev
  { id: "sk-21", group: "Light-dev", name: "HTML5 & Semantic Structure", level: "Expert", order: 1 },
  { id: "sk-22", group: "Light-dev", name: "Tailwind CSS & CSS Custom Properties", level: "Expert", order: 2 },
  { id: "sk-23", group: "Light-dev", name: "React & Next.js Basics", level: "Proficient", order: 3 },
  { id: "sk-24", group: "Light-dev", name: "Design Token JSON Automation", level: "Proficient", order: 4 },
];

export const seedServices: Service[] = [
  {
    id: "srv-1",
    slug: "ux-audit-heuristic-evaluation",
    title: {
      en: "Comprehensive UX Audit & Heuristic Evaluation",
      id: "Audit UX Komprehensif & Evaluasi Heuristik",
    },
    summary: {
      en: "Identify high-friction drop-offs, accessibility bottlenecks, and UX inconsistencies with an actionable, prioritized roadmap.",
      id: "Identifikasi titik drop-off pengguna, hambatan aksesibilitas, dan inkonsistensi desain melalui laporan audit terstruktur dan terprioritas.",
    },
    targetAudience: {
      en: "Founders and product teams experiencing stalled user conversion or preparing for a major product overhaul.",
      id: "Founder dan tim produk yang mengalami stagnasi konversi atau bersiap melakukan perombakan produk besar.",
    },
    deliverables: [
      { en: "Screen-by-screen heuristic evaluation report (Figma/PDF)", id: "Laporan evaluasi heuristik layar demi layar (Figma/PDF)" },
      { en: "Impact vs. Effort prioritization matrix", id: "Matriks prioritas dampak vs. kemudahan eksekusi" },
      { en: "WCAG 2.2 AA accessibility audit score", id: "Skor audit kepatuhan aksesibilitas WCAG 2.2 AA" },
      { en: "Quick-win redesign recommendations in Figma", id: "Rekomendasi perbaikan cepat siap pakai di Figma" },
    ],
    processSteps: [
      {
        step: 1,
        title: { en: "Context Discovery", id: "Penyelarasan Konteks" },
        description: { en: "Review product metrics, funnel drop-off analytics, and key business goals.", id: "Tinjau metrik funnel, data analytics, dan target bisnis utama." },
      },
      {
        step: 2,
        title: { en: "Deep Diagnostic", id: "Analisis Diagnostik Mendalam" },
        description: { en: "Cognitive walkthrough across all critical user journeys and edge states.", id: "Evaluasi kognitif menyeluruh pada alur kritis dan skenario edge-case." },
      },
      {
        step: 3,
        title: { en: "Roadmap Handover", id: "Penyerahan Roadmap & Diskusi" },
        description: { en: "Live walkthrough session presenting high-priority fixes and immediate wins.", id: "Sesi presentasi interaktif memaparkan perbaikan prioritas dan solusi cepat." },
      },
    ],
    order: 1,
    status: "available",
  },
  {
    id: "srv-2",
    slug: "end-to-end-product-design",
    title: {
      en: "End-to-End Product Design (0 to 1 & Redesign)",
      id: "Desain Produk End-to-End (0 ke 1 & Redesain)",
    },
    summary: {
      en: "From raw product concept to developer-ready Figma architectures, research-backed user flows, and polished interfaces.",
      id: "Dari konsep awal hingga arsitektur antarmuka Figma siap koding, dilengkapi alur pengguna teruji dan visual modern.",
    },
    targetAudience: {
      en: "Startups launching a new mobile/web product or companies modernizing legacy B2B/SaaS software.",
      id: "Startup yang meluncurkan produk baru atau perusahaan yang memodernisasi software B2B/SaaS lama.",
    },
    deliverables: [
      { en: "Interactive user flows and information architecture diagrams", id: "Diagram alur pengguna interaktif dan arsitektur informasi" },
      { en: "Full responsive desktop & mobile screens (Auto-layout & components)", id: "Seluruh layar desktop & mobile responsif (Auto-layout & komponen)" },
      { en: "Complete state specifications (Default, empty, loading, error, success)", id: "Spesifikasi state lengkap (Default, kosong, loading, error, sukses)" },
      { en: "Design token setup ready for engineering handoff", id: "Sistem token desain siap pakai untuk tim engineering" },
    ],
    processSteps: [
      {
        step: 1,
        title: { en: "Discovery & Wireframing", id: "Riset & Wireframing" },
        description: { en: "Map out user journeys, constraints, and validate low-fidelity concepts.", id: "Petakan alur pengguna, batasan teknis, dan validasi konsep low-fidelity." },
      },
      {
        step: 2,
        title: { en: "High-Fidelity Iterations", id: "Desain Presisi Tinggi" },
        description: { en: "Craft high-craft visuals, design systems, and responsive layouts.", id: "Bangun tampilan visual presisi, sistem desain, dan layout responsif." },
      },
      {
        step: 3,
        title: { en: "Spec & Developer Handoff", id: "Spesifikasi & Handoff Developer" },
        description: { en: "Detailed component documentation, token exports, and design QA support.", id: "Dokumentasi komponen terperinci, ekspor token, dan pendampingan QA desain." },
      },
    ],
    order: 2,
    status: "available",
  },
  {
    id: "srv-3",
    slug: "design-system-architecture",
    title: {
      en: "Design System Architecture & Tokenization",
      id: "Arsitektur Design System & Standarisasi Token",
    },
    summary: {
      en: "Build a scalable, multi-brand design system that keeps designers and engineers in sync while speeding up feature releases.",
      id: "Membangun sistem desain skalabel yang menyelaraskan tim desain dan engineer guna mempercepat peluncuran fitur hingga berkali-kali lipat.",
    },
    targetAudience: {
      en: "Growing engineering and design teams tired of inconsistent UI, redundant component code, and handoff friction.",
      id: "Tim produk dan developer yang mengalami inkonsistensi antarmuka, duplikasi kode komponen, atau lambatnya handoff.",
    },
    deliverables: [
      { en: "Figma Variables token taxonomy (Colors, Spacing, Typography, Radii)", id: "Taksonomi token Figma Variables (Warna, Spasi, Tipografi, Radius)" },
      { en: "Accessible, battle-tested core UI component library", id: "Library komponen UI inti yang lolos uji aksesibilitas" },
      { en: "Light & Dark theme token parity configuration", id: "Konfigurasi token seimbang untuk tema terang dan gelap" },
      { en: "Engineering handoff documentation & Storybook mapping guide", id: "Dokumentasi handoff teknis & panduan integrasi Storybook" },
    ],
    processSteps: [
      {
        step: 1,
        title: { en: "Inventory & Audit", id: "Inventarisasi & Audit" },
        description: { en: "Catalog existing UI variants, color sprawl, and typography discrepancies.", id: "Petakan seluruh varian tombol, warna berlebih, dan inkonsistensi tipografi." },
      },
      {
        step: 2,
        title: { en: "Token Architecture", id: "Arsitektur Token" },
        description: { en: "Construct semantic token scales for light/dark modes and cross-platform export.", id: "Susun hierarki token semantik untuk mode terang/gelap dan ekspor lintas platform." },
      },
      {
        step: 3,
        title: { en: "Component Buildout", id: "Pembangunan Komponen" },
        description: { en: "Deliver fully atomic, accessible, responsive component instances.", id: "Kirimkan komponen atomik, responsif, dan siap pakai untuk tim produk." },
      },
    ],
    order: 3,
    status: "available",
  },
  {
    id: "srv-4",
    slug: "interactive-prototyping-validation",
    title: {
      en: "Interactive Prototyping & Rapid Usability Testing",
      id: "Prototyping Interaktif & Pengujian Usabilitas Cepat",
    },
    summary: {
      en: "Test complex micro-interactions, animations, and product hypotheses with real users before writing a single line of backend code.",
      id: "Uji interaksi mikro kompleks, motion, dan hipotesis fitur bersama pengguna nyata sebelum menulis satu baris kode backend pun.",
    },
    targetAudience: {
      en: "Product teams validating high-stakes features or pitches needing realistic, tangible demonstration.",
      id: "Tim produk yang ingin memvalidasi fitur berisiko tinggi atau membutuhkan prototipe realistis untuk demo investor/stakeholder.",
    },
    deliverables: [
      { en: "High-fidelity ProtoPie / Figma clickable prototype", id: "Prototipe interaktif ProtoPie / Figma dengan animasi realistis" },
      { en: "Usability testing script and participant recruitment criteria", id: "Skenario pengujian usabilitas dan kriteria partisipan" },
      { en: "Moderated testing video insights & key findings deck", id: "Rangkuman temuan pengujian dan cuplikan video wawasan pengguna" },
      { en: "Immediate post-test interaction refinements", id: "Penyempurnaan interaksi langsung berdasarkan hasil pengujian" },
    ],
    processSteps: [
      {
        step: 1,
        title: { en: "Prototype Blueprint", id: "Pemetaan Prototipe" },
        description: { en: "Define exact testing hypotheses, variables, and interaction micro-moments.", id: "Tentukan hipotesis pengujian, variabel, dan momen interaksi kunci." },
      },
      {
        step: 2,
        title: { en: "High-Fidelity Build", id: "Pembuatan Prototipe Realistis" },
        description: { en: "Engineer tactile states, realistic input feedback, and fluid transitions.", id: "Rancang state sentuhan, respons form nyata, dan transisi fluid." },
      },
      {
        step: 3,
        title: { en: "User Evaluation", id: "Evaluasi Bersama Pengguna" },
        description: { en: "Run usability tests, extract friction points, and deliver validation insights.", id: "Jalankan uji usabilitas, petakan titik hambatan, dan berikan rekomendasi aksi." },
      },
    ],
    order: 4,
    status: "limited",
  },
];
