// Sample product data (trong thực tế sẽ lấy từ database)
const PRODUCTS = [
  {
    id: "p1",
    title: "Loa Bluetooth JBL Flip 6",
    desc: "Loa di động chống nước, pin 12 giờ, công suất 20W",
    price: 2290000,
    img: "https://picsum.photos/seed/speaker1/600/600",
    images: [
      "https://picsum.photos/seed/speaker1/600/600",
      "https://picsum.photos/seed/speaker1a/600/600",
      "https://picsum.photos/seed/speaker1b/600/600"
    ],
    stock: 50,
    category: "speakers",
    discount: 10, // 10% discount
    rating: 4.5,
    ratingCount: 125,
    sold: 350
  },
  {
    id: "p19",
    title: "Guitar Acoustic Yamaha FG800",
    desc: "Đàn guitar acoustic dáng dreadnought, gỗ spruce nguyên tấm",
    price: 4500000,
    img: "https://picsum.photos/seed/guitar1/600/600",
    stock: 15,
    category: "instruments",
  },
  {
    id: "p20",
    title: "Keyboard Roland JUNO-DS88",
    desc: "Đàn synthesizer 88 phím có trọng lượng, 1200 âm sắc",
    price: 29900000,
    img: "https://picsum.photos/seed/keyboard1/600/600",
    stock: 5,
    category: "instruments",
  },
  {
    id: "p21",
    title: "Trống điện tử Roland TD-17KVX",
    desc: "Bộ trống điện tử cao cấp, cảm biến lưới, âm thanh thực",
    price: 35900000,
    img: "/images/qr_hop_le.png",
    stock: 3,
    category: "instruments",
  },
  {
    id: "p22",
    title: "Pioneer DDJ-1000SRT",
    desc: "Bàn DJ controller chuyên nghiệp cho Serato DJ Pro",
    price: 32900000,
    img: "https://picsum.photos/seed/dj1/600/600",
    stock: 6,
    category: "pro-audio",
  },
  {
    id: "p23",
    title: "Bộ dàn karaoke gia đình BMB",
    desc: "Combo loa BMB CSV-900SE, amply Paramax SA-999 AIR Max, micro BMB 900C",
    price: 46900000,
    img: "https://picsum.photos/seed/karaoke2/600/600",
    stock: 4,
    category: "karaoke",
  },
  {
    id: "p24",
    title: "Interface âm thanh Universal Audio Apollo Twin X",
    desc: "Interface thu âm chuyên nghiệp, DSP processing, 2in/6out",
    price: 23900000,
    img: "https://picsum.photos/seed/interface1/600/600",
    stock: 8,
    category: "pro-audio",
  },
  {
    id: "p2",
    title: "Tai nghe Sony WH-1000XM4",
    desc: "Tai nghe chống ồn cao cấp, Bluetooth 5.0, pin 30 giờ",
    price: 5600000,
    img: "https://picsum.photos/seed/headphone1/600/600",
    stock: 25,
    category: "headphones",
  },
  {
    id: "p3",
    title: "Dàn âm thanh Sony HT-A7000",
    desc: "Soundbar 7.1.2 kênh, Dolby Atmos, công suất 500W",
    price: 17900000,
    img: "https://picsum.photos/seed/soundbar1/600/600",
    stock: 10,
    category: "home-audio",
  },
  {
    id: "p4",
    title: "Loa Karaoke JBL PartyBox 310",
    desc: "Loa di động công suất lớn, đèn LED, pin 18 giờ",
    price: 11990000,
    img: "https://picsum.photos/seed/party1/600/600",
    stock: 15,
    category: "karaoke",
  },
  {
    id: "p5",
    title: "Micro không dây Shure BLX24",
    desc: "Micro chuyên nghiệp, khoảng cách 100m",
    price: 8900000,
    img: "https://picsum.photos/seed/mic1/600/600",
    stock: 30,
    category: "microphones",
  },
  {
    id: "p6",
    title: "Amply Denon PMA-600NE",
    desc: "Amply nghe nhạc 70W, DAC 24bit/192kHz",
    price: 14900000,
    img: "https://picsum.photos/seed/amp1/600/600",
    stock: 20,
    category: "amplifiers",
  },
  // New products
  {
    id: "p7",
    title: "Loa Bluetooth Sony SRS-XB43",
    desc: "Loa di động chống nước IP67, pin 24 giờ, bass mạnh mẽ",
    price: 3990000,
    img: "https://picsum.photos/seed/speaker2/600/600",
    stock: 40,
    category: "speakers",
  },
  {
    id: "p8",
    title: "Tai nghe Apple AirPods Pro 2",
    desc: "Tai nghe không dây chống ồn, spatial audio, chống nước IPX4",
    price: 6900000,
    img: "https://picsum.photos/seed/airpods/600/600",
    stock: 35,
    category: "headphones",
  },
  {
    id: "p9",
    title: "Loa soundbar Samsung HW-Q990B",
    desc: "Soundbar 11.1.4 kênh, công nghệ Q-Symphony, SpaceFit Sound+",
    price: 21900000,
    img: "https://picsum.photos/seed/soundbar2/600/600",
    stock: 12,
    category: "home-audio",
  },
  {
    id: "p10",
    title: "Micro Karaoke Shure KSM8",
    desc: "Micro dynamic cao cấp, màng lọc kép, chống hú hiệu quả",
    price: 7900000,
    img: "https://picsum.photos/seed/mic2/600/600",
    stock: 20,
    category: "microphones",
  },
  {
    id: "p11",
    title: "Tai nghe Sennheiser HD 660S",
    desc: "Tai nghe monitor chuyên nghiệp, độ phân giải cao",
    price: 12900000,
    img: "https://picsum.photos/seed/headphone2/600/600",
    stock: 15,
    category: "headphones",
  },
  {
    id: "p12",
    title: "Loa Klipsch The Fives",
    desc: "Loa active cao cấp, HDMI ARC, phono preamp tích hợp",
    price: 16900000,
    img: "https://picsum.photos/seed/speaker3/600/600",
    stock: 8,
    category: "speakers",
  },
  {
    id: "p13",
    title: "Mixer Yamaha MG12XU",
    desc: "Mixer 12 kênh, effects và USB audio interface",
    price: 7200000,
    img: "https://picsum.photos/seed/mixer1/600/600",
    stock: 18,
    category: "pro-audio",
  },
  {
    id: "p14",
    title: "Loa JBL EON ONE Compact",
    desc: "Loa di động chuyên nghiệp, pin 12 giờ, bluetooth, mixer 4 kênh",
    price: 13900000,
    img: "https://picsum.photos/seed/speaker4/600/600",
    stock: 10,
    category: "pro-audio",
  },
  {
    id: "p15",
    title: "Amply Marantz PM7000N",
    desc: "Amply tích hợp streaming, 60W, HEOS multi-room",
    price: 25900000,
    img: "https://picsum.photos/seed/amp2/600/600",
    stock: 6,
    category: "amplifiers",
  },
  {
    id: "p16",
    title: "Loa Monitor Audio Silver 300",
    desc: "Loa cột cao cấp, 3 đường tiếng, công suất 200W",
    price: 42900000,
    img: "https://picsum.photos/seed/speaker5/600/600",
    stock: 4,
    category: "speakers",
  },
  {
    id: "p17",
    title: "Micro thu âm AKG P420",
    desc: "Micro condenser đa năng, 3 pattern thu âm",
    price: 4900000,
    img: "https://picsum.photos/seed/mic3/600/600",
    stock: 25,
    category: "microphones",
  },
  {
    id: "p18",
    title: "Bộ Karaoke Alto TS315",
    desc: "Bộ loa karaoke di động 2000W, kèm 2 micro không dây",
    price: 19900000,
    img: "https://picsum.photos/seed/karaoke1/600/600",
    stock: 8,
    category: "karaoke",
  },
  {
    id: "p25",
    title: "Violin Yamaha V5SA",
    desc: "Đàn violin size 4/4, gỗ vân sam nguyên tấm, sản xuất tại Nhật",
    price: 15900000,
    img: "https://picsum.photos/seed/violin1/600/600",
    stock: 4,
    category: "instruments",
  },
  {
    id: "p26",
    title: "Bộ Livestream K320",
    desc: "Combo micro thu âm BM800, soundcard V8, chân kẹp màn lọc",
    price: 2900000,
    img: "https://picsum.photos/seed/stream1/600/600",
    stock: 20,
    category: "pro-audio",
  },
  {
    id: "p27",
    title: "Loa Bluetooth Marshall Stanmore II",
    desc: "Loa bluetooth vintage, công suất 80W, kết nối đa thiết bị",
    price: 8900000,
    img: "https://picsum.photos/seed/speaker6/600/600",
    stock: 12,
    category: "speakers",
  },
  {
    id: "p28",
    title: "Tai nghe in-ear Shure SE846 Pro",
    desc: "Tai nghe monitor 4 driver, cách âm -37dB, cáp RMCE-UNI",
    price: 22900000,
    img: "https://picsum.photos/seed/headphone3/600/600",
    stock: 5,
    category: "headphones",
  },
  {
    id: "p29",
    title: "Trọn bộ thu âm AT2035",
    desc: "Combo micro Audio-Technica AT2035, soundcard Focusrite Solo, chân kẹp",
    price: 13900000,
    img: "https://picsum.photos/seed/studio1/600/600",
    stock: 7,
    category: "pro-audio",
  },
  {
    id: "p30",
    title: "Organ Casio CT-X5000",
    desc: "Đàn organ 61 phím, 800 âm sắc, 235 điệu đệm, màn hình LCD",
    price: 12900000,
    img: "https://picsum.photos/seed/keyboard2/600/600",
    stock: 6,
    category: "instruments",
  },
  {
    id: "p31",
    title: "Bộ Trống Jazz Pearl Export",
    desc: "Trống acoustic cao cấp, 5 trống, cymbal Zildjian pack",
    price: 42500000,
    img: "https://picsum.photos/seed/drums2/600/600",
    stock: 2,
    category: "instruments",
  },
  {
    id: "p32",
    title: "Saxophone Alto Yamaha YAS-480",
    desc: "Kèn saxophone chuyên nghiệp, finish vàng, kèm phụ kiện",
    price: 52900000,
    img: "https://picsum.photos/seed/sax1/600/600",
    stock: 3,
    category: "instruments",
  },
  {
    id: "p33",
    title: "Guitar Bass Fender Player Plus",
    desc: "Bass 4 dây, pickup Noiseless, màu Cosmic Jade",
    price: 28900000,
    img: "https://picsum.photos/seed/bass1/600/600",
    stock: 4,
    category: "instruments",
  },
  {
    id: "p34",
    title: "Bộ Micro không dây Sennheiser EW 500",
    desc: "2 micro cầm tay, true diversity, dải tần rộng",
    price: 32500000,
    img: "https://picsum.photos/seed/mic4/600/600",
    stock: 5,
    category: "microphones",
  },
  {
    id: "p35",
    title: "Loa Array RCF HDL 26-A",
    desc: "Loa line array active, 2000W, DSP tích hợp",
    price: 89000000,
    img: "https://picsum.photos/seed/speaker7/600/600",
    stock: 2,
    category: "pro-audio",
  },
  {
    id: "p36",
    title: "Piano điện Kawai ES920",
    desc: "88 phím có trọng lượng, âm thanh concert grand",
    price: 35900000,
    img: "https://picsum.photos/seed/piano1/600/600",
    stock: 3,
    category: "instruments",
  },
  {
    id: "p37",
    title: "Mixer Allen & Heath SQ-5",
    desc: "Mixer kỹ thuật số 48 kênh, 36 bus, màn hình cảm ứng",
    price: 82500000,
    img: "https://picsum.photos/seed/mixer2/600/600",
    stock: 2,
    category: "pro-audio",
  },
  {
    id: "p38",
    title: "Trọn bộ Studio Thu âm PRO",
    desc: "Mic Neumann TLM 103, Interface RME Babyface Pro FS, Preamp, Acoustic",
    price: 92500000,
    img: "https://picsum.photos/seed/studio2/600/600",
    stock: 1,
    category: "pro-audio",
  },
  {
    id: "p39",
    title: "Đàn Guitar Classic Cordoba C12",
    desc: "Đàn guitar classic cao cấp, gỗ Indian Rosewood",
    price: 45900000,
    img: "https://picsum.photos/seed/guitar2/600/600",
    stock: 3,
    category: "instruments",
  },
  {
    id: "p40",
    title: "Bộ Loa Karaoke Gia Đình Cao Cấp",
    desc: "Loa JBL KP6055, Sub điện JBL KP181, Amply Crown XLi",
    price: 125000000,
    img: "https://picsum.photos/seed/karaoke3/600/600",
    stock: 2,
    category: "karaoke",
  },
  {
    id: "p41",
    title: "Cello Stradivari Master Copy",
    desc: "Đàn cello thủ công, gỗ nguyên khối 30 năm, sơn dầu Ý",
    price: 280000000,
    img: "https://picsum.photos/seed/cello1/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p42",
    title: "Đàn Piano Steinway & Sons B-211",
    desc: "Grand piano cao cấp, 211cm, phím ngà thật, khung đồng",
    price: 3200000000,
    img: "https://picsum.photos/seed/piano2/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p43",
    title: "Hệ thống Âm thanh Line Array JBL VTX",
    desc: "Dàn âm thanh chuyên nghiệp cho sân khấu lớn, 24000W",
    price: 1250000000,
    img: "https://picsum.photos/seed/array1/600/600",
    stock: 1,
    category: "pro-audio",
  },
  {
    id: "p44",
    title: "Trống Acoustic Pearl Reference Pure",
    desc: "Bộ trống cao cấp, vỏ gỗ maple 20 lớp, phần cứng chrome",
    price: 180000000,
    img: "https://picsum.photos/seed/drums3/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p45",
    title: "Studio Monitor Genelec 8361A",
    desc: "Loa kiểm âm 3 chiều, công suất 500W, DSP tích hợp",
    price: 225000000,
    img: "https://picsum.photos/seed/monitor1/600/600",
    stock: 2,
    category: "pro-audio",
  },
  {
    id: "p46",
    title: "Guitar Electric Gibson Custom 1959 Les Paul",
    desc: "Đàn guitar điện custom shop, vintage gloss, pickup Custombucker",
    price: 175000000,
    img: "https://picsum.photos/seed/guitar3/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p47",
    title: "Mixer Digital SSL Live L550",
    desc: "Bàn mixer 288 kênh, 36 Fader, màn hình cảm ứng 17 inch",
    price: 1850000000,
    img: "https://picsum.photos/seed/mixer3/600/600",
    stock: 1,
    category: "pro-audio",
  },
  {
    id: "p48",
    title: "Synthesizer Moog One 16-Voice",
    desc: "Synthesizer analog cao cấp, 16 voice, màn hình OLED",
    price: 195000000,
    img: "https://picsum.photos/seed/synth1/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p49",
    title: "Micro Thu âm Neumann U87 Ai",
    desc: "Micro thu âm chuyên nghiệp, pattern đa hướng, màng nhạy lớn",
    price: 58900000,
    img: "https://picsum.photos/seed/mic5/600/600",
    stock: 3,
    category: "microphones",
  },
  {
    id: "p50",
    title: "Đàn Violin Stradivari 1714",
    desc: "Đàn violin cổ điển, làm thủ công, âm sắc hoàn hảo",
    price: 420000000,
    img: "https://picsum.photos/seed/violin2/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p51",
    title: "Loa Monitor Focal Trio11 Be",
    desc: "Loa kiểm âm 3 đường tiếng, công suất 1000W, DSP tích hợp",
    price: 245000000,
    img: "https://picsum.photos/seed/monitor2/600/600",
    stock: 2,
    category: "pro-audio",
  },
  {
    id: "p52",
    title: "Mixer Analog SSL Origin 32",
    desc: "Bàn trộn analog 32 kênh, EQ 4 band, compression mỗi kênh",
    price: 385000000,
    img: "https://picsum.photos/seed/mixer4/600/600",
    stock: 1,
    category: "pro-audio",
  },
  {
    id: "p53",
    title: "Đàn Piano Fazioli F308",
    desc: "Grand piano cao cấp, 308cm, khung carbon, phím ngà",
    price: 4500000000,
    img: "https://picsum.photos/seed/piano3/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p54",
    title: "Hệ thống Âm thanh L-Acoustics K2",
    desc: "Dàn âm thanh line array, 12 loa, công suất 30000W",
    price: 1850000000,
    img: "https://picsum.photos/seed/array2/600/600",
    stock: 1,
    category: "pro-audio",
  },
  {
    id: "p55",
    title: "Guitar Electric Fender Custom Shop 1960",
    desc: "Đàn guitar điện custom shop, vintage, pickups hand-wound",
    price: 185000000,
    img: "https://picsum.photos/seed/guitar4/600/600",
    stock: 2,
    category: "instruments",
  },
  {
    id: "p56",
    title: "Trống Acoustic DW Collectors Series",
    desc: "Bộ trống cao cấp, vỏ gỗ maple, hardware mạ vàng",
    price: 235000000,
    img: "https://picsum.photos/seed/drums4/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p57",
    title: "Micro Neumann M 149 Tube",
    desc: "Micro thu âm cao cấp, công nghệ đèn, pattern đa hướng",
    price: 145000000,
    img: "https://picsum.photos/seed/mic6/600/600",
    stock: 2,
    category: "microphones",
  },
  {
    id: "p58",
    title: "Interface Universal Audio X16",
    desc: "Interface âm thanh pro, 16 input, DSP quad-core",
    price: 125000000,
    img: "https://picsum.photos/seed/interface2/600/600",
    stock: 2,
    category: "pro-audio",
  },
  {
    id: "p59",
    title: "Đàn Harp Lyon & Healy Style 23",
    desc: "Đàn harp concert, 47 dây, khung mạ vàng, gỗ sycamore",
    price: 850000000,
    img: "https://picsum.photos/seed/harp1/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p60",
    title: "Studio Mastering Bundle",
    desc: "Bộ xử lý tín hiệu mastering, converter Prism Sound, EQ Maselec",
    price: 455000000,
    img: "https://picsum.photos/seed/master1/600/600",
    stock: 1,
    category: "pro-audio",
  },
  {
    id: "p61",
    title: "Trompet Bach Stradivarius 180S",
    desc: "Kèn trumpet chuyên nghiệp, thân bạc sterling, finish vàng 24K",
    price: 145000000,
    img: "https://picsum.photos/seed/trumpet1/600/600",
    stock: 2,
    category: "instruments",
  },
  {
    id: "p62",
    title: "Accordion Hohner Morino V 120",
    desc: "Đàn accordion cao cấp, 120 bass, 41 phím, hand-made tại Đức",
    price: 235000000,
    img: "https://picsum.photos/seed/accordion1/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p63",
    title: "Double Bass Yamaha SLB300",
    desc: "Đàn contrabass điện, công nghệ SRT, thùng đàn gỗ nguyên khối",
    price: 168000000,
    img: "https://picsum.photos/seed/bass2/600/600",
    stock: 2,
    category: "instruments",
  },
  {
    id: "p64",
    title: "Pedal Board Custom",
    desc: "Bộ effect guitar cao cấp, tích hợp 15 pedal boutique, điều khiển MIDI",
    price: 185000000,
    img: "https://picsum.photos/seed/pedal1/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p65",
    title: "Đồng hồ Array Meyer Sound LEOPARD",
    desc: "Hệ thống loa line array chuyên nghiệp, công suất 3400W, DSP tích hợp",
    price: 920000000,
    img: "https://picsum.photos/seed/array3/600/600",
    stock: 1,
    category: "pro-audio",
  },
  {
    id: "p66",
    title: "Studio Monitor ATC SCM150ASL",
    desc: "Loa kiểm âm 3 chiều active, công suất 350W/kênh, made in UK",
    price: 485000000,
    img: "https://picsum.photos/seed/monitor3/600/600",
    stock: 1,
    category: "pro-audio",
  },
  {
    id: "p67",
    title: "Micro Telefunken ELA M 251E",
    desc: "Micro thu âm đèn cao cấp, tái bản từ model 1950s",
    price: 295000000,
    img: "https://picsum.photos/seed/mic7/600/600",
    stock: 1,
    category: "microphones",
  },
  {
    id: "p68",
    title: "Mixer SSL Duality Delta",
    desc: "Bàn mixer analog/digital hybrid, 48 kênh, màn hình cảm ứng",
    price: 2250000000,
    img: "https://picsum.photos/seed/mixer5/600/600",
    stock: 1,
    category: "pro-audio",
  },
  {
    id: "p69",
    title: "Dàn Karaoke Concert",
    desc: "Hệ thống âm thanh karaoke cao cấp, loa JBL, mixer Yamaha, micro Shure",
    price: 850000000,
    img: "https://picsum.photos/seed/karaoke4/600/600",
    stock: 1,
    category: "karaoke",
  },
  {
    id: "p70",
    title: "Bộ Thu âm Di động Pro",
    desc: "Combo thu âm di động, interface UA, micro DPA, headphone",
    price: 235000000,
    img: "https://picsum.photos/seed/mobile1/600/600",
    stock: 2,
    category: "pro-audio",
  },
  {
    id: "p71",
    title: "Piano Điện Kawai Novus NV5",
    desc: "Piano hybrid cao cấp, cơ học grand piano, âm thanh SK-EX",
    price: 425000000,
    img: "https://picsum.photos/seed/piano4/600/600",
    stock: 1,
    category: "instruments",
  },
  {
    id: "p72",
    title: "Thiết bị Xử lý Mastering SPL",
    desc: "Bộ xử lý tín hiệu analog cao cấp, EQ và Compressor chuyên mastering",
    price: 365000000,
    img: "https://picsum.photos/seed/master2/600/600",
    stock: 1,
    category: "pro-audio",
  },
];

