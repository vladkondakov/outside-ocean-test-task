CREATE TABLE IF NOT EXISTS public.users
(
    uid character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    nickname character varying(30) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (uid),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_nickname_key UNIQUE (nickname)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.refresh_token
(
    hash character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_uid character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT refresh_token_hash_key UNIQUE (hash),
    CONSTRAINT refresh_token_user_uid_key UNIQUE (user_uid),
    CONSTRAINT refresh_token_user_uid_fkey FOREIGN KEY (user_uid)
        REFERENCES public.users (uid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.refresh_token
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.tags
(
    id integer NOT NULL DEFAULT nextval('tags_id_seq'::regclass),
    creator character varying COLLATE pg_catalog."default" NOT NULL,
    name character varying(40) COLLATE pg_catalog."default" NOT NULL,
    sortorder integer DEFAULT 0,
    CONSTRAINT tags_pkey PRIMARY KEY (id),
    CONSTRAINT tags_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE public.tags
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public.user_tag
(
    user_uid character varying COLLATE pg_catalog."default" NOT NULL,
    tag_id integer NOT NULL,
    CONSTRAINT user_tag_pkey PRIMARY KEY (user_uid, tag_id),
    CONSTRAINT user_tag_tag_id_fkey FOREIGN KEY (tag_id)
        REFERENCES public.tags (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT user_tag_user_uid_fkey FOREIGN KEY (user_uid)
        REFERENCES public.users (uid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.user_tag
    OWNER to postgres;