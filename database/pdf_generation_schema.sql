--
-- PostgreSQL database dump
--

\restrict lHbYT7wCtIvCLRfTPXeAA1Gd78j2VBoY7nnU4XsgdBaeodbzXz8m27cgCHgKlms

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: pdf_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pdf_templates (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    src text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pdf_templates OWNER TO postgres;

--
-- Name: pdf_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pdf_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pdf_templates_id_seq OWNER TO postgres;

--
-- Name: pdf_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pdf_templates_id_seq OWNED BY public.pdf_templates.id;


--
-- Name: user_template_access; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_template_access (
    id integer NOT NULL,
    user_id integer,
    template_id integer,
    granted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_template_access OWNER TO postgres;

--
-- Name: user_template_access_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_template_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_template_access_id_seq OWNER TO postgres;

--
-- Name: user_template_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_template_access_id_seq OWNED BY public.user_template_access.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    client_id character varying(255) NOT NULL,
    secret_key character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: pdf_templates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_templates ALTER COLUMN id SET DEFAULT nextval('public.pdf_templates_id_seq'::regclass);


--
-- Name: user_template_access id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_template_access ALTER COLUMN id SET DEFAULT nextval('public.user_template_access_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: pdf_templates pdf_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_templates
    ADD CONSTRAINT pdf_templates_pkey PRIMARY KEY (id);


--
-- Name: user_template_access user_template_access_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_template_access
    ADD CONSTRAINT user_template_access_pkey PRIMARY KEY (id);


--
-- Name: user_template_access user_template_access_user_id_template_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_template_access
    ADD CONSTRAINT user_template_access_user_id_template_id_key UNIQUE (user_id, template_id);


--
-- Name: users users_client_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_client_id_key UNIQUE (client_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_user_client_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_client_id ON public.users USING btree (client_id);


--
-- Name: idx_user_template_access_template_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_template_access_template_id ON public.user_template_access USING btree (template_id);


--
-- Name: idx_user_template_access_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_template_access_user_id ON public.user_template_access USING btree (user_id);


--
-- Name: user_template_access user_template_access_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_template_access
    ADD CONSTRAINT user_template_access_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.pdf_templates(id) ON DELETE CASCADE;


--
-- Name: user_template_access user_template_access_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_template_access
    ADD CONSTRAINT user_template_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO pdf_user;


--
-- Name: TABLE pdf_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pdf_templates TO pdf_user;


--
-- Name: SEQUENCE pdf_templates_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.pdf_templates_id_seq TO pdf_user;


--
-- Name: TABLE user_template_access; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_template_access TO pdf_user;


--
-- Name: SEQUENCE user_template_access_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.user_template_access_id_seq TO pdf_user;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO pdf_user;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO pdf_user;


--
-- PostgreSQL database dump complete
--

\unrestrict lHbYT7wCtIvCLRfTPXeAA1Gd78j2VBoY7nnU4XsgdBaeodbzXz8m27cgCHgKlms

