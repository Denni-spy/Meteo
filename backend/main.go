package main

import (
	"fmt"
	"net/http"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, World!")
}

func statusHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Server läuft einwandfrei!")
}

func main() {
	http.HandleFunc("/", helloHandler)        //Root URL
	http.HandleFunc("/status", statusHandler) //Status URL
	fmt.Println("Starting server on :8080")
	http.ListenAndServe(":8080", nil)
}
