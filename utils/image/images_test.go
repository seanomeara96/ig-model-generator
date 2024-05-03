package image

import "testing"

func TestDownload(t *testing.T) {
	err := Download("https://fakeimg.pl/100x100", "./test_images/test.png")
	if err != nil {
		t.Error(err)
	}
}
