export interface Gradient {
    id: string;
    name: string;
    css: string;
}

export const PREDEFINED_GRADIENTS: Gradient[] = [
    {
        id: "lime-sun",
        name: "Lime Sun",
        css: "radial-gradient( circle farthest-corner at 10% 20%,  rgba(8,247,14,0.76) 0%, rgba(251,249,69,1) 90% )",
    },
    {
        id: "fiery-sky",
        name: "Fiery Sky",
        css: "radial-gradient( circle farthest-corner at -1.2% 43.9%,  rgba(252,146,32,1) 16.1%, rgba(255,4,4,1) 74.3% )",
    },
    {
        id: "sunset-glow",
        name: "Sunset Glow",
        css: "linear-gradient(to right, #ff7e5f, #feb47b)",
    },
    {
        id: "ocean-breeze",
        name: "Ocean Breeze",
        css: "linear-gradient(to right, #2c3e50, #4ca1af)",
    },
    {
        id: "emerald-waters",
        name: "Emerald Waters",
        css: "linear-gradient( 180.5deg,  rgba(46,255,171,1) 12.3%, rgba(252,251,222,0.46) 92% )",
    },
    {
        id: "cyan-dream",
        name: "Cyan Dream",
        css: "linear-gradient( 68.4deg,  rgba(99,251,215,1) -0.4%, rgba(5,222,250,1) 100.2% )",
    },
    {
        id: "pastel-orb",
        name: "Pastel Orb",
        css: "radial-gradient( circle 369px at -2.9% 12.9%,  rgba(247,234,163,1) 0%, rgba(236,180,238,0.56) 46.4%, rgba(163,203,247,1) 100.7% )",
    },
    {
        id: "magenta-kiss",
        name: "Magenta Kiss",
        css: "linear-gradient( 291.7deg,  rgba(255,134,134,1) 21.5%, rgba(249,141,255,1) 93.1% )",
    },
    {
        id: "aqua-splash",
        name: "Aqua Splash",
        css: "linear-gradient( 90.2deg,  rgba(79,255,255,1) 0.3%, rgba(0,213,255,1) 99.8% )",
    },
    {
        id: "spring-meadow",
        name: "Spring Meadow",
        css: "linear-gradient( 184.1deg,  rgba(249,255,182,1) 44.7%, rgba(226,255,172,1) 67.2% )",
    },
    {
        id: "golden-hour",
        name: "Golden Hour",
        css: "radial-gradient( circle 331px at 1.4% 52.9%,  rgba(255,236,2,1) 0%, rgba(255,223,2,1) 33.6%, rgba(255,187,29,1) 61%, rgba(255,175,7,1) 100.7% )",
    },
    {
        id: "rainbow-burst",
        name: "Rainbow Burst",
        css: "linear-gradient( 226.4deg,  rgba(255,26,1,1) 28.9%, rgba(254,155,1,1) 33%, rgba(255,241,0,1) 48.6%, rgba(34,218,1,1) 65.3%, rgba(0,141,254,1) 80.6%, rgba(113,63,254,1) 100.1% )",
    },
    {
        id: "ethereal-haze",
        name: "Ethereal Haze",
        css: "linear-gradient( 109.6deg,  rgba(112,246,255,0.33) 11.2%, rgba(221,108,241,0.26) 42%, rgba(229,106,253,0.71) 71.5%, rgba(123,183,253,1) 100.2% )",
    },
    {
        id: "electric-blue",
        name: "Electric Blue",
        css: "linear-gradient( 150.4deg,  rgba(75,255,237,1) 11.7%, rgba(32,42,235,1) 82.4% )",
    },
    {
        id: "coral-blush",
        name: "Coral Blush",
        css: "radial-gradient( circle farthest-corner at 12.9% 20.3%,  rgba(255,162,104,1) 0%, rgba(254,80,147,1) 41% )",
    },
    {
        id: "soft-spectrum",
        name: "Soft Spectrum",
        css: "linear-gradient( 90deg,  rgba(218,255,234,1) 5.3%, rgba(232,255,231,1) 11.6%, rgba(240,255,233,1) 17.4%, rgba(243,255,226,1) 22.9%, rgba(253,255,228,1) 28.5%, rgba(255,248,225,1) 33.9%, rgba(255,241,229,1) 39.4%, rgba(255,228,222,1) 44.8%, rgba(255,231,231,1) 50.3%, rgba(255,231,243,1) 56.9%, rgba(255,229,255,1) 63.2%, rgba(245,228,255,1) 69.1%, rgba(236,228,255,1) 74.7%, rgba(231,238,255,1) 80.4%, rgba(229,249,255,1) 85.8%, rgba(231,255,250,1) 90.6%, rgba(229,255,243,1) 94.4%, rgba(220,255,228,1) 98.3% )",
    },
    {
        id: "vibrant-mix",
        name: "Vibrant Mix",
        css: "linear-gradient( 109.6deg,  rgba(25,252,242,1) 11.2%, rgba(211,25,252,1) 26.1%, rgba(252,170,25,1) 44.6%, rgba(235,252,25,1) 60.7%, rgba(25,252,130,1) 79.4%, rgba(195,48,253,1) 91.1% )",
    },
    {
        id: "sky-blue-fade",
        name: "Sky Blue Fade",
        css: "linear-gradient( 109.6deg,  rgba(75,228,255,1) 11.2%, rgba(188,204,251,1) 100.6% )",
    },
    {
        id: "minty-fresh",
        name: "Minty Fresh",
        css: "linear-gradient(-225deg, #9EFBD3 0%, #57E9F2 48%, #45D4FB 100%)",
    },
    {
        id: "lemon-lime",
        name: "Lemon Lime",
        css: "linear-gradient(-225deg, #20E2D7 0%, #F9FEA5 100%)",
    },
    {
        id: "sunset-orange",
        name: "Sunset Orange",
        css: "linear-gradient(to right, #f9d423 0%, #ff4e50 100%)",
    },
    {
        id: "peach-dream",
        name: "Peach Dream",
        css: "linear-gradient(-20deg, #fc6076 0%, #ff9a44 100%)",
    },
];
