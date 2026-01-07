package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type stationData struct {
	Name string  `json:"name,omitempty"`
	Temp float32 `json:"temperature,omitempty"`
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, World!")
}

func statusHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "bla")
	/*	response := httpStatus{
			Status:  200,
			Message: "Hallo",
		}
		encoder := json.NewEncoder(w)
		err := encoder.Encode(response)
		if err != nil {
			response := httpStatus{
				Status:  400,
				Message: "Encoding failed",
			}
			encoder := json.NewEncoder(w)
		}
	*/
}

func stationHandler(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	name := q.Get("name")
	long := q.Get("long")
	fmt.Println(long)
	fmt.Println(name)
	encoder := json.NewEncoder(w)
	var data stationData

	if long == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if name == "moskau" {
		data = stationData{
			Name: "Moskau",
			Temp: 21.7,
		}
	} else {
		data = stationData{}
	}
	encoder.Encode(data)
}

func main() {
	http.HandleFunc("/", helloHandler)        //Root URL
	http.HandleFunc("/status", statusHandler) //Status URL
	http.HandleFunc("/station", stationHandler)
	fmt.Println("Starting server on :8080")
	http.ListenAndServe(":8080", nil)
}
