package main

import (
	"database/sql"
	"net/http"
	"time"

	"encoding/json"
	"fmt"
	"io"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "autives"
	password = "hellothere"
	dbname   = "iplarchive"
)

type Player struct {
	Id              int    `json:"id"`
	Name            string `json:"name"`
	Country         string `json:"country"`
	Age             int    `json:"age"`
	Affinity        string `json:"affinity"`
	BattingAffinity string `json:"battingAffinity"`
	BowlingAffinity string `json:"bowlingAffinity"`
}

func readPlayerData(db *sql.DB, id int) Player {
	var res Player
	var dob time.Time

	query := fmt.Sprintf("select * from Players where id = %d", id)
	player := db.QueryRow(query)
	player.Scan(&res.Id, &res.Name, &res.Country, &dob, &res.Affinity, &res.BattingAffinity, &res.BowlingAffinity)

	res.Age = int((time.Since(dob).Hours() / (24 * 365.0)))
	return res
}

func player(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		reqBody, _ := io.ReadAll(c.Request.Body)
		var req map[string]any
		json.Unmarshal(reqBody, &req)

		query := fmt.Sprintf("select id from players where \"name\" = '%s'", req["player"])
		playerId := db.QueryRow(query)

		var id int
		playerId.Scan(&id)
		data := readPlayerData(db, id)

		res := make(map[string]any)
		res["data"] = data

		c.JSON(http.StatusOK, res)
	}
}

func main() {
	dbInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	db, err := sql.Open("postgres", dbInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	engine := gin.Default()
	engine.GET("/player", player(db))

	engine.Run()
}
