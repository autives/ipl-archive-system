package main

import (
	"database/sql"
	"errors"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"encoding/json"
	"fmt"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

type Player struct {
	Id              int    `json:"id"`
	Name            string `json:"name"`
	Country         string `json:"country"`
	Age             int    `json:"age"`
	Affinity        string `json:"affinity"`
	BattingAffinity string `json:"battingAffinity"`
	BowlingAffinity string `json:"bowlingAffinity"`
	Photo           string `json:"photo"`
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

func httpWriteError(w http.ResponseWriter, str string) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte(str))
}

func readPlayerDataFromID(db *sql.DB, id int) Player {
	var res Player
	var dob time.Time

	query := fmt.Sprintf("select * from Players where id= %d", id)
	player := db.QueryRow(query)
	player.Scan(&res.Id, &res.Name, &res.Country, &dob, &res.Affinity, &res.BattingAffinity, &res.BowlingAffinity, &res.Photo)

	res.Age = int((time.Since(dob).Hours() / (24 * 365.0)))
	return res
}

func readBattingStats(db *sql.DB, id int) (BattingStats, error) {
	var stats BattingStats
	var err error

	query := fmt.Sprintf("select sum(runs) as runs, sum(fours) as fours, sum(sixes) as sixes, sum(ballPlayed) as balls from BattingInnings where playerId = %d", id)
	queryRowRes := db.QueryRow(query)
	err = queryRowRes.Scan(&stats.Runs, &stats.Sixes, &stats.Fours, &stats.Balls)
	if err != nil {
		return stats, err
	}

	query = fmt.Sprintf("select count(inningsId) from BattingInnings where playerId = %d", id)
	queryRowRes = db.QueryRow(query)
	err = queryRowRes.Scan(&stats.Innings)
	if err != nil {
		return stats, err
	}

	query = fmt.Sprintf("select count(runs) from BattingInnings where playerId = %d and runs > 50", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.Fifties)
	if err != nil {
		return stats, err
	}

	query = fmt.Sprintf("select count(runs) from BattingInnings where playerId = %d and runs > 100", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.Centuries)
	if err != nil {
		return stats, err
	}

	query = fmt.Sprintf("select count(runs) from BattingInnings where playerId = %d and \"out\" is null", id)
	queryRowRes = db.QueryRow(query)
	queryRowRes.Scan(&stats.NotOut)
	if err != nil {
		return stats, err
	}

	if stats.Balls > 0 {
		stats.StrikeRate = float32(stats.Runs * 100.0 / stats.Balls)
	}

	if stats.Innings > 0 {
		stats.Average = float32(float32(stats.Runs) / float32(stats.Innings))
	}

	return stats, nil
}

func getEnum(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		queries := r.URL.Query()

		query := fmt.Sprintf("select unnest(enum_range(NULL::%s)) as enum", queries["enum"][0])
		enum, err := db.Query(query)
		if err != nil {
			panic(err)
		}

		var res []string
		for enum.Next() {
			var name string
			enum.Scan(&name)
			res = append(res, name)
		}

		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		resBody, _ := json.Marshal(res)
		w.Write(resBody)
	}
}

func readBowlingStats(db *sql.DB, id int) (BowlingStats, error) {
	var stats BowlingStats

	query := fmt.Sprintf("select count(inningsId) as innings, sum(runs) as runs, (sum(bowlsDelivered)/6) as overs, sum(wicketsTaken) as wickets, (sum(wides) + sum(noBalls) + sum(legBy) + sum(\"by\")) as extras, sum(maidenOvers) as maidenOvers from BowlingInnings where playerId = %d", id)
	queryRowRes := db.QueryRow(query)
	err := queryRowRes.Scan(&stats.Innings, &stats.Runs, &stats.Overs, &stats.Wickets, &stats.Extras, &stats.MaidenOvers)
	if err != nil {
		return stats, err
	}

	query = fmt.Sprintf("select count(inningsId) from BowlingInnings where playerId = %d", id)
	queryRowRes = db.QueryRow(query)
	err = queryRowRes.Scan(&stats.Innings)
	if err != nil {
		return stats, err
	}

	if stats.Wickets == 0 {
		stats.Average = stats.Runs
	} else {
		stats.Average = stats.Runs / stats.Wickets
	}

	if stats.Overs > 0 {
		stats.Economy = stats.Runs / stats.Overs
	}

	return stats, nil
}

func player(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		queries := r.URL.Query()
		res := make(map[string]any)

		id, _ := strconv.ParseInt(queries["id"][0], 10, 32)
		data := readPlayerDataFromID(db, int(id))

		res["battingStats"] = nil
		res["bowlingStats"] = nil
		if data.Affinity == "BATSMAN" || data.Affinity == "ALL_ROUNDER" || data.Affinity == "WICKET_KEEPER_BATSMAN" {
			battingStats, err := readBattingStats(db, data.Id)
			if err != nil {
				res["battingStats"] = battingStats
			}
		}

		if data.Affinity == "ALL_ROUNDER" || data.Affinity == "BOWLER" {
			bowlingStats, err := readBowlingStats(db, data.Id)
			if err != nil {
				res["bowlingStats"] = bowlingStats
			}
		}

		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		res["data"] = data

		resBody, _ := json.Marshal(res)
		w.Write(resBody)
	}
}

