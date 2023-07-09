package main

import (
	"database/sql"
	"net/http"
	"time"

	"encoding/json"
	"fmt"
	"io"
	"os"

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

type BattingStats struct {
	Runs       int     `json:"runs"`
	StrikeRate float32 `json:"strikeRate"`
	Average    float32 `json:"average"`
	Balls      int     `json:"balls"`
	Sixes      int     `json:"sixes"`
	Fours      int     `json:"fours"`
	Innings    int     `json:"innings"`
	Fifties    int     `json:"fifties"`
	Centuries  int     `json:"centuries"`
	NotOut     int     `json:"notOut"`
}

type BowlingStats struct {
	Innings     int `json:"innings"`
	Overs       int `json:"overs"`
	Runs        int `json:"runs"`
	MaidenOvers int `json:"maidenOvers"`
	Wickets     int `json:"wickets"`
	Extras      int `json:"extras"`
	Average     int `json:"average"`
	Economy     int `json:"economy"`
}

type Team struct {
	Id     int    `json:"id"`
	Name   string `json:"name"`
	Abbrev string `json:"abbrev"`
}

type TeamStats struct {
	GamesPlayed   int `json:"gamesPlayed"`
	GamesWon      int `json:"gamesWon"`
	PlayerCount   int `json:"playerCount"`
	SeasonsPlayed int `json:"seasonsPlayed"`
	SeasonsWon    int `json:"seasonsWon"`
}

func readPlayerData(db *sql.DB, name string) Player {
	var res Player
	var dob time.Time

	query := fmt.Sprintf("select * from Players where \"name\"= '%s'", name)
	player := db.QueryRow(query)
	player.Scan(&res.Id, &res.Name, &res.Country, &dob, &res.Affinity, &res.BattingAffinity, &res.BowlingAffinity)

	res.Age = int((time.Since(dob).Hours() / (24 * 365.0)))
	return res
}

func readPlayerDataFromID(db *sql.DB, id int) Player {
	var res Player
	var dob time.Time

	query := fmt.Sprintf("select * from Players where id= %d", id)
	player := db.QueryRow(query)
	player.Scan(&res.Id, &res.Name, &res.Country, &dob, &res.Affinity, &res.BattingAffinity, &res.BowlingAffinity)

	res.Age = int((time.Since(dob).Hours() / (24 * 365.0)))
	return res
}

func readBattingStats(db *sql.DB, id int) BattingStats {
	var stats BattingStats

	query := fmt.Sprintf("select sum(runs) as runs, sum(fours) as fours, sum(sixes) as sixes, sum(ballPlayed) as balls from BattingInnings where playerId = %d", id)
	queryRowRes := db.QueryRow(query)
	queryRowRes.Scan(&stats.Runs, &stats.Sixes, &stats.Fours, &stats.Balls)

	query = fmt.Sprintf("select count(inningsId) from BattingInnings where playerId = %d", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.Innings)

	query = fmt.Sprintf("select count(runs) from BattingInnings where playerId = %d and runs > 50", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.Fifties)

	query = fmt.Sprintf("select count(runs) from BattingInnings where playerId = %d and runs > 100", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.Centuries)

	query = fmt.Sprintf("select count(runs) from BattingInnings where playerId = %d and \"out\" is null", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.NotOut)

	if stats.Balls > 0 {
		stats.StrikeRate = float32(stats.Runs * 100.0 / stats.Balls)
	}

	if stats.Innings > 0 {
		stats.Average = float32(float32(stats.Runs) / float32(stats.Innings))
	}

	return stats
}

func readBowlingStats(db *sql.DB, id int) BowlingStats {
	var stats BowlingStats

	query := fmt.Sprintf("select count(inningsId) as innings, sum(runs) as runs, (sum(bowlsDelivered)/6) as overs, sum(wicketsTaken) as wickets, (sum(wides) + sum(noBalls) + sum(legBy) + sum(\"by\")) as extras, sum(maidenOvers) as maidenOvers from BowlingInnings where playerId = %d", id)
	queryRowRes := db.QueryRow(query)
	queryRowRes.Scan(&stats.Innings, &stats.Runs, &stats.Overs, &stats.Wickets, &stats.Extras, &stats.MaidenOvers)

	query = fmt.Sprintf("select count(inningsId) from BowlingInnings where playerId = %d", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.Innings)

	if stats.Wickets == 0 {
		stats.Average = stats.Runs
	} else {
		stats.Average = stats.Runs / stats.Wickets
	}

	if stats.Overs > 0 {
		stats.Economy = stats.Runs / stats.Overs
	}

	return stats
}

func player(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		res := make(map[string]any)
		var req map[string]any

		reqBody, _ := io.ReadAll(r.Body)
		json.Unmarshal(reqBody, &req)
		data := readPlayerData(db, req["player"].(string))

		if data.Affinity == "BATSMAN" || data.Affinity == "ALL_ROUNDER" || data.Affinity == "WICKET_KEEPER_BATSMAN" {
			res["battingStats"] = readBattingStats(db, data.Id)
		}

		if data.Affinity == "ALL_ROUNDER" || data.Affinity == "BOWLER" {
			res["bowlingStats"] = readBowlingStats(db, data.Id)
		}

		w.Header().Set("content-type", "application/json")
		res["data"] = data

		resBody, _ := json.Marshal(res)
		w.Write(resBody)
	}
}

