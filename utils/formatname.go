package utils

import "strings"

func FormatName(hyphenatedLowerCaseName string) string {
	sentenceCase := func(sentence string) string {
		words := strings.Split(sentence, " ")
		res := make([]string, len(words))
		for i, word := range words {
			res[i] = strings.Title(word)
		}
		return strings.Join(res, " ")
	}
	return sentenceCase(strings.Join(strings.Split(hyphenatedLowerCaseName, "-"), " "))
}
