insert into Teams("name", abbrev, logo) values('Mumbai Indians', 'MI', 'images/mi.png');
insert into Teams("name", abbrev, logo) values('Chennai Super Kings', 'CSK', 'images/csk.png');
insert into Teams("name", abbrev, logo) values('Gujarat Titans', 'GT', 'images/gt.png');
insert into Teams("name", abbrev, logo) values('Rajasthan Royals', 'RR', 'images/rr.png');
insert into Teams("name", abbrev, logo) values('Sunrisers Hyderbad', 'SRH', 'images/srh.png');
insert into Teams("name", abbrev, logo) values('Kolkata Knight Riders', 'KKR', 'images/kkr.png');
insert into Teams("name", abbrev, logo) values('Royal Challengers Bangalore', 'RCB', 'images/rcb.png');
insert into Teams("name", abbrev, logo) values('Lucknow Super Giants', 'LSG', 'images/lsg.png');
insert into Teams("name", abbrev, logo) values('Punjab Kings', 'PBKS', 'images/pbks.png');
insert into Teams("name", abbrev, logo) values('Delhi Capitals', 'DC', 'images/dc.png');



insert into Players("name", country, dob, "affinity", battingAffinity, bowlingAffinity) values('Suresh Raina', 'India', date('27 Nov 1987'), 'ALL_ROUNDER', 'LEFT_HANDED', 'LEFT_HAND_OFF_BREAK');
insert into Players("name", country, dob, "affinity", battingAffinity, bowlingAffinity) values('Rohit Sharma', 'India', date('27 Nov 1987'), 'BATSMAN', 'RIGHT_HANDED', 'RIGHT_HAND_OFF_BREAK');

insert into Seasons values (2021, 2, 1, 1, 1, 2);

insert into MemberOf values(1, 2, date('7 Jun 2007'), date('18 Jun 2021'), 200000000);
insert into MemberOf values(2, 2, date('8 July 2013'), null, 1800000000);

insert into Innings(totalRun, totalWickets, bowlsDelivered) values(200, 4, 99);
insert into Innings(totalRun, totalWickets, bowlsDelivered) values(199, 6, 120);

insert into Games(team1, team2, playedOn, tossWon, firstBat, winner, venue, innings1, innings2, seasonNo)
    values(7, 1, date('9 May 2023'), 1, 7, 1, 0, 2, 1, 2021);

insert into BattingInnings(playerId, inningsId, "order", runs, ballPlayed, sixes, fours, dotsPlayed, "out")
    values(2, 2, 1, 7, 8, 0, 1, 3, 'LBW');

insert into BattingInnings(playerId, inningsId, "order", runs, ballPlayed, sixes, fours, dotsPlayed, "out")
    values(2, 1, 2, 14, 8, 2, 1, 3, null);

