package main

import (
	"errors"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"reflect"
	"strconv"
	"strings"

	"encoding/json"
	"fmt"
	"os"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

type Player struct {
	Id              int    `json:"id" sql-insert:"f" db:"id"`
	Name            string `json:"name" db:"name"`
	Country         string `json:"country" db:"country"`
	BYear           int    `json:"bYear" db:"bYear"`
	Affinity        string `json:"playerAffinity" db:"affinity"`
	BattingAffinity string `json:"battingAffinity" db:"battingaffinity"`
	BowlingAffinity string `json:"bowlingAffinity" db:"bowlingaffinity"`
	Photo           string `json:"photo" db:"photo"`
}

type Team struct {
	Id     int    `json:"id" sql-insert:"f" db:"id"`
	Name   string `json:"name" db:"name"`
	Abbrev string `json:"abbrev" db:"abbrev"`
	Logo   string `json:"logo" db:"logo"`
}

type Seasons struct {
	Num        int `json:"num" sql-insert:"f" db:"num"`
	Winner     int `json:"winner" db:"winner"`
	OrangeCap  int `json:"orangeCap" db:"orangecap"`
	PurpleCap  int `json:"purpleCap" db:"purplecap"`
	MostValued int `json:"mostValued" db:"mostvalued"`
	FairPlay   int `json:"fairPlay" db:"fairplay"`
}

type Games struct {
	Id       int `json:"id" sql-insert:"f" db:"id"`
	Team1    int `json:"team1" db:"team1"`
	Team2    int `json:"team2" db:"team2"`
	GYear    int `json:"gYear" db:"gyear"`
	GMonth   int `json:"gMonth" db:"gmonth"`
	GDay     int `json:"gDay" db:"gday"`
	TossWon  int `json:"tossWon" db:"tosswon"`
	FirstBat int `json:"firstBat" db:"firstbat"`
	Winner   int `json:"winner" db:"winner"`
	Venue    int `json:"venue" db:"venue"`
	Innings1 int `json:"innings1" db:"innings1"`
	Innings2 int `json:"innings2" db:"innings2"`
	SeasonNo int `json:"seasonNo" db:"seasonno"`
}

type Innings struct {
	Id           int `json:"id" sql-insert:"f" db:"id"`
	TotalRun     int `json:"totalRun" db:"totalrun"`
	TotalWickets int `json:"totalWickets" db:"totalwickets"`
	TotalBalls   int `json:"totalBalls" db:"totalballs"`
}

type BattingInnings struct {
	PlayerId    int    `json:"playerId" db:"playerid"`
	InningsId   int    `json:"inningsId" db:"inningsid"`
	Order       int    `json:"order" db:"order"`
	Runs        int    `json:"runs" db:"runs"`
	BallsPlayed int    `json:"balls" db:"ballsplayed"`
	Sixes       int    `json:"sixes" db:"sixes"`
	Fours       int    `json:"fours" db:"fours"`
	DotsPlayed  int    `json:"dotsPlayed" db:"dotsplayed"`
	Out         string `json:"out" db:"out"`
}

type BowlingInnings struct {
	PlayerId       int `json:"playerId" db:"playerid"`
	InningsId      int `json:"inningsId" db:"inningsid"`
	BowlsDelivered int `json:"bowlsDeliverd" db:"bowlsdelivered"`
	MaidenOvers    int `json:"maidenOvers" db:"maidenovers"`
	Runs           int `json:"runs" db:"runs"`
	WicketsTaken   int `json:"wicketsTaken" db:"wicketstaken"`
	Wides          int `json:"wides" db:"wides"`
	NoBalls        int `json:"noBalls" db:"noballs"`
	LegBy          int `json:"legBy" db:"legby"`
	By             int `json:"by" db:"by"`
}

type Coach struct {
	Id       int    `json:"id" sql-insert:"f" db:"id"`
	Name     string `json:"name" db:"name"`
	PlayerId int    `json:"playerId" db:"playerid"`
}

type Owner struct {
	Id       int    `json:"id" sql-insert:"f" db:"id"`
	Name     string `json:"name" db:"name"`
	NetWorth int    `json:"netWorth" db:"networth"`
}

type MemberOf struct {
	PlayerId int `json:"playerId" db:"playerid"`
	TeamId   int `json:"teamId" db:"teamid"`
	From     int `json:"from" db:"from"`
	To       int `json:"to" db:"to"`
	BoughtAt int `json:"boughtAt" db:"boughtat"`
}

type Coaches struct {
	CoachId int    `json:"coachId" db:"coachid"`
	TeamId  int    `json:"teamId" db:"teamid"`
	From    int    `json:"from" db:"from"`
	To      int    `json:"to" db:"to"`
	Type    string `json:"type" db:"type"`
}

type Owns struct {
	OwnerId int `json:"ownerId" db:"ownerid"`
	TeamId  int `json:"teamId" db:"teamid"`
	From    int `json:"from" db:"from"`
	To      int `json:"to" db:"to"`
}

type Captaincy struct {
	PlayerId int `json:"playerId" db:"playerid"`
	TeamId   int `json:"teamId" db:"teamid"`
	From     int `json:"from" db:"from"`
	To       int `json:"to" db:"to"`
}

type Playoffs struct {
	GameId  int
	IsFinal bool
	IsQual  bool
	IsElim  bool
}

type BattingStats struct {
	PlayerId   int     `json:"playerId" db:"playerid"`
	Runs       int     `json:"runs" db:"runs"`
	StrikeRate float32 `json:"strikeRate" db:"strikerate"`
	Average    float32 `json:"average" db:"average"`
	Balls      int     `json:"balls" db:"balls"`
	Sixes      int     `json:"sixes" db:"sixes"`
	Fours      int     `json:"fours" db:"fours"`
	Innings    int     `json:"innings" db:"innings"`
	Fifties    int     `json:"fifties" db:"fifties"`
	Centuries  int     `json:"centuries" db:"centuries"`
	NotOut     int     `json:"notOut" db:"notout"`
}

type BowlingStats struct {
	PlayerId    int `json:"playerId" db:"playerid"`
	Innings     int `json:"innings" db:"innings"`
	Overs       int `json:"overs" db:"overs"`
	Runs        int `json:"runs" db:"runs"`
	MaidenOvers int `json:"maidenOvers" db:"maidenovers"`
	Wickets     int `json:"wickets" db:"wickets"`
	Extras      int `json:"extras" db:"extras"`
	Average     int `json:"average" db:"average"`
	Economy     int `json:"economy" db:"economy"`
}

type TeamStats struct {
	TeamId        int `json:"teamId" db:"teamid"`
	PlayerCount   int `json:"playerCount" db:"playercount"`
	GamesPlayed   int `json:"gamesPlayed" db:"gamesplayed"`
	SeasonsPlayed int `json:"seasonsPlayed" db:"seasonsplayed"`
	GamesWon      int `json:"gamesWon" db:"gameswon"`
	SeasonsWon    int `json:"seasonsWon" db:"seasonswon"`
}

type TableInfo struct {
	TableName    string `json:"tableName" db:"table_name"`
	ColumnName   string `json:"columnName" db:"column_name"`
	DataType     string `json:"dataType" db:"data_type"`
	ForeignTable string `json:"foreignTable" db:"foreign_table"`
	IsSerial     int    `json:"isSerial" db:"isserial"`
}

var (
	formats = map[reflect.Kind]string{
		reflect.Int:    "%d",
		reflect.String: "'%s'",
	}
)

func httpWriteError(w http.ResponseWriter, str string) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte(str))
}

