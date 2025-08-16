create table "public"."garments" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text,
    "category" text,
    "colour" text,
    "brand" text,
    "image_url" text,
    "notes" text,
    "created_at" time with time zone default now()
);


create table "public"."outfits" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "name" text,
    "description" text,
    "image_url" text,
    "garment_ids" text[] not null,
    "created_at" time with time zone not null
);


alter table "public"."outfits" enable row level security;

CREATE UNIQUE INDEX garments_pkey ON public.garments USING btree (id);

CREATE UNIQUE INDEX outfits_pkey ON public.outfits USING btree (id);

alter table "public"."garments" add constraint "garments_pkey" PRIMARY KEY using index "garments_pkey";

alter table "public"."outfits" add constraint "outfits_pkey" PRIMARY KEY using index "outfits_pkey";

grant delete on table "public"."garments" to "anon";

grant insert on table "public"."garments" to "anon";

grant references on table "public"."garments" to "anon";

grant select on table "public"."garments" to "anon";

grant trigger on table "public"."garments" to "anon";

grant truncate on table "public"."garments" to "anon";

grant update on table "public"."garments" to "anon";

grant delete on table "public"."garments" to "authenticated";

grant insert on table "public"."garments" to "authenticated";

grant references on table "public"."garments" to "authenticated";

grant select on table "public"."garments" to "authenticated";

grant trigger on table "public"."garments" to "authenticated";

grant truncate on table "public"."garments" to "authenticated";

grant update on table "public"."garments" to "authenticated";

grant delete on table "public"."garments" to "service_role";

grant insert on table "public"."garments" to "service_role";

grant references on table "public"."garments" to "service_role";

grant select on table "public"."garments" to "service_role";

grant trigger on table "public"."garments" to "service_role";

grant truncate on table "public"."garments" to "service_role";

grant update on table "public"."garments" to "service_role";

grant delete on table "public"."outfits" to "anon";

grant insert on table "public"."outfits" to "anon";

grant references on table "public"."outfits" to "anon";

grant select on table "public"."outfits" to "anon";

grant trigger on table "public"."outfits" to "anon";

grant truncate on table "public"."outfits" to "anon";

grant update on table "public"."outfits" to "anon";

grant delete on table "public"."outfits" to "authenticated";

grant insert on table "public"."outfits" to "authenticated";

grant references on table "public"."outfits" to "authenticated";

grant select on table "public"."outfits" to "authenticated";

grant trigger on table "public"."outfits" to "authenticated";

grant truncate on table "public"."outfits" to "authenticated";

grant update on table "public"."outfits" to "authenticated";

grant delete on table "public"."outfits" to "service_role";

grant insert on table "public"."outfits" to "service_role";

grant references on table "public"."outfits" to "service_role";

grant select on table "public"."outfits" to "service_role";

grant trigger on table "public"."outfits" to "service_role";

grant truncate on table "public"."outfits" to "service_role";

grant update on table "public"."outfits" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."garments"
as permissive
for all
to public
using ((( SELECT auth.uid() AS uid) = user_id));



