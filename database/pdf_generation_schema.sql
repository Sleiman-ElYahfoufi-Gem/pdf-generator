--
-- PostgreSQL database dump
--

\restrict qeynPekjvfZTOf8US0eHSYGtUif6fXVHPb4uQ6QuMMWqowdetwIxd143eh7BtLN

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
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    id integer NOT NULL,
    request_id character varying(255) NOT NULL,
    method character varying(10) NOT NULL,
    url text NOT NULL,
    request_body jsonb,
    query_params jsonb,
    url_params jsonb,
    request_headers jsonb,
    response_status_code integer,
    response_body jsonb,
    response_time_ms integer,
    user_id integer,
    ip_address character varying(50),
    user_agent text,
    error_message text,
    error_stack text,
    request_timestamp timestamp without time zone NOT NULL,
    response_timestamp timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_id_seq OWNER TO postgres;

--
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


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
-- Name: policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.policies (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    policy_number character varying(100),
    status character varying(50) NOT NULL,
    policy_lapsed date NOT NULL,
    premium numeric(10,2),
    premium_calculated_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT policies_status_check CHECK (((status)::text = ANY ((ARRAY['Lapsed'::character varying, 'Underwriter Modification'::character varying, 'Rating Declined'::character varying, 'Rating Success'::character varying, 'Rating Pending'::character varying, 'Review'::character varying])::text[])))
);


ALTER TABLE public.policies OWNER TO postgres;

--
-- Name: policies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.policies_id_seq OWNER TO postgres;

--
-- Name: policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.policies_id_seq OWNED BY public.policies.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


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
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- Name: pdf_templates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_templates ALTER COLUMN id SET DEFAULT nextval('public.pdf_templates_id_seq'::regclass);


--
-- Name: policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies ALTER COLUMN id SET DEFAULT nextval('public.policies_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: user_template_access id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_template_access ALTER COLUMN id SET DEFAULT nextval('public.user_template_access_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: logs logs_request_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_request_id_key UNIQUE (request_id);


--
-- Name: pdf_templates pdf_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pdf_templates
    ADD CONSTRAINT pdf_templates_pkey PRIMARY KEY (id);


--
-- Name: policies policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_pkey PRIMARY KEY (id);


--
-- Name: policies policies_policy_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_policy_number_key UNIQUE (policy_number);


--
-- Name: products products_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_name_key UNIQUE (name);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


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
-- Name: idx_logs_method; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_method ON public.logs USING btree (method);


--
-- Name: idx_logs_request_body_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_request_body_gin ON public.logs USING gin (request_body);


--
-- Name: idx_logs_request_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_request_id ON public.logs USING btree (request_id);


--
-- Name: idx_logs_request_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_request_timestamp ON public.logs USING btree (request_timestamp DESC);


--
-- Name: idx_logs_response_body_gin; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_response_body_gin ON public.logs USING gin (response_body);


--
-- Name: idx_logs_status_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_status_code ON public.logs USING btree (response_status_code);


--
-- Name: idx_logs_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_url ON public.logs USING btree (url);


--
-- Name: idx_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_user_id ON public.logs USING btree (user_id);


--
-- Name: idx_policies_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_created_at ON public.policies USING btree (created_at DESC);


--
-- Name: idx_policies_policy_lapsed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_policy_lapsed ON public.policies USING btree (policy_lapsed);


--
-- Name: idx_policies_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_product_id ON public.policies USING btree (product_id);


--
-- Name: idx_policies_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_status ON public.policies USING btree (status);


--
-- Name: idx_policies_status_policy_lapsed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_status_policy_lapsed ON public.policies USING btree (status, policy_lapsed);


--
-- Name: idx_policies_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_policies_user_id ON public.policies USING btree (user_id);


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
-- Name: logs logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: policies policies_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: policies policies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.policies
    ADD CONSTRAINT policies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


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

\unrestrict qeynPekjvfZTOf8US0eHSYGtUif6fXVHPb4uQ6QuMMWqowdetwIxd143eh7BtLN

