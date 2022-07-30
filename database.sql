-- Table: public.bets

-- DROP TABLE IF EXISTS public.bets;

CREATE TABLE IF NOT EXISTS public.bets
(
    bet_id character varying COLLATE pg_catalog."default",
    bet_team character varying COLLATE pg_catalog."default",
    bet_amount integer,
    game_id character varying COLLATE pg_catalog."default",
    user_id character varying COLLATE pg_catalog."default"
)

ALTER TABLE IF EXISTS public.bets
    OWNER to postgres;

    -- Table: public.games

-- DROP TABLE IF EXISTS public.games;

CREATE TABLE IF NOT EXISTS public.games
(
    home_team character varying COLLATE pg_catalog."default",
    away_team character varying COLLATE pg_catalog."default",
    home_moneyline numeric,
    away_moneyline numeric,
    game_id character varying COLLATE pg_catalog."default"
)

CREATE TABLE IF NOT EXISTS public.user_bets
(
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    bet_id character varying COLLATE pg_catalog."default"
)


TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.games
    OWNER to postgres;