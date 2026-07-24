CREATE TABLE IF NOT EXISTS public.workplaces (
    id uuid NOT NULL UNIQUE,
    manager_password character varying NOT NULL,
    operator_password character varying NOT NULL,
    company_name character varying NOT NULL,
    login_name character varying NOT NULL UNIQUE,
    CONSTRAINT workplaces_pkey PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS public.operators (
    id uuid NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    phone character varying NOT NULL,
    workplace_id uuid NOT NULL,
    internal_number integer NOT NULL,
    CONSTRAINT operators_pkey PRIMARY KEY (id),
    CONSTRAINT operators_workplace_id_fkey FOREIGN KEY (workplace_id) REFERENCES public.workplaces(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid NOT NULL,
    task character varying NOT NULL,
    workplace_id uuid NOT NULL,
    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT tasks_workplace_id_fkey FOREIGN KEY (workplace_id) REFERENCES public.workplaces(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS public.active_tasks (
    id uuid NOT NULL,
    operator_id uuid NOT NULL,
    task_id uuid NOT NULL,
    time_start bigint NOT NULL,
    workplace_id uuid NOT NULL,
    CONSTRAINT active_tasks_pkey PRIMARY KEY (id),
    CONSTRAINT active_tasks_operator_id_fkey FOREIGN KEY (operator_id) REFERENCES public.operators(id) ON DELETE CASCADE,
    CONSTRAINT active_tasks_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE,
    CONSTRAINT active_tasks_workplace_id_fkey FOREIGN KEY (workplace_id) REFERENCES public.workplaces(id) ON DELETE CASCADE
);

create table if not exists public.allowed_devices (
  id uuid not null,
  company_id uuid not null,
  fingerprint character varying(40) not null,
  name character varying(40) not null,
  constraint allowed_devices_pkey primary key (id),
  constraint allowed_devices_companyid_fkey foreign KEY (company_id) references workplaces (id) on delete CASCADE
) TABLESPACE pg_default;


