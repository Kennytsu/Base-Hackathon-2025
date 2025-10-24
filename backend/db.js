import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'piggyfi.db'));

// Initialize database tables
export function initDatabase() {
  db.serialize(() => {
    // Groups table (piggybanks)
    db.run(`
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        creator_address TEXT NOT NULL,
        invite_code TEXT UNIQUE,
        entry_stake_eth REAL NOT NULL,
        created_at INTEGER NOT NULL,
        is_active INTEGER DEFAULT 1
      )
    `);

    // Members table
    db.run(`
      CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        group_id TEXT NOT NULL,
        fid INTEGER,
        username TEXT,
        address TEXT,
        display_name TEXT,
        pfp_url TEXT,
        joined_at INTEGER NOT NULL,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )
    `);

    // Rules table
    db.run(`
      CREATE TABLE IF NOT EXISTS rules (
        id TEXT PRIMARY KEY,
        group_id TEXT NOT NULL,
        type TEXT NOT NULL,
        label TEXT NOT NULL,
        config TEXT NOT NULL,
        penalty_eth REAL NOT NULL,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )
    `);

    // Violations table
    db.run(`
      CREATE TABLE IF NOT EXISTS violations (
        id TEXT PRIMARY KEY,
        group_id TEXT NOT NULL,
        member_id TEXT NOT NULL,
        rule_id TEXT NOT NULL,
        cast_hash TEXT,
        cast_text TEXT,
        detected_at INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        penalty_applied INTEGER DEFAULT 0,
        tx_hash TEXT,
        FOREIGN KEY (group_id) REFERENCES groups(id),
        FOREIGN KEY (member_id) REFERENCES members(id),
        FOREIGN KEY (rule_id) REFERENCES rules(id)
      )
    `);

    // Last check timestamp for monitoring
    db.run(`
      CREATE TABLE IF NOT EXISTS monitoring_state (
        group_id TEXT PRIMARY KEY,
        last_check_timestamp INTEGER NOT NULL,
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )
    `);

    console.log('✅ Database initialized');
  });
}

// Group operations
export function createGroup(group) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO groups (id, name, creator_address, invite_code, entry_stake_eth, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [group.id, group.name, group.creatorAddress, group.inviteCode, group.entryStakeEth, group.createdAt],
      function (err) {
        if (err) reject(err);
        else resolve({ id: group.id });
      }
    );
  });
}

export function getGroup(groupId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM groups WHERE id = ?', [groupId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function getActiveGroups() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM groups WHERE is_active = 1', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Member operations
export function addMember(member) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO members (id, group_id, fid, username, address, display_name, pfp_url, joined_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [member.id, member.groupId, member.fid, member.username, member.address, member.displayName, member.pfpUrl, member.joinedAt],
      function (err) {
        if (err) reject(err);
        else resolve({ id: member.id });
      }
    );
  });
}

export function getGroupMembers(groupId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM members WHERE group_id = ? AND is_active = 1', [groupId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Rule operations
export function addRule(rule) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO rules (id, group_id, type, label, config, penalty_eth)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [rule.id, rule.groupId, rule.type, rule.label, JSON.stringify(rule.config), rule.penaltyEth],
      function (err) {
        if (err) reject(err);
        else resolve({ id: rule.id });
      }
    );
  });
}

export function getGroupRules(groupId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM rules WHERE group_id = ? AND is_active = 1', [groupId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows?.map(r => ({ ...r, config: JSON.parse(r.config) })));
    });
  });
}

// Violation operations
export function createViolation(violation) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO violations (id, group_id, member_id, rule_id, cast_hash, cast_text, detected_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [violation.id, violation.groupId, violation.memberId, violation.ruleId, violation.castHash, violation.castText, violation.detectedAt],
      function (err) {
        if (err) reject(err);
        else resolve({ id: violation.id });
      }
    );
  });
}

export function getGroupViolations(groupId, status = null) {
  return new Promise((resolve, reject) => {
    const query = status
      ? 'SELECT * FROM violations WHERE group_id = ? AND status = ? ORDER BY detected_at DESC'
      : 'SELECT * FROM violations WHERE group_id = ? ORDER BY detected_at DESC';
    const params = status ? [groupId, status] : [groupId];

    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function updateViolationStatus(violationId, status, txHash = null) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE violations SET status = ?, penalty_applied = ?, tx_hash = ? WHERE id = ?',
      [status, status === 'applied' ? 1 : 0, txHash, violationId],
      function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      }
    );
  });
}

// Monitoring state
export function updateMonitoringState(groupId, timestamp) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO monitoring_state (group_id, last_check_timestamp)
       VALUES (?, ?)`,
      [groupId, timestamp],
      function (err) {
        if (err) reject(err);
        else resolve({ timestamp });
      }
    );
  });
}

export function getMonitoringState(groupId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM monitoring_state WHERE group_id = ?', [groupId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export { db };

