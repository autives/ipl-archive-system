drop view if exists BattingStats;
drop view if exists BowlingStats;
drop view if exists TeamStats;
drop view if exists TableInfo;

drop table if exists Playoffs;
drop table if exists Captaincy;
drop table if exists Owns;
drop table if exists Owner;
drop table if exists BowlingInnings;
drop table if exists BattingInnings;
drop table if exists Coaches;
drop table if exists Coach;
drop table if exists MemberOf;
drop table if exists Games;
drop table if exists Seasons;
drop table if exists Players;
drop table if exists Innings;
drop table if exists Teams;

drop type if exists PlayerAffinity;
drop type if exists BattingAffinity;
drop type if exists BowlingAffinity;
drop type if exists CoachType;
drop type if exists WicketMethod;

create type PlayerAffinity as enum ('BATSMAN', 'BOWLER', 'ALL_ROUNDER', 'WICKET_KEEPER', 'WICKET_KEEPER_BATSMAN');
create type BattingAffinity as enum ('RIGHT_HANDED', 'LEFT_HANDED');
create type BowlingAffinity as enum ('RIGHT_HAND_FAST', 'RIGHT_HAND_MEDIUM_FAST',
                                     'RIGHT_HAND_OFF_BREAK', 'RIGHT_HAND_LEG_BREAK', 'RIGHT_HAND_WRIST_SPIN',
                                     'LEFT_HAND_FAST', 'LEFT_HAND_MEDIUM_FAST',
                                     'LEFT_HAND_OFF_BREAK', 'LEFT_HAND_LEG_BREAK', 'LEFT_HAND_WRIST_SPIN');
create type CoachType as enum ('HEAD', 'BATTING', 'BOWLING', 'FIELDING', 'FITNESS', 'PERFORMANCE');
create type WicketMethod as enum ('BOWLED', 'CATCH', 'RUNOUT',
                                  'STUMP', 'LBW', 'OTHERS');

create table if not exists Teams (
       id serial not null primary key,
       "name" varchar(50),
       abbrev varchar(5),

       logo varchar(100) not null default 'images/6.png'
);

create table if not exists Innings (
       id serial not null primary key,
       totalRun int not null,
       totalWickets int not null,
       totalBalls int not null
);

create table if not exists Players (
       id serial not null primary key,
       "name" varchar(50) not null,
       country varchar(50) not null,
       "bYear" int,
       "affinity" PlayerAffinity NOT NULL,
       battingAffinity BattingAffinity,
       bowlingAffinity BowlingAffinity,

       photo varchar(100) not null default 'images/6.png'
);

create table if not exists Seasons (
       num int not null primary key,
       winner int not null,
       orangeCap int not null,
       purpleCap int not null,
       mostValued int not null,
       fairPlay int,

       constraint fk_winner foreign key (winner) references Teams(id),

       constraint fk_orangeCap foreign key (orangeCap) references Players(id),
       constraint fk_purpleCap foreign key (purpleCap) references Players(id),
       constraint fk_mostValued foreign key (mostValued) references Players(id),

       constraint fk_fairPlay foreign key (fairPlay) references Teams(id)
);

create table if not exists Games (
       id serial not null primary key,
       team1 int not null,
       team2 int not null,
       gYear int not null,
       gMonth int not null,
       gDay int not null,
       tossWon int not null,
       firstBat int not null,
       winner int,
       venue int not null,
       innings1 int not null,
       innings2 int not null,
       seasonNo int not null,

       constraint fk_team1 foreign key (team1) references Teams(id),
       constraint fk_team2 foreign key (team2) references Teams(id),
       constraint fk_tossWon foreign key (tossWon) references Teams(id),
       constraint fk_firstBat foreign key (firstBat) references Teams(id),
       constraint fk_winner foreign key (winner) references Teams(id),

       constraint fk_innings1 foreign key (innings1) references Innings(id),
       constraint fk_innings2 foreign key (innings2) references Innings(id),

       constraint fk_seasonNo foreign key (seasonNo) references Seasons(num)
);


create table if not exists MemberOf (
       playerId int not null,
       teamId int not null,
       "from" int not null,
       "to" int not null default 0,
       boughtAt int,

       primary key (playerId, teamId),

       constraint fk_player foreign key (playerId) references Players(id),
       constraint fk_team foreign key (teamId) references Teams(id)
);

create table if not exists Coach (
       id serial not null primary key,
       "name" varchar(50),
       playerId int
);

create table if not exists Coaches (
       coachId int not null,
       teamId int not null,
       "from" int not null,
       "to" int,
       "type" CoachType,

       primary key (coachId, teamId, "from"),
       
       constraint fk_coach foreign key (coachId) references Coach(id),
       constraint fk_team foreign key (teamId) references Teams(id)
);

create table if not exists BattingInnings (
       playerId int not null,
       inningsId int not null,
       "order" int not null,
       runs int not null default 0,
       ballsPlayed int not null default 1,
       sixes int not null default 0,
       fours int not null default 0,
       dotsPlayed int not null default 0,
       "out" WicketMethod,

       primary key (playerId, inningsId),

       constraint fk_player foreign key (playerId) references Players(id),
       constraint fk_innings foreign key (inningsId) references Innings(id) 
);

