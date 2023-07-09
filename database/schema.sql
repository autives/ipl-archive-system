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
       abbrev varchar(5)
);

create table if not exists Innings (
       id serial not null primary key,
       totalRun int not null,
       totalWickets int not null,
       bowlsDelivered int not null
);

create table if not exists Players (
       id serial not null primary key,
       "name" varchar(50) not null,
       country varchar(50) not null,
       dob date,
       "affinity" PlayerAffinity NOT NULL,
       battingAffinity BattingAffinity,
       bowlingAffinity BowlingAffinity

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
       playedOn date not null,
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
       "from" date not null,
       "to" date,
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
       "from" date not null,
       "to" date,
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
       ballPlayed int not null default 1,
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
       "from" date,
       "to" date,

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
       seasonNo int not null,
       gameId int not null,
       isFinal boolean not null default false,
       isQual boolean not null default false,
       isElim boolean not null default false,

       primary key (seasonNo, gameId),

       constraint fk_seacon foreign key (seasonNo) references Seasons(num),
       constraint fk_game foreign key (gameId) references Games(id)
);
