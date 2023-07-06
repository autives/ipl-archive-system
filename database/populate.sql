insert into Teams("name", abbrev) values('Mumbai Indians', 'MI');
insert into Teams("name", abbrev) values('Chennai Super Kings', 'CSK');
insert into Teams("name", abbrev) values('Gujarat Titans', 'GT');
insert into Teams("name", abbrev) values('Rajasthan Royals', 'RR');
insert into Teams("name", abbrev) values('Sunrisers Hyderbad', 'SRH');
insert into Teams("name", abbrev) values('Kolkata Knight Riders', 'KKR');
insert into Teams("name", abbrev) values('Royal Challengers Bangalore', 'RCB');
insert into Teams("name", abbrev) values('Lucknow Super Giants', 'LSG');
insert into Teams("name", abbrev) values('Punjab Kings', 'PBKS');
insert into Teams("name", abbrev) values('Delhi Capitals', 'DC');



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

