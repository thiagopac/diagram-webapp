export interface UsernameProperties {
  color: string;
  animal: string;
  title: string;
}

export class UsernameUtils {
  static getRandomUsername(): UsernameProperties {
    // return `convidado-${btoa(Math.random().toString()).substring(10, 15)}`;

    const color = this.getRandomColor();
    const animal: string = this.getRandomAnimalName();

    return {
      color: color.colorHex,
      animal: animal,
      title: `${color.colorName} ${animal}`,
    } as UsernameProperties;
  }

  static getRandomColor(): { colorName: string; colorHex: string } {
    const colors = [
      { colorName: 'Aqua', colorHex: '00ffff' },
      { colorName: 'Black', colorHex: '000000' },
      { colorName: 'Blue', colorHex: '0000ff' },
      { colorName: 'Brown', colorHex: '964B00' },
      { colorName: 'Coral', colorHex: 'FF7F50' },
      { colorName: 'Crimson', colorHex: 'DC143C' },
      { colorName: 'Gold', colorHex: 'FFD700' },
      { colorName: 'Gray', colorHex: '808080' },
      { colorName: 'Green', colorHex: '00A300' },
      { colorName: 'Indigo', colorHex: '4b0082' },
      { colorName: 'Lavender', colorHex: 'e6e6fa' },
      { colorName: 'Lime', colorHex: '32CD32' },
      { colorName: 'Magenta', colorHex: 'ff00ff' },
      { colorName: 'Maroon', colorHex: '800000' },
      { colorName: 'Navy', colorHex: '000080' },
      { colorName: 'Olive', colorHex: '808000' },
      { colorName: 'Orange', colorHex: 'FF6600' },
      { colorName: 'Pink', colorHex: 'CC99A2' },
      { colorName: 'Purple', colorHex: '800080' },
      { colorName: 'Red', colorHex: 'ff0000' },
      { colorName: 'Silver', colorHex: 'A9A9A9' },
      { colorName: 'Teal', colorHex: '008080' },
      { colorName: 'Turquoise', colorHex: '40e0d0' },
      { colorName: 'Violet', colorHex: 'ee82ee' },
      { colorName: 'Yellow', colorHex: 'CCA43D' },
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return {
      colorName: randomColor.colorName,
      colorHex: `#${randomColor.colorHex}`,
    };
  }

  static getRandomAnimalName(): string {
    const animals = [
      'Bear',
      'Bird',
      'Cat',
      'Deer',
      'Dog',
      'Eagle',
      'Fox',
      'Giraffe',
      'Hedgehog',
      'Horse',
      'Kangaroo',
      'Koala',
      'Lion',
      'Llama',
      'Monkey',
      'Owl',
      'Panda',
      'Parrot',
      'Rabbit',
      'Raccoon',
      'Shark',
      'Sheep',
      'Sloth',
      'Tiger',
      'Toucan',
      'Whale',
      'Wolf',
      'Zebra',
    ];

    const randomIndex = Math.floor(Math.random() * animals.length);

    return animals[randomIndex];
  }
}
