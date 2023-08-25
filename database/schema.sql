DROP VIEW IF EXISTS BattingStats;
DROP VIEW IF EXISTS BowlingStats;
DROP VIEW IF EXISTS TeamStats;
DROP VIEW IF EXISTS TableInfo;

DROP TABLE IF EXISTS Playoffs;
DROP TABLE IF EXISTS Captaincy;
DROP TABLE IF EXISTS Owns;
DROP TABLE IF EXISTS Owner;
DROP TABLE IF EXISTS BowlingInnings;
DROP TABLE IF EXISTS BattingInnings;
DROP TABLE IF EXISTS Coaches;
DROP TABLE IF EXISTS Coach;
DROP TABLE IF EXISTS MemberOf;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Seasons;
DROP TABLE IF EXISTS Players;
DROP TABLE IF EXISTS Innings;
DROP TABLE IF EXISTS Teams;

DROP TYPE IF EXISTS PlayerAffinity;
DROP TYPE IF EXISTS BattingAffinity;
DROP TYPE IF EXISTS BowlingAffinity;
DROP TYPE IF EXISTS CoachType;
DROP TYPE IF EXISTS WicketMethod;

CREATE TYPE PlayerAffinity AS ENUM ('BATSMAN', 'BOWLER', 'ALL ROUNDER', 'WICKET KEEPER', 'WICKET KEEPER BATSMAN');
CREATE TYPE BattingAffinity AS ENUM ('RIGHT HANDED', 'LEFT HANDED');
CREATE TYPE BowlingAffinity AS ENUM ('RIGHT HAND FAST', 'RIGHT HAND MEDIUM FAST',
                                     'RIGHT HAND OFF BREAK', 'RIGHT HAND LEG BREAK', 'RIGHT HAND WRIST SPIN',
                                     'LEFT HAND FAST', 'LEFT HAND MEDIUM FAST',
                                     'LEFT HAND OFF BREAK', 'LEFT HAND LEG BREAK', 'LEFT HAND WRIST SPIN');
CREATE TYPE CoachType AS ENUM ('HEAD', 'BATTING', 'BOWLING', 'FIELDING', 'FITNESS', 'PERFORMANCE');
CREATE TYPE WicketMethod AS ENUM ('BOWLED', 'CATCH', 'RUNOUT',
                                  'STUMP', 'LBW', 'OTHERS');

CREATE TABLE IF NOT EXISTS Teams (
       id SERIAL NOT NULL PRIMARY KEY,
       "name" VARCHAR(50),
       abbrev VARCHAR(5),

       logo VARCHAR(100) NOT NULL DEFAULT 'images/6.png'
);

