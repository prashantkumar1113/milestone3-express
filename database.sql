CREATE TABLE IF NOT EXISTS public.bets
(
    bet_id serial NOT NULL,
    bet_team character varying COLLATE pg_catalog."default" NOT NULL,
    bet_amount integer NOT NULL,
    game_id character varying COLLATE pg_catalog."default" NOT NULL,
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    bet_success boolean NOT NULL DEFAULT false,
    bet_is_completed boolean NOT NULL DEFAULT false,
    PRIMARY KEY (bet_id)
);

CREATE TABLE IF NOT EXISTS public.games
(
    home_team character varying COLLATE pg_catalog."default" NOT NULL,
    away_team character varying COLLATE pg_catalog."default" NOT NULL,
    home_moneyline numeric NOT NULL,
    away_moneyline numeric NOT NULL,
    game_id character varying COLLATE pg_catalog."default" NOT NULL,
    PRIMARY KEY (game_id)
);

CREATE TABLE IF NOT EXISTS public.user_bets
(
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    bet_id character varying COLLATE pg_catalog."default"
);

CREATE TABLE IF NOT EXISTS public.users
(
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    user_picture character varying COLLATE pg_catalog."default",
    user_nickname character varying COLLATE pg_catalog."default",
    user_email character varying COLLATE pg_catalog."default",
    user_bankroll numeric,
    PRIMARY KEY (user_id)
);

ALTER TABLE IF EXISTS public.bets
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;
