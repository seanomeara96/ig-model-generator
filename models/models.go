package models

type Image struct {
	ID     int
	URL    string
	Prompt string
	Name   string
}

type CommonPageData struct {
	SiteTitle  string
	Env        string
	StyleSheet string
}

type BasePageData struct {
	CommonPageData
	PageTitle       string
	MetaDescription string
	Names           []string
}

type HomePageData struct {
	BasePageData
	Collections [][]Image
}

type ModelGalleryData struct {
	BasePageData
	Images []Image
}
