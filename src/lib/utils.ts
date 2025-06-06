import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a cute app name like "blue-fox" or "jumping-zebra"
 */
export function generateCuteAppName(): string {
  const adjectives = [
    "happy",
    "gentle",
    "brave",
    "clever",
    "swift",
    "bright",
    "calm",
    "nimble",
    "sleepy",
    "fluffy",
    "wild",
    "tiny",
    "bold",
    "wise",
    "merry",
    "quick",
    "busy",
    "silent",
    "cozy",
    "jolly",
    "playful",
    "friendly",
    "curious",
    "peaceful",
    "silly",
    "dazzling",
    "graceful",
    "elegant",
    "cosmic",
    "whispering",
    "dancing",
    "sparkling",
    "mystical",
    "vibrant",
    "radiant",
    "dreamy",
    "patient",
    "energetic",
    "vigilant",
    "sincere",
    "electric",
    "stellar",
    "lunar",
    "serene",
    "mighty",
    "magical",
    "neon",
    "azure",
    "crimson",
    "emerald",
    "golden",
    "jade",
    "crystal",
    "snuggly",
    "glowing",
    "wandering",
    "whistling",
    "bubbling",
    "floating",
    "flying",
    "hopping",
  ];

  const animals = [
    "fox",
    "panda",
    "rabbit",
    "wolf",
    "bear",
    "owl",
    "koala",
    "beaver",
    "ferret",
    "squirrel",
    "zebra",
    "tiger",
    "lynx",
    "lemur",
    "penguin",
    "otter",
    "hedgehog",
    "deer",
    "badger",
    "raccoon",
    "turtle",
    "dolphin",
    "eagle",
    "falcon",
    "parrot",
    "capybara",
    "axolotl",
    "narwhal",
    "wombat",
    "meerkat",
    "platypus",
    "mongoose",
    "chinchilla",
    "quokka",
    "alpaca",
    "chameleon",
    "ocelot",
    "manatee",
    "puffin",
    "shiba",
    "sloth",
    "gecko",
    "hummingbird",
    "mantis",
    "jellyfish",
    "pangolin",
    "okapi",
    "binturong",
    "tardigrade",
    "beluga",
    "kiwi",
    "octopus",
    "salamander",
    "seahorse",
    "kookaburra",
    "gibbon",
    "jackrabbit",
    "lobster",
    "iguana",
    "tamarin",
    "armadillo",
    "starfish",
    "walrus",
    "phoenix",
    "griffin",
    "dragon",
    "unicorn",
    "kraken",
  ];

  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

  return `${randomAdjective}-${randomAnimal}`;
}
