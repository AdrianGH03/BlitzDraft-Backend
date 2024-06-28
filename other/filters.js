const fs = require('fs');
const Filter = require('bad-words');

function createFilter() {
  return new Promise((resolve, reject) => {
    const filter = new Filter();

    fs.readFile('./badWords.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      const words = data.replace(/\r/g, '').split('\n');
      filter.addWords(...words);

      
      filter.isProfane = function(text) {
        const wordList = this.list;
        // Check for profanity
        if (wordList.some(word => text.toLowerCase().includes(word))) {
          return true;
        }
      
        const numberLetterMapping = {
          '0': 'o',
          '1': 'i',
          '2': 'z',
          '3': 'e',
          '4': 'a',
          '5': 's',
          '6': 'b',
          '7': 't',
          '8': 'b',
          '9': 'g',
          '11': 'n',
          '12': 'r',
        };
      
        const homoglyphMapping = {
          'а': 'a', // Cyrillic 'a'
          'е': 'e', // Cyrillic 'e'
          'о': 'o', // Cyrillic 'o'
          'р': 'p', // Cyrillic 'p'
          'с': 'c', // Cyrillic 'c'
          'у': 'y', // Cyrillic 'y'
          'х': 'x', // Cyrillic 'x'
          'ı': 'i', // Dotless i
          'ł': 'l', // L with stroke
          'ſ': 's', // Long s
          'ƨ': 's', // Tailed z
          'ɓ': 'b', // Small b with hook
          'ɔ': 'o', // Open o
          'ɛ': 'e', // Open e
          'ɡ': 'g', // Script g
          'ɩ': 'i', // Small capital i
          'ɪ': 'i', // Small capital i
          'ɴ': 'n', // Small capital n
          'ɹ': 'r', // Turned r
          'ʀ': 'r', // Small capital r
          'ʏ': 'y', // Small capital y
          'ʙ': 'b', // Small capital b
          'ʜ': 'h', // Small capital h
          'ʟ': 'l', // Small capital l
          'ʰ': 'h', // Modifier letter small h
          'ʳ': 'r', // Modifier letter small r
          'ʷ': 'w', // Modifier letter small w
          'ʸ': 'y', // Modifier letter small y
          'ˡ': 'l', // Modifier letter small l
          'ˢ': 's', // Modifier letter small s
          'ˣ': 'x', // Modifier letter small x
          'ͣ': '', // Modifier letter small x
          'ͤ': '', // Modifier letter small x
          'ͥ': '', // Modifier letter small x
          'ͦ': '', // Modifier letter small x
          'ͧ': '', // Modifier letter small x
          'ͨ': '', // Modifier letter small x
          'ͩ': '', // Modifier letter small x
          'ͪ': '', // Modifier letter small x
          'ͫ': '', // Modifier letter small x
          'ͬ': '', // Modifier letter small x
          'ͭ': '', // Modifier letter small x
          'ͮ': '', // Modifier letter small x
          'ͯ': '', // Modifier letter small x
          'ᴀ': 'a', // Small capital a
          'ᴄ': 'c', // Small capital c
          'ᴇ': 'e', // Small capital e
          'ᴊ': 'j', // Small capital j
          'ᴋ': 'k', // Small capital k
          '$': 's', // Dollar sign
          '¢': 'c', // Cent sign
          '£': 'l', // Pound sign
          '¥': 'y', // Yen sign
          '€': 'e', // Euro sign
          '₹': 'r', // Indian rupee sign
          '₺': 'l', // Turkish lira sign
          '₽': 'r', // Russian ruble sign
          '₿': 'b', // Bitcoin sign
          'ℓ': 'l', // Script l
          'Ω': 'w', // Ohm sign
          '℮': 'e', // Estimated symbol
          '@': 'a', // At sign
          '©': 'c', // Copyright sign
          '®': 'r', // Registered sign
          '™': 't', // Trade mark sign
          '℠': 'sm', // Service mark sign
          '℡': 'tel', // Telephone sign
          '*': 'x', // Asterisk
          '!': 'i', // Exclamation mark
          '|': 'l', // Vertical bar
          '\\': '/', // Backslash
          '∕': '/', // Division slash
          "+": "t", // Plus sign
        };
      
        
        let normalizedText = text.toLowerCase();
        normalizedText = normalizedText.replace(/\s+/g, ''); // remove spaces
        normalizedText = normalizedText.replace(/[0134576892112]/g, match => numberLetterMapping[match]); // replace numbers with letters
        normalizedText = normalizedText.replace(/(.)\1+/g, '$1'); // replace repeating characters
      
        
        for (const [homoglyph, replacement] of Object.entries(homoglyphMapping)) {
          const regex = new RegExp(homoglyph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          normalizedText = normalizedText.replace(regex, replacement);
        }
      
       
        normalizedText = normalizedText.replace(/[^a-z0-9]/gi, '');
      
       
        return wordList.some(word => { 
          const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          return regex.test(normalizedText);
        });
      };

      resolve(filter);
    });
  });
}

module.exports = createFilter;