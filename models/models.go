package models

type Image struct {
	ID     int
	URL    string
	Prompt string
	Name   string
}

type HomePageData struct {
	PageTitle       string
	MetaDescription string
	Collections     [][]Image
	SiteTitle       string
	Names           []string
}