func genericInsertQuery(db *sqlx.DB, table string, cols interface{}) string {
	val := reflect.ValueOf(cols).Elem()

	var colNames, values strings.Builder
	for i := 0; i < val.NumField(); i++ {
		f := val.Type().Field(i)
		if f.Tag.Get("sql-insert") == "f" {
			continue
		}

		colName := f.Tag.Get("db")
		if colName == "" {
			colName = f.Name
		}

		colNames.WriteString("\"" + colName + "\", ")
		values.WriteString(fmt.Sprintf(formats[f.Type.Kind()], val.Field(i).Interface()) + ", ")
	}
	colStr := strings.TrimRight(colNames.String(), ", ")
	valStr := strings.TrimRight(values.String(), ", ")

	query := fmt.Sprintf("INSERT INTO %s(%s) VALUES (%s)", table, colStr, valStr)
	fmt.Printf("Log [INSERT]: %s\n", query)
	return query
}

func genericParseForm(r *http.Request, data interface{}) {
	v := reflect.TypeOf(data)
	if v.Kind() != reflect.Pointer {
		fmt.Print(v.Kind())
		log.Fatal("Must be a pointer")
	}

	val := reflect.ValueOf(data).Elem()
	for i := 0; i < val.NumField(); i++ {
		f := val.Field(i)
		got := r.FormValue(val.Type().Field(i).Tag.Get("json"))

		if f.Kind() == reflect.Int {
			goti, _ := strconv.ParseInt(got, 10, 32)
			f.SetInt(goti)
		} else if f.Kind() == reflect.Float32 {
			gotf, _ := strconv.ParseFloat(got, 32)
			f.SetFloat(gotf)
		} else if f.Kind() == reflect.String {
			f.SetString(got)
		}
	}
}