// In-memory storage (trong thực tế sẽ dùng database)
let products = [...PRODUCTS];

module.exports = {
  // Get all products with pagination and filtering
  getAllProducts: (page = 1, limit = 12, category = null, search = null) => {
    let filtered = [...products];

    // Filter by categoryz
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Search in title and description
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.desc.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filtered.length / limit),
        totalItems: filtered.length,
        itemsPerPage: limit,
      },
    };
  },

  // Get product by ID
  getProductById: (id) => {
    return products.find((p) => p.id === id);
  },

  // Update product stock
  updateStock: (id, quantity) => {
    const product = products.find((p) => p.id === id);
    if (product && product.stock >= quantity) {
      product.stock -= quantity;
      return true;
    }
    return false;
  },

  // Check if products are in stock
  checkStock: (items) => {
    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product || product.stock < item.quantity) {
        return {
          available: false,
          message: `Sản phẩm "${product?.title || item.id}" không đủ hàng`,
          productId: item.id,
        };
      }
    }
    return { available: true };
  },

  // Admin: Create new product
  createProduct: (productData) => {
    const newProduct = {
      id: `p${Date.now()}`,
      title: productData.title,
      desc: productData.desc || '',
      price: parseFloat(productData.price),
      img: productData.img || '/images/default-product.jpg',
      images: productData.images || [],
      stock: parseInt(productData.stock) || 0,
      category: productData.category || 'other',
      discount: parseInt(productData.discount) || 0,
      rating: 0,
      ratingCount: 0,
      sold: 0,
      brand: productData.brand || '',
      specifications: productData.specifications || {}
    };
    products.push(newProduct);
    return newProduct;
  },

  // Admin: Update product
  updateProduct: (id, updateData) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    
    products[index] = {
      ...products[index],
      ...updateData,
      id: products[index].id // Prevent ID change
    };
    return products[index];
  },

  // Admin: Delete product (soft delete by setting stock to 0 and marking as deleted)
  deleteProduct: (id) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    
    products.splice(index, 1); // Actually remove from array
    return true;
  },

  // Admin: Add images to product
  addImages: (id, imageUrls) => {
    const product = products.find((p) => p.id === id);
    if (!product) return null;
    
    if (!product.images) {
      product.images = [];
    }
    product.images.push(...imageUrls);
    return product;
  },

  // Admin: Remove image from product
  removeImage: (id, imageUrl) => {
    const product = products.find((p) => p.id === id);
    if (!product || !product.images) return null;
    
    product.images = product.images.filter(img => img !== imageUrl);
    return product;
  },

  // Admin: Set main thumbnail
  setMainImage: (id, imageUrl) => {
    const product = products.find((p) => p.id === id);
    if (!product) return null;
    
    product.img = imageUrl;
    return product;
  },

  // Get all products (admin - no pagination)
  getAllProductsAdmin: () => {
    return products;
  },
};
