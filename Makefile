run:
	go run cmd/serve/main.go -port 3000

build:
	go build -o bin/serve cmd/serve/main.go && systemctl restart vogue.service && systemctl status vogue.service
