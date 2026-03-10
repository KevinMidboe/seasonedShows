// analytics.js
import { promisify } from "util";
import establishedDatabase from "../database/database.js";

class Analytics {
  constructor(database) {
    this.db = database || establishedDatabase;
    this.requestsTable = "page_requests";
    this.eventsTable = "page_events";

    // Promisify sqlite functions
    this.dbGet = this.db.get;
    this.dbAll = this.db.all;
    this.dbRun = this.db.run;

    this._initTables();
  }

  _initTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS ${this.requestsTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT,
        method TEXT,
        status INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS ${this.eventsTable} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_name TEXT,
        user_id TEXT,
        props TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  // Middleware for logging requests
  middleware() {
    return (req, res, next) => {
      if (req.path === "/metrics") return next();

      try {
        this.db.run(
          `INSERT INTO ${this.requestsTable} (path, method, status) VALUES (?, ?, ?)`,
          [req.path, req.method, res.statusCode || 200]
        );
      } catch (err) {
        console.error("Request logging error:", err);
      }

      next();
    };
  }

  // Track a custom event
  trackEvent(eventName, userId = null, props = {}) {
    try {
      this.db.run(
        `INSERT INTO ${this.eventsTable} (event_name, user_id, props) VALUES (?, ?, ?)`,
        [eventName, userId, JSON.stringify(props)]
      );
    } catch (err) {
      console.error("Event tracking error:", err);
    }
  }

  // Fetch metrics (total requests, total users, counts per event)
  async getMetrics() {
    try {
      const totalRequestsQuery = this.db.get(
        `SELECT COUNT(*) AS total_requests FROM ${this.requestsTable}`
      );
      const totalUsersQuery = this.db.get(
        `SELECT COUNT(DISTINCT user_id) AS total_users FROM ${this.eventsTable}`
      );
      const eventsCountQuery = this.db.all(
        `SELECT event_name, COUNT(*) AS count
         FROM ${this.eventsTable} 
         GROUP BY event_name`
      );

      const [reqRow, userRow, eventsRows] = await Promise.all([
        totalRequestsQuery,
        totalUsersQuery,
        eventsCountQuery
      ]);

      const events = {};
      eventsRows?.forEach(row => {
        events[row.event_name] = row.count;
      });

      return {
        totalRequests: reqRow.total_requests,
        totalUsers: userRow.total_users,
        events
      };
    } catch (err) {
      console.error("Error fetching metrics:", err);
      throw err;
    }
  }
}

export default Analytics;
