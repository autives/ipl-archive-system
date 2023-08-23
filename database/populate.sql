INSERT INTO Teams ("name", abbrev, logo) VALUES ('Mumbai Indians', 'MI', 'images/mi.png');
INSERT INTO Teams ("name", abbrev, logo) VALUES ('Chennai Super Kings', 'CSK', 'images/csk.png');
INSERT INTO Teams ("name", abbrev, logo) VALUES ('Gujarat Titans', 'GT', 'images/gt.png');
INSERT INTO Teams ("name", abbrev, logo) VALUES ('Rajasthan Royals', 'RR', 'images/rr.png');
INSERT INTO Teams ("name", abbrev, logo) VALUES ('Sunrisers Hyderbad', 'SRH', 'images/srh.png');
INSERT INTO Teams ("name", abbrev, logo) VALUES ('Kolkata Knight Riders', 'KKR', 'images/kkr.png');
INSERT INTO Teams ("name", abbrev, logo) VALUES ('Royal Challengers Bangalore', 'RCB', 'images/rcb.png');
INSERT INTO Teams ("name", abbrev, logo) VALUES ('Lucknow Super Giants', 'LSG', 'images/lsg.png');
INSERT INTO Teams ("name", abbrev, logo) VALUES ('Punjab Kings', 'PBKS', 'images/pbks.png');
INSERT INTO Teams ("name", abbrev, logo) VALUES ('Delhi Capitals', 'DC', 'images/dc.png');

INSERT INTO Players ("name", country, "bYear", "affinity", battingAffinity, bowlingAffinity, photo)
VALUES ('Suresh Raina', 'India', 1987, 'ALL ROUNDER', 'LEFT HANDED', 'LEFT HAND OFF BREAK', 'images/1.png');
INSERT INTO Players ("name", country, "bYear", "affinity", battingAffinity, bowlingAffinity, photo)
VALUES ('Rohit Sharma', 'India', 1985, 'BATSMAN', 'RIGHT HANDED', 'RIGHT HAND OFF BREAK', 'images/6.png');

INSERT INTO Seasons VALUES (2021, 2, 1, 1, 1, 2);

INSERT INTO MemberOf VALUES (1, 2, 2007, 0, 200000000);
INSERT INTO MemberOf VALUES (2, 1, 2013, 0, 1800000000);

INSERT INTO Innings(totalRun, totalWickets, totalBalls) VALUES (200, 4, 99);
INSERT INTO Innings(totalRun, totalWickets, totalBalls) VALUES (199, 6, 120);

INSERT INTO Games(team1, team2, gYear, gMonth, gDay, tossWon, firstBat, winner, venue, innings1, innings2, seasonNo)
VALUES (7, 1, 2023, 6, 1, 1, 7, 1, 0, 2, 1, 2021);

INSERT INTO BattingInnings(playerId, inningsId, "order", runs, ballsPlayed, sixes, fours, dotsPlayed, "out")
VALUES (2, 2, 1, 7, 8, 0, 1, 3, 'LBW');

INSERT INTO BattingInnings(playerId, inningsId, "order", runs, ballsPlayed, sixes, fours, dotsPlayed, "out")
VALUES (2, 1, 2, 14, 8, 2, 1, 3, NULL);