func readTeamData(db *sql.DB, name string) Team {
	var res Team

	query := fmt.Sprintf("select * from Teams where \"name\" = '%s'", name)
	team := db.QueryRow(query)
	team.Scan(&res.Id, &res.Name, &res.Abbrev)

	return res
}

func readTeamStats(db *sql.DB, id int) TeamStats {
	var stats TeamStats

	query := fmt.Sprintf("select count(id) as gamesPlayed, count(distinct seasonNo) as seasonsPlayed from Games where team1 = %d or team2 = %d", id, id)
	queryRowRes := db.QueryRow(query)
	queryRowRes.Scan(&stats.GamesPlayed, stats.SeasonsPlayed)

	query = fmt.Sprintf("select count(id) as gamesWon from Games where winner = %d", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.GamesWon)

	query = fmt.Sprintf("select count(winner) as count from Seasons where winner = %d", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.SeasonsWon)

	query = fmt.Sprintf("select count(playerId) as playerCount from MemberOf where teamId = %d", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.PlayerCount)

	return stats
}

func team(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req map[string]any
		res := make(map[string]any)

		reqBody, _ := io.ReadAll(r.Body)
		json.Unmarshal(reqBody, &req)

		team := readTeamData(db, req["team"].(string))
		stats := readTeamStats(db, team.Id)
		var players []Player

		query := fmt.Sprintf("select playerId from MemberOf where teamId = %d", team.Id)
		queryRows, _ := db.Query(query)
		defer queryRows.Close()

		for queryRows.Next() {
			var playerId int
			queryRows.Scan(&playerId)
			players = append(players, readPlayerDataFromID(db, playerId))
		}

		res["data"] = team
		res["stats"] = stats
		res["players"] = players

		w.Header().Set("content-type", "apllication/json")
		resBody, _ := json.Marshal(res)
		w.Write(resBody)
	}
}

func playerSearch(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		queries := r.URL.Query()
		fmt.Println(queries["name"][0])

		var player Player
		var players []Player
		var dob time.Time
		query := fmt.Sprintf("select * from Players where \"name\" like '%%%s%%'", queries["name"][0])

		fmt.Println(query)
		p, err := db.Query(query)
		if err != nil {
			panic(err)
		}
		defer p.Close()

		for p.Next() {
			p.Scan(&player.Id, &player.Name, &player.Country, &dob, &player.Affinity, &player.BattingAffinity, &player.BowlingAffinity)
			player.Age = int((time.Since(dob).Hours() / (24 * 365.0)))
			players = append(players, player)
		}

		res := make(map[string]any)
		w.Header().Set("content-type", "apllication/json")
		res["matches"] = players
		resBody, _ := json.Marshal(res)
		w.Write(resBody)
	}
}

func image(w http.ResponseWriter, r *http.Request) {
	var req map[string]any
	reqBody, _ := io.ReadAll(r.Body)
	json.Unmarshal(reqBody, &req)

	filePath := req["path"].(string)
	fileData, _ := os.ReadFile(filePath)

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Write(fileData)
}

func main() {
	dbInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	db, err := sql.Open("postgres", dbInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	http.HandleFunc("/player", player(db))
	http.HandleFunc("/playerSearch", playerSearch(db))
	http.HandleFunc("/team", team(db))
	http.HandleFunc("/image", image)
	http.ListenAndServe(":8000", nil)
}
