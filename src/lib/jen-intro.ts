export type IntroLine = {
  zh: string;
  pinyin: string;
  de: string;
};

/** Jens persönliche Vorstellung (aus dem Heft, 07.06.2026). */
export const JEN_INTRO_LINES: IntroLine[] = [
  { zh: "你好！", pinyin: "Nǐ hǎo!", de: "Hallo!" },
  {
    zh: "我叫朴若瑟。",
    pinyin: "Wǒ jiào Piǔ Ruòsè.",
    de: "Ich heiße 朴若瑟 (Park Joseph).",
  },
  {
    zh: "我的家人叫我 Jen。",
    pinyin: "Wǒ de jiārén jiào wǒ Jen.",
    de: "Meine Familie nennt mich Jen.",
  },
  {
    zh: "我有一個哥哥，我的哥哥喜歡打網球。",
    pinyin: "Wǒ yǒu yīgè gēge, wǒ de gēge xǐhuān dǎ wǎngqiú.",
    de: "Ich habe einen älteren Bruder; mein Bruder spielt gern Tennis.",
  },
  {
    zh: "我喜歡臺灣人，因為他們很好。",
    pinyin: "Wǒ xǐhuān Táiwān rén, yīnwèi tāmen hěn hǎo.",
    de: "Ich mag Taiwaner, weil sie sehr nett sind.",
  },
  {
    zh: "我愛吃雞肉飯。",
    pinyin: "Wǒ ài chī jīròu fàn.",
    de: "Ich esse gern Hühnchenreis.",
  },
  {
    zh: "我愛喝咖啡。",
    pinyin: "Wǒ ài hē kāfēi.",
    de: "Ich trinke gern Kaffee.",
  },
  {
    zh: "我常去健身房。",
    pinyin: "Wǒ cháng qù jiànshēnfáng.",
    de: "Ich gehe oft ins Fitnessstudio.",
  },
];

export const JEN_INTRO_TEXT = JEN_INTRO_LINES.map((l) => l.zh).join("");
