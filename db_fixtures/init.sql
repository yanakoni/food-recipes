create table if not exists public.tag
(
    name varchar(255) not null
        primary key
);

create table if not exists public.area
(
    name varchar(255) not null
        primary key
);

create table if not exists public.category
(
    name varchar(255) not null
        primary key
);

create table if not exists public.ingredient
(
    name varchar(255) not null
        primary key
);

create table if not exists public.user
(
    id            serial
        primary key,
    username varchar(255) unique not null,
    password varchar(255) not null
);

create table if not exists public.meal
(
    id            serial
        primary key,
    name          varchar(255),
    recipe_source varchar(255),
    instructions  text,
    youtube_link  varchar(255),
    meal_thumb    varchar(255),
    category_name varchar(255)
        references public.category,
    area_name     varchar(255)
        references public.area
);

create table if not exists public.meal_tag_association
(
    meal_id  integer      not null
        references public.meal,
    tag_name varchar(255) not null
        references public.tag,
    primary key (meal_id, tag_name)
);

create table if not exists public.ingredient_measure
(
    id              serial
        primary key,
    ingredient_name varchar(255) not null
        references public.ingredient,
    meal_id         integer      not null
        references public.meal,
    measure         varchar(255)
);

create table if not exists public.user_ingredients
(
    id            serial
        primary key,
    ingredient_name varchar(255) not null
        references public.ingredient,
    user_id         integer      not null
        references public.user
);

\COPY area(name) FROM '/tmp/pg-fixtures/area.csv' DELIMITER ',' CSV HEADER;
\COPY category(name) FROM '/tmp/pg-fixtures/category.csv' DELIMITER ',' CSV HEADER;
\COPY ingredient(name) FROM '/tmp/pg-fixtures/ingredient.csv' DELIMITER ',' CSV HEADER;
\COPY tag(name) FROM '/tmp/pg-fixtures/tag.csv' DELIMITER ',' CSV HEADER;
\COPY meal(id,name,recipe_source,instructions,youtube_link,meal_thumb,category_name,area_name) FROM '/tmp/pg-fixtures/meal.csv' DELIMITER ',' CSV HEADER;
\COPY meal_tag_association(meal_id,tag_name) FROM '/tmp/pg-fixtures/meal_tag_association.csv' DELIMITER ',' CSV HEADER;
\COPY ingredient_measure(id,ingredient_name,meal_id,measure) FROM '/tmp/pg-fixtures/ingredient_measure.csv' DELIMITER ',' CSV HEADER;
