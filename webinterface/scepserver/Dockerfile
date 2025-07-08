FROM golang:1.22-alpine AS build
RUN apk add --no-cache git
RUN go install github.com/micromdm/scep/v2/cmd/scepserver@v2.3.0

FROM alpine
RUN apk add --no-cache ca-certificates
COPY --from=build /go/bin/scepserver /usr/local/bin/scepserver
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
WORKDIR /data
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
CMD ["scepserver"]

