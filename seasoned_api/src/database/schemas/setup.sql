CREATE TABLE IF NOT EXISTS user (
    user_name varchar(127) UNIQUE,
    password varchar(127),
    admin boolean DEFAULT 0,
    email varchar(127) UNIQUE,
    primary key (user_name)
);

CREATE TABLE IF NOT EXISTS settings (
    user_name varchar(127) UNIQUE,
    dark_mode boolean DEFAULT 0,
    plex_userid varchar(127) DEFAULT NULL,
    emoji varchar(16) DEFAULT NULL,
    foreign key(user_name) REFERENCES user(user_name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cache (
    key varchar(255),
    value blob,
    time_to_live INTEGER DEFAULT 60,
    created_at DATE DEFAULT (datetime('now','localtime')),
    primary key(key)
);

CREATE TABLE IF NOT EXISTS search_history (
    id integer,
    user_name varchar(127),
    search_query varchar(255),
    primary key (id),
    foreign key(user_name) REFERENCES user(user_name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS requests(
    id NUMBER,
    title TEXT,
    year NUMBER,
    poster_path TEXT DEFAULT NULL,
    background_path TEXT DEFAULT NULL,
    requested_by varchar(127) DEFAULT NULL,
    ip TEXT,
    date DATE DEFAULT CURRENT_TIMESTAMP,
    status CHAR(25) DEFAULT 'requested' NOT NULL,
    user_agent CHAR(255) DEFAULT NULL,
    type CHAR(50) DEFAULT 'movie',
    foreign key(requested_by) REFERENCES user(user_name) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS request(
   id int not null,
   title text not null,
   year int not null,
   type char(10) not null,
   date timestamp default (strftime('%s', 'now'))
);


CREATE TABLE IF NOT EXISTS stray_eps(
	id TEXT UNIQUE,
	parent TEXT,
	path TEXT,
	name TEXT,
	season NUMBER,
	episode NUMBER,
	video_files TEXT,
	subtitles TEXT,
	trash TEXT,
	verified BOOLEAN DEFAULT 0,
	primary key(id)
);

CREATE TABLE IF NOT EXISTS shows(
	show_names TEXT, 
	date_added DATE, 
	date_modified DATE DEFUALT CURRENT_DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS requested_torrent (
    magnet TEXT UNIQUE,
    torrent_name TEXT,
    tmdb_id TEXT
    date_added DATE DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS deluge_torrent (
    key TEXT UNIQUE,
    name TEXT,
    progress TEXT,
    eta NUMBER,
    save_path TEXT,
    state TEXT,
    paused BOOLEAN,
    finished BOOLEAN,
    files TEXT,
    is_folder BOOLEAN
)