func addPlayer(db *sql.DB, r *http.Request) error {
	var p Player
	age, _ := strconv.ParseInt(r.FormValue("age"), 10, 32)

	p.Name = r.FormValue("name")
	p.Age = int(age)
	p.Country = r.FormValue("country")
	p.Affinity = r.FormValue("playerAffinity")
	p.BattingAffinity = r.FormValue("battingAffinity")
	p.BowlingAffinity = r.FormValue("bowlingAffinity")

	dob := time.Now().AddDate(-int(p.Age), 0, 0)
	y, m, d := dob.Date()
	query := fmt.Sprintf("insert into Players(\"name\", country, dob, \"affinity\", battingAffinity, bowlingAffinity) values('%s', '%s', date('%d %s %d'), '%s', '%s', '%s') returning id", p.Name, p.Country, y, m, d, p.Affinity, p.BattingAffinity, p.BowlingAffinity)

	err := db.QueryRow(query).Scan(&p.Id)
	if err != nil {
		return err
	}

	file, _, err := r.FormFile("image")
	if err != nil {
		return err
	}
	defer file.Close()

	fileName := fmt.Sprintf("images/players/%d.png", p.Id)
	f, err := os.OpenFile(fileName, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		return err
	}
	defer f.Close()

	io.Copy(f, file)
	_, err = db.Exec(fmt.Sprintf("update players set photo = '%s' where id = %d", fileName, p.Id))

	return err
}

func addTeam(db *sql.DB, r *http.Request) error {
	var t Team
	t.Name = r.FormValue("name")
	t.Abbrev = r.FormValue("abbrev")

	query := fmt.Sprintf("insert into Teams(\"name\", abbrev) values('%s', '%s') returning id", t.Name, t.Abbrev)
	err := db.QueryRow(query).Scan(&t.Id)
	if err != nil {
		return err
	}

	file, _, err := r.FormFile("image")
	if err != nil {
		return err
	}
	defer file.Close()

	fileName := fmt.Sprintf("images/teams/%d.png", t.Id)
	f, err := os.OpenFile(fileName, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		return err
	}
	defer f.Close()

	io.Copy(f, file)
	_, err = db.Exec(fmt.Sprintf("update teams set logo = '%s' where id = %d", fileName, t.Id))

	return err
}

func addOwner(db *sql.DB, r *http.Request) error {
	return nil
}

func addBattingInning(db *sql.DB, r *http.Request) error {
	return nil
}

func insert(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.ParseMultipartForm(1024 * 1024 * 5)

		var err error
		switch r.FormValue("table") {
		case "players":
			err = addPlayer(db, r)
		case "teams":
			err = addTeam(db, r)
		case "owners":
			err = addOwner(db, r)
		case "battingInning":
			err = addBattingInning(db, r)
		default:
			err = errors.New("invalid table")
		}

		if err != nil {
			httpWriteError(w, err.Error())
		} else {
			w.WriteHeader(http.StatusOK)
		}
	}
}

func readTeamData(db *sql.DB, id int) Team {
	var res Team

	query := fmt.Sprintf("select * from Teams where id = '%d'", id)
	team := db.QueryRow(query)
	team.Scan(&res.Id, &res.Name, &res.Abbrev, &res.Logo)

	return res
}

func readTeamStats(db *sql.DB, id int) (TeamStats, error) {
	var stats TeamStats
	var err error

	query := fmt.Sprintf("select count(id) as gamesPlayed, count(distinct seasonNo) as seasonsPlayed from Games where team1 = %d or team2 = %d", id, id)
	queryRowRes := db.QueryRow(query)
	err = queryRowRes.Scan(&stats.GamesPlayed, stats.SeasonsPlayed)
	if err != nil {
		return stats, err
	}

	query = fmt.Sprintf("select count(id) as gamesWon from Games where winner = %d", id)
	queryRowRes = db.QueryRow(query)
	err = queryRowRes.Scan(&stats.GamesWon)
	if err != nil {
		return stats, err
	}

	query = fmt.Sprintf("select count(winner) as count from Seasons where winner = %d", id)
	queryRowRes = db.QueryRow(query)
	err = queryRowRes.Scan(&stats.SeasonsWon)
	if err != nil {
		return stats, err
	}

	query = fmt.Sprintf("select count(playerId) as playerCount from MemberOf where teamId = %d", id)
	queryRowRes = db.QueryRow(query)
	err = queryRowRes.Scan(&stats.PlayerCount)
	if err != nil {
		return stats, err
	}

	return stats, nil
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
		stats, err := readTeamStats(db, team.Id)
		if err != nil {
			httpWriteError(w, err.Error())
			return
		}
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
		query := fmt.Sprintf("select * from Players where LOWER(\"name\") like '%%%s%%'", strings.ToLower(queries["name"][0]))

		p, err := db.Query(query)
		if err != nil {
			panic(err)
		}
		defer p.Close()

		for p.Next() {
			p.Scan(&player.Id, &player.Name, &player.Country, &dob, &player.Affinity, &player.BattingAffinity, &player.BowlingAffinity, &player.Photo)
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
	fileData, err := os.ReadFile(filePath)
	if err != nil {
		httpWriteError(w, err.Error())
		return
	}

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

	handler := mux.NewRouter()

	handler.HandleFunc("/player", player(db))
	handler.HandleFunc("/playerSearch", playerSearch(db))
	handler.HandleFunc("/team", team(db))
	handler.HandleFunc("/image", image)
	handler.HandleFunc("/teams", teams(db))
	handler.HandleFunc("/getEnum", getEnum(db))
	handler.HandleFunc("/insert", insert(db))

	c := cors.AllowAll().Handler(handler)
	http.ListenAndServe(":8000", c)
}