create table if not exists BowlingInnings (
       playerId int not null,
       inningsId int not null,
       bowlsDelivered int not null,
       maidenOvers int not null default 0,
       runs int not null,
       wicketsTaken int not null default 0,
       wides int not null default 0,
       noBalls int not null default 0,
       legBy int not null default 0,
       "by" int not null default 0,

       primary key (playerId, inningsId),

       constraint fk_player foreign key (playerId) references Players(id),
       constraint fk_innings foreign key (inningsId) references Innings(id)
);

create table if not exists Owner (
       id serial not null primary key,
       "name" varchar(50) not null,
       netWorth int
);

create table if not exists Owns (
       ownerId int not null,
       teamId int not null,
       "from" int,
       "to" int,

       primary key (ownerId, teamId),

       constraint fk_owner foreign key (ownerId) references Owner(id),
       constraint fk_team foreign key (teamId) references Teams(id)
);

create table if not exists Captaincy (
       playerId int not null,
       teamId int not null,
       "from" int not null,
       "to" int,

       primary key (playerId, teamId),

       constraint fk_player foreign key (playerId) references Players(id),
       constraint fk_team foreign key (teamId) references Teams(id)
);

create table if not exists Playoffs (
       gameId int not null primary key,
       isFinal boolean not null default false,
       isQual boolean not null default false,
       isElim boolean not null default false,

       constraint fk_game foreign key (gameId) references Games(id)
);


create view BattingStats (
       playerId, runs, strikeRate, average, balls, sixes, fours, innings, fifties, centuries, notOut
) as 
select
       playerId,
       sum(b.runs),
       case when sum(b.ballsPlayed) > 0 then sum(b.runs)::float/sum(b.ballsPlayed) else 0 end,
       case when count(b.inningsId) > 0 then sum(b.runs)::float/count(b.inningsId) else 0 end,
       sum(b.ballsPlayed),
       sum(b.sixes),
       sum(b.fours),
       count(b.inningsId),
       sum(case when b.runs > 50 then 1 else 0 end),
       sum(case when b.runs > 100 then 1 else 0 end),
       sum(case when b.out is null then 1 else 0 end)
from BattingInnings b
group by playerId;


create view BowlingStats (
       playerId, innings, overs, runs, maidenOvers, wickets, extras, average, economy
) as
select 
       b.playerId,
       count(b.inningsId),
       sum(b.bowlsDelivered) / 6,
       sum(b.runs),
       sum(b.maidenOvers),
       sum(b.wicketsTaken),
       sum(b.wides) + sum(b.noBalls) + sum(b.by) + sum(b.legBy),
       sum(b.runs)::float / (case when sum(b.wicketsTaken) > 0 then sum(b.wicketsTaken) else 1 end),
       case when sum(b.bowlsDelivered) > 5 then (sum(b.runs)::float / (sum(b.bowlsDelivered) / 6)) else 0 end
from BowlingInnings b
group by playerId;


create view TeamStats (
       teamId, playerCount, gamesPlayed, seasonsPlayed, gamesWon, seasonsWon
) as
select t0.id, coalesce(t1.playerCount, 0), coalesce((t2.gamesPlayed1 + t3.gamesPlayed2), 0) as gamesPlayed, coalesce((t2.seasonsPlayed1 + t3.seasonsPlayed2), 0) as seasonsPlayed, coalesce(t4.gamesWon, 0), coalesce(t5.seasonsWon, 0)
from
(((((
       (select id
        from Teams) t0

left join
       (select teamId, count(playerId) as playerCount
        from MemberOf
        group by teamId) t1
on id = teamId)

left join
       (select team1, count(id) as gamesPlayed1, count(distinct seasonNo) as seasonsPlayed1
        from Games
        group by team1) t2
on teamId = team1)

left join
       (select team2, count(id) as gamesPlayed2, count(distinct seasonNo) as seasonsPlayed2
        from Games
        group by team2) t3
on teamId = team2)

left join 
       (select winner as gwinner, count(winner) as gamesWon
        from Games
        group by winner) t4
on teamId = gwinner)

left join
       (select winner as swinner, count(winner) as seasonsWon
        from Seasons
        group by winner) t5
on teamId = swinner);


create view TableInfo (
       table_name, column_name, data_type, foreign_table, is_serial
) as
select 
       c.table_name, 
       c.column_name,
       c.data_type,
       (case when tc.constraint_type = 'FOREIGN KEY' then ccu.table_name end) as foreign_table,
       (case when c.column_default like '%nextval%' then 1 else 0 end) as is_serial
from 
       information_schema.columns as c
       left join information_schema.key_column_usage as kcu
              on c.column_name = kcu.column_name
              and c.table_name = kcu.table_name
       left join information_schema.table_constraints as tc
              on kcu.constraint_name = tc.constraint_name
       left join information_schema.constraint_column_usage as ccu
              on ccu.constraint_name = kcu.constraint_name
