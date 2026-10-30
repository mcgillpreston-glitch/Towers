CREATE TABLE IF NOT EXISTS runs (id TEXT PRIMARY KEY, uid TEXT, handle TEXT, ver INTEGER, build TEXT, mode TEXT, diff TEXT, winner INTEGER, side INTEGER, rounds INTEGER, src TEXT, t INTEGER, body TEXT);
CREATE INDEX IF NOT EXISTS runs_t ON runs (t);
CREATE INDEX IF NOT EXISTS runs_build ON runs (build, t);
