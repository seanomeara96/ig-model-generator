export function formatName(hyphenatedLowerCaseName: string): string {
    function sentenceCase(sentence: string | string[]) {
      const words = Array.isArray(sentence) ? sentence : sentence.split(" ");
      const res: string[] = [];
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        res.push(word[0].toUpperCase() + word.substring(1));
      }
      return res.join(" ");
    }
    return sentenceCase(hyphenatedLowerCaseName.split("-"));
  }