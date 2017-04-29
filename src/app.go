// this is the redirecting and home server
package main

import (
	"bytes"
	"github.com/go-martini/martini"
	"github.com/googollee/go-socket.io"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
)

type mainPage struct {
	Dist_code template.JS
}

func get_code() (string, error) {
	b, err := ioutil.ReadFile("dist/dist.js") // just pass the file name
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func onConnection(so socketio.Socket) {
	log.Println("on connection")
	so.Join("chat")
	so.On("message", func(msg string) {
		log.Println(msg)
	})
	so.On("disconnection", func() {
		log.Println("on disconnect")
	})
}

func main() {
	m := martini.Classic()
	m.Use(martini.Static("static"))
	m.Get("/", func() (int, string) {
		code, err := get_code()
		if err != nil {
			return 500, "Internal server error getting code."
		}
		page, err := ioutil.ReadFile("templates/index.html")
		if err != nil {
			return 500, "Internal server error reading template"
		}
		p, err := template.New("derp").Parse(string(page))
		if err != nil {
			return 500, "Internal server error: couldn't create template"
		}
		var s bytes.Buffer
		p.Execute(&s, mainPage{Dist_code: template.JS(code)})
		return 200, s.String()
	})
	//m.Use(martini.Static("static"))
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.On("connection", onConnection)
	server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})
	http.Handle("/", m)
	http.Handle("/socket.io/", server)
	log.Println("Serving at localhost:8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