CREATE TABLE IF NOT EXISTS Innings (
       id SERIAL NOT NULL PRIMARY KEY,
       totalRun INT NOT NULL,
       totalWickets INT NOT NULL,
       totalBalls INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Players (
       id SERIAL NOT NULL PRIMARY KEY,
       "name" VARCHAR(50) NOT NULL,
       country VARCHAR(50) NOT NULL,
       "bYear" INT,
       "affinity" PlayerAffinity NOT NULL,
       battingAffinity BattingAffinity,
       bowlingAffinity BowlingAffinity,

       photo VARCHAR(100) NOT NULL DEFAULT 'images/6.png'
);

CREATE TABLE IF NOT EXISTS Seasons (
       num INT NOT NULL PRIMARY KEY,
       winner INT NOT NULL DEFAULT 0,
       orangeCap INT NOT NULL,
       purpleCap INT NOT NULL,
       mostValued INT NOT NULL,
       fairPlay INT,

       CONSTRAINT fk_orangeCap FOREIGN KEY(orangeCap) REFERENCES Players(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_purpleCap FOREIGN KEY(purpleCap) REFERENCES Players(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_mostValued FOREIGN KEY(mostValued) REFERENCES Players(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_fairPlay FOREIGN KEY(fairPlay) REFERENCES Teams(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Games (
       id SERIAL NOT NULL PRIMARY KEY,
       team1 INT NOT NULL,
       team2 INT NOT NULL,
       gYear INT NOT NULL,
       gMonth INT NOT NULL,
       gDay INT NOT NULL,
       tossWon INT NOT NULL,
       firstBat INT NOT NULL,
       winner INT,
       venue INT NOT NULL,
       innings1 INT NOT NULL,
       innings2 INT NOT NULL,
       seasonNo INT NOT NULL,

       CONSTRAINT fk_team1 FOREIGN KEY(team1) REFERENCES Teams(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_team2 FOREIGN KEY(team2) REFERENCES Teams(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_tossWon FOREIGN KEY(tossWon) REFERENCES Teams(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_firstBat FOREIGN KEY(firstBat) REFERENCES Teams(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_winner FOREIGN KEY(winner) REFERENCES Teams(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_innings1 FOREIGN KEY(innings1) REFERENCES Innings(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_innings2 FOREIGN KEY(innings2) REFERENCES Innings(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_seasonNo FOREIGN KEY(seasonNo) REFERENCES Seasons(num) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS MemberOf (
       playerId INT NOT NULL,
       teamId INT NOT NULL,
       "from" INT NOT NULL,
       "to" INT NOT NULL DEFAULT 0,
       boughtAt INT,

       PRIMARY KEY (playerId, teamId),

       CONSTRAINT fk_player FOREIGN KEY(playerId) REFERENCES Players(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_team FOREIGN KEY(teamId) REFERENCES Teams(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Coach (
       id SERIAL NOT NULL PRIMARY KEY,
       "name" VARCHAR(50),
       playerId INT
);

CREATE TABLE IF NOT EXISTS Coaches (
       coachId INT NOT NULL,
       teamId INT NOT NULL,
       "from" INT NOT NULL,
       "to" INT,
       "type" CoachType,

       PRIMARY KEY (coachId, teamId, "from"),

       CONSTRAINT fk_coach FOREIGN KEY(coachId) REFERENCES Coach(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_team FOREIGN KEY(teamId) REFERENCES Teams(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS BattingInnings (
       playerId INT NOT NULL,
       inningsId INT NOT NULL,
       "order" INT NOT NULL,
       runs INT NOT NULL DEFAULT 0,
       ballsPlayed INT NOT NULL DEFAULT 1,
       sixes INT NOT NULL DEFAULT 0,
       fours INT NOT NULL DEFAULT 0,
       dotsPlayed INT NOT NULL DEFAULT 0,
       "out" WicketMethod,

       PRIMARY KEY (playerId, inningsId),

       CONSTRAINT fk_player FOREIGN KEY(playerId) REFERENCES Players(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_innings FOREIGN KEY(inningsId) REFERENCES Innings(id)  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS BowlingInnings (
       playerId INT NOT NULL,
       inningsId INT NOT NULL,
       bowlsDelivered INT NOT NULL,
       maidenOvers INT NOT NULL DEFAULT 0,
       runs INT NOT NULL,
       wicketsTaken INT NOT NULL DEFAULT 0,
       wides INT NOT NULL DEFAULT 0,
       noBalls INT NOT NULL DEFAULT 0,
       legBy INT NOT NULL DEFAULT 0,
       "by" INT NOT NULL DEFAULT 0,

       PRIMARY KEY (playerId, inningsId),

       CONSTRAINT fk_player FOREIGN KEY(playerId) REFERENCES Players(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_innings FOREIGN KEY(inningsId) REFERENCES Innings(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Owner (
       id SERIAL NOT NULL PRIMARY KEY,
       "name" VARCHAR(50) NOT NULL,
       netWorth INT
);

CREATE TABLE IF NOT EXISTS Owns (
       ownerId INT NOT NULL,
       teamId INT NOT NULL,
       "from" INT,
       "to" INT,

       PRIMARY KEY (ownerId, teamId),

       CONSTRAINT fk_owner FOREIGN KEY(ownerId) REFERENCES Owner(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_team FOREIGN KEY(teamId) REFERENCES Teams(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Captaincy (
       playerId INT NOT NULL,
       teamId INT NOT NULL,
       "from" INT NOT NULL,
       "to" INT,

       PRIMARY KEY (playerId, teamId),

       CONSTRAINT fk_player FOREIGN KEY(playerId) REFERENCES Players(id) ON DELETE CASCADE ON UPDATE CASCADE,
       CONSTRAINT fk_team FOREIGN KEY(teamId) REFERENCES Teams(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Playoffs (
       gameId INT NOT NULL PRIMARY KEY,
       isFinal BOOLEAN NOT NULL DEFAULT FALSE,
       isQual BOOLEAN NOT NULL DEFAULT FALSE,
       isElim BOOLEAN NOT NULL DEFAULT FALSE,

       CONSTRAINT fk_game FOREIGN KEY(gameId) REFERENCES Games(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE VIEW BattingStats (
       playerId, runs, strikeRate, average, balls, sixes, fours, innings, fifties, centuries, notOut
) AS 
SELECT
       playerId,
       SUM(b.runs),
       CASE WHEN SUM(b.ballsPlayed) > 0 THEN SUM(b.runs)::FLOAT/SUM(b.ballsPlayed) ELSE 0 END,
       CASE WHEN COUNT(b.inningsId) > 0 THEN SUM(b.runs)::FLOAT/COUNT(b.inningsId) ELSE 0 END,
       SUM(b.ballsPlayed),
       SUM(b.sixes),
       SUM(b.fours),
       COUNT(b.inningsId),
       SUM(CASE WHEN b.runs > 50 THEN 1 ELSE 0 END),
       SUM(CASE WHEN b.runs > 100 THEN 1 ELSE 0 END),
       SUM(CASE WHEN b.out IS NULL THEN 1 ELSE 0 END)
FROM BattingInnings b
GROUP BY playerId;

CREATE VIEW BowlingStats (
       playerId, innings, overs, runs, maidenOvers, wickets, extras, average, economy
) AS
SELECT 
       b.playerId,
       COUNT(b.inningsId),
       SUM(b.bowlsDelivered) / 6,
       SUM(b.runs),
       SUM(b.maidenOvers),
       SUM(b.wicketsTaken),
       SUM(b.wides) + SUM(b.noBalls) + SUM(b.by) + SUM(b.legBy),
       SUM(b.runs)::FLOAT / (CASE WHEN SUM(b.wicketsTaken) > 0 THEN SUM(b.wicketsTaken) ELSE 1 END),
       CASE WHEN SUM(b.bowlsDelivered) > 5 THEN (SUM(b.runs)::FLOAT / (SUM(b.bowlsDelivered) / 6)) ELSE 0 END
FROM BowlingInnings b
GROUP BY playerId;

CREATE VIEW TeamStats (
       teamId, playerCount, gamesPlayed, seasonsPlayed, gamesWon, seasonsWon
) AS
SELECT t0.id, COALESCE(t1.playerCount, 0), COALESCE((t2.gamesPlayed1 + t3.gamesPlayed2), 0) AS gamesPlayed, COALESCE((t2.seasonsPlayed1 + t3.seasonsPlayed2), 0) AS seasonsPlayed, COALESCE(t4.gamesWon, 0), COALESCE(t5.seasonsWon, 0)
FROM ((((((SELECT id FROM Teams) t0
LEFT JOIN (SELECT teamId, COUNT(playerId) AS playerCount
           FROM MemberOf
           GROUP BY teamId) t1
ON id = teamId)
LEFT JOIN (SELECT team1, COUNT(id) AS gamesPlayed1, COUNT(DISTINCT seasonNo) AS seasonsPlayed1
           FROM Games
           GROUP BY team1) t2
ON teamId = team1)
LEFT JOIN (SELECT team2, COUNT(id) AS gamesPlayed2, COUNT(DISTINCT seasonNo) AS seasonsPlayed2
           FROM Games
           GROUP BY team2) t3
ON teamId = team2)
LEFT JOIN (SELECT winner AS gwinner, COUNT(winner) AS gamesWon
           FROM Games
           GROUP BY winner) t4
ON teamId = gwinner)
LEFT JOIN (SELECT winner AS swinner, COUNT(winner) AS seasonsWon
           FROM Seasons
           GROUP BY winner) t5
ON teamId = swinner);

CREATE VIEW TableInfo (
       table_name, column_name, data_type, foreign_table, is_serial
) AS
SELECT 
       c.table_name, 
       c.column_name,
       c.data_type,
       (CASE WHEN tc.constraint_type = 'FOREIGN KEY' THEN ccu.table_name END) AS foreign_table,
       (CASE WHEN c.column_default LIKE '%nextval%' THEN 1 ELSE 0 END) AS is_serial
FROM 
       information_schema.columns AS c
       LEFT JOIN information_schema.key_column_usage AS kcu
              ON c.column_name = kcu.column_name
              AND c.table_name = kcu.table_name
       LEFT JOIN information_schema.table_constraints AS tc
              ON kcu.constraint_name = tc.constraint_name
       LEFT JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = kcu.constraint_name;

CREATE OR REPLACE FUNCTION update_season_winner()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.isFinal THEN
       UPDATE Seasons
       SET winner = (SELECT winner FROM Games WHERE id = NEW.gameId)
       WHERE num = (SELECT seasonNo FROM Games WHERE id = NEW.gameId);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_season_winner
AFTER INSERT ON Playoffs
FOR EACH ROW
EXECUTE FUNCTION update_season_winner();


CREATE INDEX IF NOT EXISTS player_name_index ON Players(name); 