func readTable[V Player | Team | BattingStats | BowlingStats | TeamStats](db *sqlx.DB, table string, cond string) (V, error) {
	query := "select * from " + table
	if cond != "" {
		query += " where " + cond
	}

	var res V
	err := db.Get(&res, query)
	fmt.Printf("Log [QUERY]: \"%s\"\n", query)

	if err != nil {
		fmt.Printf("Log [ERROR]: PSQL error on \"%s\": \"%s\"\n", query, err.Error())
		return res, err
	}
	return res, nil
}

func readTableMultiRow[V Player | Team | BattingStats | BowlingStats | TeamStats | MemberOf | TableInfo](db *sqlx.DB, table string, cond string) ([]V, error) {
	query := "select * from " + table
	if cond != "" {
		query += " where " + cond
	}

	var res []V
	err := db.Select(&res, query)
	fmt.Printf("Log [QUERY]: \"%s\"\n", query)

	if err != nil {
		fmt.Printf("Log [ERROR]: PSQL error on \"%s\": \"%s\"\n", query, err.Error())
		return nil, err
	}
	return res, nil
}

func getEnum(db *sqlx.DB) http.HandlerFunc {
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

func player(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		queries := r.URL.Query()
		res := make(map[string]any)

		id, _ := strconv.ParseInt(queries["id"][0], 10, 32)
		data, err := readTable[Player](db, "Players", fmt.Sprintf("id = %d", id))
		if err != nil {
			httpWriteError(w, "Player not found.")
			return
		}

		res["battingStats"] = BattingStats{}
		res["bowlingStats"] = BowlingStats{}
		battingStats, err := readTable[BattingStats](db, "BattingStats", fmt.Sprintf("playerId = %d", data.Id))
		if err == nil {
			res["battingStats"] = battingStats
		}

		bowlingStats, err := readTable[BowlingStats](db, "BowlingStats", fmt.Sprintf("playerId = %d", data.Id))
		if err == nil {
			res["bowlingStats"] = bowlingStats
		}

		w.Header().Set("content-type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		res["data"] = data

		resBody, _ := json.Marshal(res)
		w.Write(resBody)
	}
}

func teams(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		teams, err := readTableMultiRow[Team](db, "Teams", "")
		if err != nil {
			httpWriteError(w, err.Error())
			return
		}
		res := make(map[string][]Team)
		res["teams"] = teams
		resBody, _ := json.Marshal(res)

		w.Header().Set("content-type", "apllication/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(resBody)
	}
}

func team(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		queries := r.URL.Query()
		res := make(map[string]any)

		id, _ := strconv.ParseInt(queries["id"][0], 10, 32)
		team, err := readTable[Team](db, "Teams", fmt.Sprintf("id = %d", id))
		if err != nil {
			httpWriteError(w, err.Error())
			return
		}

		stats, err := readTable[TeamStats](db, "TeamStats", fmt.Sprintf("teamId = %d", id))
		if err != nil {
			httpWriteError(w, err.Error())
			return
		}

		membership, err := readTableMultiRow[MemberOf](db, "MemberOf", fmt.Sprintf("teamId = %d", team.Id))
		if err != nil {
			httpWriteError(w, err.Error())
			return
		}

		var players []Player
		for _, member := range membership {
			if member.To == 0 {
				player, _ := readTable[Player](db, "Players", fmt.Sprintf("id = %d", member.PlayerId))
				players = append(players, player)
			}
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

func playerSearch(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		queries := r.URL.Query()

		players, err := readTableMultiRow[Player](db, "Players", fmt.Sprintf("LOWER(\"name\") like '%%%s%%'", strings.ToLower(queries["name"][0])))
		if err != nil {
			httpWriteError(w, err.Error())
		}

		res := make(map[string]any)
		res["matches"] = players
		resBody, _ := json.Marshal(res)

		w.Header().Set("content-type", "apllication/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
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

func tableInfo(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		queries := r.URL.Query()

		table, err := readTableMultiRow[TableInfo](db, "TableInfo", "table_name = "+strings.ToLower(queries["name"][0]))
		if err != nil {
			httpWriteError(w, err.Error())
		}

		resBody, _ := json.Marshal(table)
		w.Header().Set("content-type", "apllication/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Write(resBody)
	}
}

func addPlayer(db *sqlx.DB, r *http.Request) error {
	var p Player
	genericParseForm(r, &p)
	fmt.Println(p)
	err := db.QueryRow(genericInsertQuery(db, r.FormValue("table"), &p) + "RETURNING \"id\"").Scan(&p.Id)
	if err != nil {
		return err
	}

	var member MemberOf
	genericParseForm(r, &member)
	member.PlayerId = p.Id
	_, err = db.Exec(genericInsertQuery(db, "memberOf", &member))
	fmt.Println("hello")
	if err != nil {
		return err
	}

	file, _, _ := r.FormFile("image")
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

func addTeam(db *sqlx.DB, r *http.Request) error {
	var t Team
	genericParseForm(r, &t)
	err := db.QueryRow(genericInsertQuery(db, r.FormValue("table"), &t) + "RETURNING \"id\"").Scan(&t.Id)
	if err != nil {
		return err
	}

	owner := Owner{0, r.FormValue("owner"), 100000000}
	err = db.QueryRow(genericInsertQuery(db, "owner", &owner) + "RETURNING \"id\"").Scan(&owner.Id)
	if err != nil {
		return err
	}

	owns := Owns{owner.Id, t.Id, 2004, 0}
	_, err = db.Exec(genericInsertQuery(db, "owns", &owns))
	if err != nil {
		return err
	}

	file, _, err := r.FormFile("logo")
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
	fmt.Println(file)

	io.Copy(f, file)
	_, err = db.Exec(fmt.Sprintf("update teams set logo = '%s' where id = %d", fileName, t.Id))

	return err
}

func addOwner(db *sqlx.DB, r *http.Request) error {
	return nil
}

func addGame(db *sqlx.DB, r *http.Request) error {
	var game Games
	genericParseForm(r, &game)
	// fmt.Println(game)

	inningsString := r.FormValue("innings")
	fmt.Println(inningsString)
	var innings [](map[string]([](map[string]any)))
	json.Unmarshal([]byte(inningsString), &innings)

	for i, inning := range innings {
		battingInnings := inning["battingInnings"]
		bowlingInnings := inning["bowlingInnings"]

		var battings []BattingInnings
		var bowlings []BowlingInnings
		var thisInning Innings

		for order, batting := range battingInnings {
			var battingInning BattingInnings
			jsonData, _ := json.Marshal(batting)
			json.Unmarshal(jsonData, &battingInning)
			battingInning.Order = order + 1

			thisInning.TotalBalls += battingInning.BallsPlayed
			battings = append(battings, battingInning)
		}

		for _, bowling := range bowlingInnings {
			var bowlingInning BowlingInnings
			jsonData, _ := json.Marshal(bowling)
			json.Unmarshal(jsonData, &bowlingInning)

			thisInning.TotalRun += bowlingInning.Runs
			thisInning.TotalWickets += bowlingInning.WicketsTaken
			bowlings = append(bowlings, bowlingInning)
		}

		err := db.QueryRow(genericInsertQuery(db, "Innings", &thisInning) + "RETURNING \"id\"").Scan(&thisInning.Id)
		if err != nil {
			return err
		}

		if i == 0 {
			game.Innings1 = thisInning.Id
		} else {
			game.Innings2 = thisInning.Id
		}

		for _, batting := range battings {
			batting.InningsId = thisInning.Id
			_, err := db.Exec(genericInsertQuery(db, "BattingInnings", &batting))
			if err != nil {
				return err
			}
		}
		for _, bowling := range bowlings {
			bowling.InningsId = thisInning.Id
			_, err := db.Exec(genericInsertQuery(db, "BowlingInnings", &bowling))
			if err != nil {
				return err
			}
		}

	}
	_, err := db.Exec(genericInsertQuery(db, "Games", &game))
	if err != nil {
		return err
	}

	return nil
}

func insert(db *sqlx.DB) http.HandlerFunc {
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
		case "game":
			err = addGame(db, r)
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

func deletePlayer(db *sqlx.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, _ := ioutil.ReadAll(r.Body)

		fmt.Println(body)
		id, _ := strconv.ParseInt(string(body), 10, 32)
		query := fmt.Sprintf("DELETE FROM Players where id = %d", id)
		fmt.Printf("Log [DELETE]: %s\n", query)

		_, err := db.Exec(query)
		if err != nil {
			httpWriteError(w, err.Error())
			fmt.Printf("Log [ERROR]: %s", err.Error())
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func main() {
	envFile, _ := os.ReadFile("../database/dbenv.json")
	var dbEnv map[string]any
	json.Unmarshal(envFile, &dbEnv)
	dbInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", dbEnv["host"].(string), int(dbEnv["port"].(float64)), dbEnv["user"].(string), dbEnv["password"].(string), dbEnv["dbname"].(string))

	db, err := sqlx.Open("postgres", dbInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// genericInsert(db, "players", &Player{1, "ashutosh", "nepal", 2004, 3, "batting", "right_hand", "spin", "6.png"})

	handler := mux.NewRouter()

	handler.HandleFunc("/player", player(db))
	handler.HandleFunc("/playerSearch", playerSearch(db))
	handler.HandleFunc("/team", team(db))
	handler.HandleFunc("/image", image)
	handler.HandleFunc("/teams", teams(db))
	handler.HandleFunc("/getEnum", getEnum(db))
	handler.HandleFunc("/insert", insert(db))
	handler.HandleFunc("/tableInfo", tableInfo(db))
	handler.HandleFunc("/delete", deletePlayer(db))

	c := cors.AllowAll().Handler(handler)
	http.ListenAndServe(":8000", c)
}
