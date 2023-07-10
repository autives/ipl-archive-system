package main

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"encoding/json"
	"fmt"
	"os"

	_ "github.com/lib/pq"
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
	Logo   string `json:"logo"`
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
		queries := r.URL.Query()
		res := make(map[string]any)

		id, _ := strconv.ParseInt(queries["id"][0], 10, 32)
		data := readPlayerDataFromID(db, int(id))

		if data.Affinity == "BATSMAN" || data.Affinity == "ALL_ROUNDER" || data.Affinity == "WICKET_KEEPER_BATSMAN" {
			res["battingStats"] = readBattingStats(db, data.Id)
		}

		if data.Affinity == "ALL_ROUNDER" || data.Affinity == "BOWLER" {
			res["bowlingStats"] = readBowlingStats(db, data.Id)
		}

		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		res["data"] = data

		resBody, _ := json.Marshal(res)
		w.Write(resBody)
	}
}

func readTeamData(db *sql.DB, id int) Team {
	var res Team

	query := fmt.Sprintf("select * from Teams where id = '%d'", id)
	team := db.QueryRow(query)
	team.Scan(&res.Id, &res.Name, &res.Abbrev, &res.Logo)

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

func teams(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := "select * from Teams"
		queryRows, _ := db.Query(query)
		defer queryRows.Close()

		var teams []Team
		for queryRows.Next() {
			var team Team
			queryRows.Scan(&team.Id, &team.Name, &team.Abbrev, &team.Logo)
			teams = append(teams, team)
		}

		w.Header().Set("content-type", "apllication/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")

		res := make(map[string]any)
		res["teams"] = teams
		resBody, _ := json.Marshal(res)
		w.Write(resBody)
	}
}

func team(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		queries := r.URL.Query()
		res := make(map[string]any)

		id, _ := strconv.ParseInt(queries["id"][0], 10, 32)
		team := readTeamData(db, int(id))
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
		w.Header().Set("Access-Control-Allow-Origin", "*")
		resBody, _ := json.Marshal(res)
		w.Write(resBody)
	}
}

func playerSearch(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		queries := r.URL.Query()

		var player Player
		var players []Player
		var dob time.Time
		query := fmt.Sprintf("select * from Players where \"name\" like '%%%s%%'", queries["name"][0])

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
		w.Header().Set("Access-Control-Allow-Origin", "*")
		res["matches"] = players
		resBody, _ := json.Marshal(res)
		w.Write(resBody)
	}
}

func image(w http.ResponseWriter, r *http.Request) {
	queries := r.URL.Query()

	filePath := queries["path"][0]
	fileData, _ := os.ReadFile(filePath)

	fmt.Println("hello", filePath)
	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(fileData)
}

func main() {
	envFile, _ := os.ReadFile("../database/dbenv.json")
	var dbEnv map[string]any
	json.Unmarshal(envFile, &dbEnv)
	dbInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", dbEnv["host"].(string), int(dbEnv["port"].(float64)), dbEnv["user"].(string), dbEnv["password"].(string), dbEnv["dbname"].(string))

	db, err := sql.Open("postgres", dbInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	http.HandleFunc("/player", player(db))
	http.HandleFunc("/playerSearch", playerSearch(db))
	http.HandleFunc("/team", team(db))
	http.HandleFunc("/image", image)
	http.HandleFunc("/teams", teams(db))
	http.ListenAndServe(":8000", nil)
}
